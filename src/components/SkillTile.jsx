const skillIcons = {
  React: "react",
  JavaScript: "javascript",
  HTML5: "html5",
  CSS3: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
  Tailwind: "tailwindcss",
  Sass: "sass",
  Bootstrap: "bootstrap",
  GSAP: "greensock",
  WordPress: "wordpress",
  PHP: "php",
  MySQL: "mysql",
  "REST API": "postman",
  Git: "git",
  GitHub: "github",
  Figma: "figma",
  "VS Code": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg",
};

export default function SkillTile({ name, index }) {
  return (
    <div className="skill-tile">
      <span className="skill-tile__index">{String(index + 1).padStart(2, "0")}</span>
      <img
        className="skill-tile__icon"
        src={skillIcons[name].startsWith("https://")
          ? skillIcons[name]
          : `https://cdn.simpleicons.org/${skillIcons[name]}`}
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
      <span className="skill-tile__name">{name}</span>
      <span className="skill-tile__arrow" aria-hidden="true">↗</span>
    </div>
  );
}
