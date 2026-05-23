import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './ProjectDetail.css';

function ProjectDetail() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [readme, setReadme] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const GITHUB_USERNAME = 'wokevin';

    useEffect(() => {
        // First, fetch all repos to find the one matching this ID
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`)
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch repos');
                return response.json();
            })
            .then(data => {
                const repo = data.find(r => r.id === parseInt(id));
                if (!repo) throw new Error('Project not found');

                // Store repo for later use
                const projectData = { id: repo.id, title: repo.name, description: repo.description || '', language: repo.language, stars: repo.stargazers_count, githubLink: repo.html_url, liveLink: repo.homepage || null, fullName: repo.full_name, };

                setProject(projectData);

                // Now fetch the README
                return fetch(`https://api.github.com/repos/${repo.full_name}/readme`, {
                    headers: {
                        'Accept': 'application/vnd.github.v3.raw'
                    }
                }).then(response => ({ response, projectData }));
            })
            .then(({ response, projectData }) => {
                if (!response.ok) throw new Error('README not found');
                return response.text().then(text => ({ text, projectData }));
            })
            .then(({ text, projectData }) => {
                setReadme(text);

                // Use first paragraph of README as description if repo.description is empty
                if (!projectData.description) {
                    const lines = text.split('\n').filter(line => line.trim());
                    // Find first non-header, non-empty line with substantial content
                    const firstParagraph = lines.find(line => {
                        const trimmed = line.trim();
                        return !trimmed.startsWith('#') && !trimmed.startsWith('!') && !trimmed.startsWith('[') && trimmed.length > 20;
                    });

                    let newDescription = 'See README below';
                    if (firstParagraph) {
                        newDescription = firstParagraph.substring(0, 200);
                    } else {
                        // Fallback: use the first line that's not a header
                        const fallback = lines.find(line => !line.startsWith('#'));
                        if (fallback) {
                            newDescription = fallback.substring(0, 200);
                        }
                    }

                    // Create a completely new object to trigger re-render
                    setProject({
                        ...projectData,
                        description: newDescription
                    });
                }

                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="project-detail">
                <section className="project-detail-professional">
                    <div className="container">
                        <Link to="/projects" className="back-link">← Back to Projects</Link>
                        <h1>Loading...</h1>
                    </div>
                </section>
                <section className="project-detail-content">
                    <div className="container">
                        <p>Loading project details...</p>
                    </div>
                </section>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="project-detail">
                <section className="project-detail-professional">
                    <div className="container">
                        <Link to="/projects" className="back-link">← Back to Projects</Link>
                        <h1>Error</h1>
                    </div>
                </section>
                <section className="project-detail-content">
                    <div className="container">
                        <p>Error: {error}</p>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="project-detail">
            <section className="project-detail-professional">
                <div className="container">
                    <Link to="/projects" className="back-link">← Back to Projects</Link>
                    <h1>{project.title}</h1>
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
                            <i className="fab fa-github"></i> View on GitHub
                        </a>
                        {project.liveLink && (
                            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="btn-project-link">
                                <i className="fas fa-external-link-alt"></i> Live Demo
                            </a>
                        )}
                    </div>
                </div>
            </section>

            <section className="project-detail-content">
                <div className="container">
                    <div className="content-section">
                        {readme ? (
                            <div className="markdown-content">
                                <ReactMarkdown>{readme}</ReactMarkdown>
                            </div>
                        ) : (
                            <p>No README available for this project.</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ProjectDetail;