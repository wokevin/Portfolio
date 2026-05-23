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
      .then(async data => {
        // Filter out forks and private repos
        const publicRepos = data.filter(repo => !repo.fork && !repo.private);
        
        // Fetch READMEs for each repo
        const reposWithDescriptions = await Promise.all(
          publicRepos.map(async repo => {
            let description = repo.description || '';
            
            // If no description, try to get it from README
            if (!description) {
              try {
                const readmeResponse = await fetch(`https://api.github.com/repos/${repo.full_name}/readme`, {
                  headers: { 'Accept': 'application/vnd.github.v3.raw' }
                });
                
                if (readmeResponse.ok) {
                  const readmeText = await readmeResponse.text();
                  const lines = readmeText.split('\n').filter(line => line.trim());
                  
                  // Find first meaningful paragraph
                  const firstParagraph = lines.find(line => {
                    const trimmed = line.trim();
                    return !trimmed.startsWith('#') && !trimmed.startsWith('!') &&  !trimmed.startsWith('[') && trimmed.length > 20;
                  });
                  
                  if (firstParagraph) {
                    description = firstParagraph.substring(0, 600);
                  } else {
                    description = 'See project for details';
                  }
                }
              } catch (e) {
                description = 'No description available';
              }
            }
            
            return { id: repo.id, title: repo.name, description, language: repo.language, stars: repo.stargazers_count, githubLink: repo.html_url, liveLink: repo.homepage || null, };
          })
        );
        
        setProjects(reposWithDescriptions);
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