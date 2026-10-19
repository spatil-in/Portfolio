// Projects are drawn from the resume. Add `link` (live URL) to any project once you have one;
// it appears as a "Visit project" button in the detail view.
export const projects = [
  {
    id: "cms-dashboard",
    title: "CMS Dashboard Platform",
    type: "React",
    category: "React",
    year: "Ongoing",
    visual: "dashboard",
    description:
      "Responsive dashboard for managing blogs, posts and news content, with role-based flows for Admin and Editor access.",
    features: [
      "Role-based UI flows for Admin and Editor",
      "Reusable, scalable component library",
      "REST API integration for dynamic content",
    ],
    stack: ["React.js", "Tailwind CSS", "SCSS", "REST APIs"],
    number: "01",
  },
  {
    id: "wordpress-sites",
    title: "WordPress Websites",
    type: "WordPress",
    category: "WordPress",
    year: "2024 — Now",
    visual: "wordpress",
    description:
      "Business websites built and maintained with child themes, custom post types, taxonomies and shortcodes.",
    features: [
      "Child themes and responsive layouts",
      "Hooks, WP Loop, custom post types and taxonomies",
      "Pages built with Elementor and WPBakery",
    ],
    stack: ["WordPress", "PHP", "Elementor", "WPBakery"],
    number: "02",
  },
  {
    id: "dashboard-apps",
    title: "Dashboard Applications",
    type: "React",
    category: "React",
    year: "2024 — Now",
    visual: "apps",
    description:
      "Data-driven dashboard UIs that pull live data from REST APIs and keep state clean with Hooks, Context and Redux.",
    features: [
      "REST API integration and dynamic data",
      "State with Hooks, Context API and Redux",
      "Figma designs to pixel-perfect components",
    ],
    stack: ["React.js", "Redux", "Tailwind CSS", "Bootstrap"],
    number: "03",
  },
  {
    id: "portfolio",
    title: "This Portfolio",
    type: "React",
    category: "React",
    year: "2026",
    visual: "portfolio",
    description:
      "A personal portfolio designed as a smooth, cinematic scroll through my work, with motion built on GSAP and Lenis.",
    features: [
      "ScrollTrigger-driven storytelling",
      "Smooth scrolling and custom motion system",
      "Responsive across phone, tablet and desktop",
    ],
    stack: ["React", "GSAP", "Lenis", "Tailwind CSS"],
    number: "04",
  },
];

export const projectFilters = [
  { label: "All projects", value: "All" },
  { label: "React", value: "React" },
  { label: "WordPress", value: "WordPress" },
];
