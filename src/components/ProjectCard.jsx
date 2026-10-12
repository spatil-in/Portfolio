export default function ProjectCard({ project, onSelect }) {
  return (
    <article className="project-card" data-project-category={project.category}>
      <button
        type="button"
        className="project-card__button"
        onClick={(event) => onSelect(project, event)}
        aria-label={`View ${project.title} project details`}
        data-cursor="View"
      >
        <div className="project-card__image-wrap">
          <img className="project-card__image" src={project.image} alt={`${project.title} project preview`} loading="lazy" />
          <span className="project-card__open" aria-hidden="true">↗</span>
          <span className="project-card__year">{project.year}</span>
        </div>
        <div className="project-card__meta">
          <div><span className="project-card__type">{project.type}</span><h3>{project.title}</h3></div>
          <span className="project-card__number">{project.number}</span>
        </div>
        <p className="project-card__description">{project.description}</p>
        <div className="project-card__tags">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </button>
    </article>
  );
}
