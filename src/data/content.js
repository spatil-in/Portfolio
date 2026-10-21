/* All site copy lives here. Details come from Sanket Patil's resume. */

export const copy = {
  navigation: [
    { label: "About", href: "#about" },
    { label: "Expertise", href: "#skills" },
    { label: "Work", href: "#projects" },
    { label: "Experience", href: "#journey" },
  ],
  hero: {
    availability: "OPEN TO NEW OPPORTUNITIES",
    lead: "Hi, I’m",
    name: "Sanket Patil",
    role: "Web Developer",
    location: "Pune, India",
    introduction:
      "Web developer with 2+ years of experience building responsive, scalable web apps with React.js, Tailwind CSS and WordPress. I turn Figma designs into pixel-perfect, reusable UI.",
    workCta: "View my work",
    contactCta: "Contact me",
    resumeCta: "Resume",
    scrollPrompt: "SCROLL TO EXPLORE",
  },
  about: {
    label: "A LITTLE ABOUT ME",
    aside: ["CURIOUS BY NATURE", "INTENTIONAL BY DESIGN"],
    statement: [
      { text: "I’m a web developer who cares about how things " },
      { text: "work", emphasis: true },
      { text: ", how they " },
      { text: "feel", emphasis: true },
      { text: ", and the people on the other side of the screen." },
    ],
    profile:
      "I build responsive, scalable interfaces with React.js and modern front-end tools, and I’m just as comfortable customising WordPress with PHP. I care about performance, accessibility and cross-browser polish, and I work in Agile teams using Git. Right now I’m looking to grow and contribute to impactful projects.",
    pillars: [
      {
        number: "01",
        title: "Frontend development",
        text: "React.js, Redux and Tailwind CSS — reusable components built pixel-perfect from Figma designs.",
        icon: "⌘",
      },
      {
        number: "02",
        title: "WordPress development",
        text: "Child themes, hooks, custom post types and shortcodes, with pages built in Elementor and WPBakery.",
        icon: "↗",
      },
      {
        number: "03",
        title: "Quality & collaboration",
        text: "Performance tuning, accessibility and cross-browser care, shipped with Git in Agile teams.",
        icon: "✳",
      },
    ],
    quote: "Great websites aren’t just about code, they’re about solving real problems for real people.",
    attribution: "— A belief I bring to every build",
  },
  skills: {
    label: "MY TOOLKIT",
    title: "Skills &",
    highlight: "expertise.",
    description: "The right tools for the right idea — from the first Figma frame to the final interaction.",
    other: ["REST API integration", "Form handling", "Authentication", "Component-based architecture"],
    otherLabel: "ALSO COMFORTABLE WITH",
  },
  projects: {
    label: "SELECTED WORK",
    title: "Selected",
    highlight: "work.",
    description: "What I’m building and maintaining right now — dashboards, WordPress sites and interfaces.",
    endEyebrow: "HAVE A PROJECT?",
    endTitle: "Your idea could be",
    endHighlight: "next.",
    endCta: "Let’s make it happen",
  },
  journey: {
    label: "EXPERIENCE & EDUCATION",
    title: "My",
    highlight: "journey.",
    description: "From a B.Tech in computer science to building web apps and WordPress sites in production.",
  },
  contact: {
    label: "HAVE A GOOD PROJECT IN MIND?",
    titleLead: "Let’s make",
    titleHighlight: "it matter.",
    introduction:
      "Have an idea, a role or a challenge in mind, or just want to say hello? I’d love to hear what you’re thinking.",
    socialLabel: "FIND ME ONLINE",
    form: {
      name: "Your name",
      namePlaceholder: "How should I call you?",
      email: "Email address",
      emailPlaceholder: "you@example.com",
      message: "A little about your project",
      messagePlaceholder: "Tell me what you have in mind...",
      submit: "Send a message",
      replyTime: "Usually replies within 1–2 days",
      submitted: "Your email app is opening with your message ready to send.",
    },
  },
};

export const profile = {
  email: "spatil.tech.in@gmail.com",
  phone: "+91 95793 75942",
  phoneHref: "tel:+919579375942",
  location: "Pune, Maharashtra",
  linkedin: "https://www.linkedin.com/in/spatil-in/",
  resume: "/Portfolio/Sanket-Patil-Resume.pdf ",
};

// Add more here (GitHub, X…) once you have the links — they appear in the footer, menu and contact section.
export const socialLinks = [
  { label: "LinkedIn", short: "in", href: profile.linkedin },
  { label: "Email", short: "@", href: `mailto:${profile.email}` },
];

export const experienceStats = [
  { value: 2, suffix: "+", label: "Years experience" },
  { value: 2, suffix: "", label: "Core stacks: React & WordPress" },
  { value: 3, suffix: "", label: "State tools: Hooks, Context, Redux" },
];

export const contactDetails = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "Phone", value: profile.phone, href: profile.phoneHref },
  { label: "Based in", value: profile.location },
];
