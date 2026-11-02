# Diya B Horapeti — Portfolio

A "Signal HUD" style data analyst portfolio — dark, technical, and motion-led, built with React 19, Vite, and Tailwind CSS 4.

**Live site:** https://YOUR-SITE-URL/

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** + **Vite** | Component framework and fast dev/build tooling |
| **Tailwind CSS 4** | Utility-first styling via `@tailwindcss/vite` plugin |
| **GSAP** + **ScrollTrigger** | Scroll-driven entrance and parallax animations |
| **Lenis** | Buttery smooth native scroll |
| **Three.js** | Interactive 3D hero centrepiece |
| **EmailJS** | Contact form delivery without a backend |

---

## Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (http://localhost:5173)
npm run dev

# 3. Production build (outputs to dist/)
npm run build
```

---

## Environment Variables

Create a `.env.local` file in the project root and add the three EmailJS values (all must start with `VITE_` so Vite exposes them to the browser):

```
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

Obtain these from your [EmailJS dashboard](https://www.emailjs.com/).

---

## GitHub Topics

`tap-academy` · `tap-academy-student` · `placement-training` · `augmented-reality`

---

Built during the placement training program at [TAP Academy](https://thetapacademy.com/) (full-stack development, AI and augmented reality training).
