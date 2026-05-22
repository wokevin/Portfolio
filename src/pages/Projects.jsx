import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Projects.css';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const GITHUB_USERNAME = 'wokevin';

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch repos');
        return response.json();
      })
      .then(data => {
        // Filter out forks and private repos, map to our format
        const publicRepos = data
          .filter(repo => !repo.fork && !repo.private)
          .map(repo => ({
            id: repo.id,
            title: repo.name,
            description: repo.description || 'No description available',
            language: repo.language,
            stars: repo.stargazers_count,
            githubLink: repo.html_url,
            liveLink: repo.homepage || null,
          }));
        setProjects(publicRepos);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="projects">
        <section className="projects-professional">
          <div className="container">
            <h1>My Projects</h1>
          </div>
        </section>
        <section className="projects-content">
          <div className="container">
            <p>Loading projects...</p>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects">
        <section className="projects-professional">
          <div className="container">
            <h1>My Projects</h1>
          </div>
        </section>
        <section className="projects-content">
          <div className="container">
            <p>Error loading projects: {error}</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="projects">
      <section className="projects-professional">
        <div className="container">
          <h1>My Projects</h1>
        </div>
      </section>

      <section className="projects-content">
        <div className="container">
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-meta">
                    {project.language && (
                      <span className="meta-item">
                        <i className="fas fa-code"></i> {project.language}
                      </span>
                    )}
                    <span className="meta-item">
                      <i className="fas fa-star"></i> {project.stars}
                    </span>
                  </div>
                  <div className="project-links">
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn-project-link">
                      <i className="fab fa-github"></i> View Code
                    </a>
                    {project.liveLink && (
                      <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="btn-project-link">
                        <i className="fas fa-external-link-alt"></i> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Projects;