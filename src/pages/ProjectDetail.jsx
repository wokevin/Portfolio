import { useParams, Link } from 'react-router-dom';
import './ProjectDetail.css';

function ProjectDetail() {
  const { id } = useParams();

  return (
    <div className="project-detail">
      <section className="project-detail-professional">
        <div className="container">
          <Link to="/projects" className="back-link">← Back to Projects</Link>
          <h1>Project {id}</h1>
        </div>
      </section>

      <section className="project-detail-content">
        <div className="container">
          <div className="content-section">
            <h2>Project Overview</h2>
            <p>Details about your project...</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProjectDetail;