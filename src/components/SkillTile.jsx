import {
  siBootstrap,
  siCss,
  siElementor,
  siFigma,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siMysql,
  siPhp,
  siPostman,
  siReact,
  siRedux,
  siSass,
  siTailwindcss,
  siWordpress,
} from "simple-icons";

// Icons are bundled (no network request), so tiles never pop in late or fail offline.
const icons = {
  "React.js": siReact,
  Redux: siRedux,
  JavaScript: siJavascript,
  HTML5: siHtml5,
  CSS3: siCss,
  "Tailwind CSS": siTailwindcss,
  Sass: siSass,
  Bootstrap: siBootstrap,
  Figma: siFigma,
  WordPress: siWordpress,
  PHP: siPhp,
  Elementor: siElementor,
  MySQL: siMysql,
  Git: siGit,
  GitHub: siGithub,
  "REST APIs": siPostman,
};

export default function SkillTile({ name, index }) {
  const icon = icons[name];
  return (
    <div className="skill-tile">
      <span className="skill-tile__index">{String(index + 1).padStart(2, "0")}</span>
      {icon ? (
        <svg className="skill-tile__icon" viewBox="0 0 24 24" role="img" aria-hidden="true">
          <path d={icon.path} fill="currentColor" />
        </svg>
      ) : (
        <span className="skill-tile__icon skill-tile__icon--text" aria-hidden="true">{name.slice(0, 2)}</span>
      )}
      <span className="skill-tile__name">{name}</span>
      <span className="skill-tile__arrow" aria-hidden="true">↗</span>
    </div>
  );
}
