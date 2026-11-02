import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * HeroScene — live 3D "signal core" centrepiece rendered with Three.js.
 *
 * Contains:
 *   • Outer shell  – EdgesGeometry of an Icosahedron, signal-orange lines
 *   • Inner core   – Points cloud of a denser Icosahedron, bone-white dots
 *   • Orbit ring   – LineLoop from an EllipseCurve, tilted like an equator
 *
 * Behaviour:
 *   • Intro: scale 0.6 → 1, edge opacity 0 → 0.9 over 1 s (ease-out)
 *   • Auto-spin on Y axis, inner core counter-rotates
 *   • Mouse tilt: group leans toward the pointer
 *   • Drag on canvas: adds extra spin
 *   • Pauses rendering while off-screen (IntersectionObserver)
 *   • Respects prefers-reduced-motion
 *   • Full cleanup on unmount
 */
export default function HeroScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // ── Renderer ────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // ── Scene ────────────────────────────────────────────────────────
    const scene = new THREE.Scene();

    // ── Camera ───────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 7;

    // ── Group that holds all objects ─────────────────────────────────
    const group = new THREE.Group();
    scene.add(group);

    // 1. Outer shell — icosahedron edges in signal orange (#ff5b1f)
    const icoSourceGeo = new THREE.IcosahedronGeometry(1.9, 1);
    const edgeGeo = new THREE.EdgesGeometry(icoSourceGeo);
    icoSourceGeo.dispose(); // no longer needed after EdgesGeometry is built
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xff5b1f,
      transparent: true,
      // Start invisible so the intro can fade it in; skip for reduced motion
      opacity: prefersReducedMotion ? 0.9 : 0,
    });
    const edgeMesh = new THREE.LineSegments(edgeGeo, edgeMat);
    group.add(edgeMesh);

    // 2. Inner core — dense point cloud in bone-white (#e8e6df)
    const pointsGeo = new THREE.IcosahedronGeometry(1.15, 4);
    const pointsMat = new THREE.PointsMaterial({
      color: 0xe8e6df,
      size: 0.025,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });
    const pointsMesh = new THREE.Points(pointsGeo, pointsMat);
    group.add(pointsMesh);

    // 3. Orbit ring — EllipseCurve radius 2.7, tilted like a planet equator
    const curve = new THREE.EllipseCurve(
      0, 0,   // centre
      2.7, 2.7, // xRadius, yRadius
      0, Math.PI * 2, // start / end angle
      false, 0        // clockwise, rotation
    );
    // getPoints(128) → 129 pts; for a closed LineLoop this is ideal
    const ringPoints = curve.getPoints(128);
    const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
    const ringMat = new THREE.LineBasicMaterial({
      color: 0xe8e6df,
      transparent: true,
      opacity: 0.18,
    });
    const ring = new THREE.LineLoop(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.4; // tilt toward viewer
    group.add(ring);

    // Start scale at 0.6 for intro (skip if reduced motion)
    if (!prefersReducedMotion) {
      group.scale.setScalar(0.6);
    }

    // ── Animation state ──────────────────────────────────────────────
    let rafId = null;
    let isVisible = true;
    let introStartTs = null;      // timestamp of first rendered frame
    const INTRO_MS = 1000;        // intro materialise duration in ms

    let autoSpinY = 0;            // accumulated Y auto-spin (radians)
    let tgtRotX = 0;              // target group rotation.x from mouse
    let tgtRotY = 0;              // target group rotation.y offset from mouse

    let isDragging = false;
    let prevDragX = 0;

    // Tracks "active" time so inner-core spin pauses off-screen
    let activeTime = 0;
    let lastTs = null;

    // ── Animation loop ───────────────────────────────────────────────
    const animate = (timestamp) => {
      rafId = requestAnimationFrame(animate);

      // Pause rendering while the container is off-screen
      if (!isVisible) {
        lastTs = null; // reset delta so time doesn't jump on re-entry
        return;
      }

      // Accumulate active time (excludes off-screen gaps)
      if (lastTs !== null) {
        activeTime += (timestamp - lastTs) / 1000;
      }
      lastTs = timestamp;

      // ── Intro materialise ──────────────────────────────────────────
      if (!prefersReducedMotion) {
        if (introStartTs === null) introStartTs = timestamp;
        const introElapsed = timestamp - introStartTs;

        if (introElapsed < INTRO_MS) {
          // Ease-out cubic: starts fast, slows into the final value
          const t = introElapsed / INTRO_MS;
          const eased = 1 - Math.pow(1 - t, 3);
          group.scale.setScalar(0.6 + 0.4 * eased);
          edgeMat.opacity = 0.9 * eased;
        } else {
          // Clamp to final values after intro ends
          group.scale.setScalar(1);
          edgeMat.opacity = 0.9;
        }

        // Auto-spin: +0.0025 rad per frame on Y
        autoSpinY += 0.0025;
      }

      // ── Ease group toward target rotation ──────────────────────────
      // Final target Y is auto-spin plus the mouse-lean offset
      const finalTargetY = autoSpinY + tgtRotY;
      group.rotation.y += (finalTargetY - group.rotation.y) * 0.06;
      group.rotation.x += (tgtRotX - group.rotation.x) * 0.06;

      // ── Inner core counter-rotates (independent of group) ──────────
      pointsMesh.rotation.y = -activeTime * 0.15;

      renderer.render(scene, camera);
    };

    rafId = requestAnimationFrame(animate);

    // ── Pointer interaction ──────────────────────────────────────────

    // Mouse tilt: group leans toward the pointer position
    const onPointerMove = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;  // -0.5 … 0.5
      const ny = e.clientY / window.innerHeight - 0.5; // -0.5 … 0.5
      tgtRotY = nx * 0.4;
      tgtRotX = ny * 0.25;

      // Drag: add extra spin proportional to horizontal pointer delta
      if (isDragging) {
        const delta = e.clientX - prevDragX;
        autoSpinY += delta * 0.01;
        prevDragX = e.clientX;
      }
    };

    const onPointerDown = (e) => {
      isDragging = true;
      prevDragX = e.clientX;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    window.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    // ── Resize handler ───────────────────────────────────────────────
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    // ── Pause while off-screen ───────────────────────────────────────
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(container);

    // ── Cleanup on unmount ───────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();

      window.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);

      // Dispose every geometry and material
      edgeGeo.dispose();
      edgeMat.dispose();
      pointsGeo.dispose();
      pointsMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();

      // Tear down the WebGL context
      renderer.dispose();
      renderer.forceContextLoss();

      // Remove the canvas from the DOM
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []); // run once on mount

  return (
    <div
      ref={containerRef}
      className="h-full w-full cursor-grab active:cursor-grabbing"
      role="img"
      aria-label="Interactive 3D shape — drag to rotate"
      data-cursor="hot"
    />
  );
}
