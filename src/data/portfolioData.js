// ============================================================
// portfolioData.js — ALL content for the portfolio lives here.
// Components only read from this file.
// ============================================================

export const personalInfo = {
  name: "Diya B Horapeti",
  brandName: "Diya B Horapeti",
  role: "Data Analyst",
  city: "Bengaluru, India",
  timezone: "Asia/Kolkata", // IANA timezone used by the live clock in the HUD
  email: "diyahorapeti@gmail.com",
  phone: "+91 89715 03868",
  availability: "Open to internships & full-time roles",
};

export const academy = {
  name: "TAP Academy",
  url: "https://thetapacademy.com/",
};

export const socialLinks = {
  github: "https://github.com/diyahorapeti",
  linkedin: "https://www.linkedin.com/in/diya-horapeti-0a5012382",
  instagram: "", // not provided — hidden automatically by components
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#projects" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

export const heroContent = {
  eyebrow: "PORTFOLIO — 2026",
  intro:
    "I transform raw data into meaningful insights using data analysis, visualization, and reporting tools.",
  statusLines: [
    "Analyzing data with Python & SQL",
    "Exploring data with Pandas & NumPy",
    "Building dashboards with Power BI & Tableau",
  ],
  ctaPrimary: { label: "View projects", href: "#projects" },
  ctaSecondary: { label: "Get in touch", href: "#contact" },
};

export const aboutContent = {
  label: "01 / About",
  heading: "Data analyst driven by curiosity and insight.",
  paragraph:
    "I am an aspiring Data Analyst passionate about exploring data and discovering meaningful insights. I have hands-on skills in Python, SQL, Pandas, NumPy, Statistics, Excel, Power BI, and Tableau — skills I am actively deepening through the placement training program at TAP Academy. I enjoy data cleaning, statistical analysis, and visualization to identify trends and support data-driven decision-making.",
  stats: [
    { value: 8, suffix: "+", label: "Data analysis skills" },
    { value: 3, suffix: "+", label: "Data visualization tools" },
    { value: 2, suffix: "+", label: "Practical projects" },
  ],
};

// introVideo is omitted — no self-introduction video was provided.

export const skillGroups = [
  {
    title: "Programming",
    items: ["Python", "SQL"],
  },
  {
    title: "Python Libraries",
    items: ["Pandas", "NumPy"],
  },
  {
    title: "Statistics",
    items: ["Descriptive Statistics", "Probability", "Statistical Analysis"],
  },
  {
    title: "Data Visualization & BI",
    items: ["Microsoft Excel", "Power BI", "Tableau"],
  },
];

export const projects = [
  {
    id: "project-1",
    number: "01",
    title: "Diabetic Retinopathy Detection",
    description:
      "Developed a deep learning system to classify diabetic retinopathy into five stages from retinal images, enabling early clinical screening.",
    tags: ["Python", "PyTorch", "Flask"],
    year: "2025",
    liveUrl: "",
    githubUrl: "https://github.com/diyahorapeti/diabetic-retinopathy-detection",
    // no video provided
  },
  {
    id: "project-2",
    number: "02",
    title: "Mane-Kelsa — Android App",
    description:
      "Built an Android application that connects residents with verified domestic workers and gardeners, with real-time booking via Firebase.",
    tags: ["Kotlin", "Android Studio", "Firebase"],
    year: "2026",
    liveUrl: "",
    githubUrl: "https://github.com/diyahorapeti/Mane-Kelsa",
    // no video provided
  },
];

export const experience = [
  {
    period: "2026 — Present",
    role: "Data Analytics Intern",
    org: "TAP Academy",
    description:
      "Learning Python, SQL, Statistics, and Data Visualization through structured placement training.",
  },
  {
    period: "2025 — 2026",
    role: "Android App Development Internship",
    org: "MindMatrix",
    description:
      "Developed the Mane-Kelsa application using Kotlin and Firebase for real-time domestic worker bookings.",
  },
  {
    period: "2022 — 2026",
    role: "B.E. in AI & Machine Learning",
    org: "Bangalore College of Engineering and Technology",
    description:
      "Completed undergraduate studies and academic projects in artificial intelligence and machine learning.",
  },
];

export const contactContent = {
  label: "04 / Contact",
  heading: "Let's turn data into decisions.",
  note: "Have a role, a project, or a question? Send a message — I reply within a day.",
};

export const footerContent = {
  tagline: "Designed & built by hand.",
};

// EmailJS — values come from .env.local (variables must start with VITE_)
export const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_EMAILJS_SERVICE_ID",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_EMAILJS_TEMPLATE_ID",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_EMAILJS_PUBLIC_KEY",
};
