import { Link } from 'react-router-dom';
import './Home.css';
import professionalPhoto from '../assets/ProfessionalHeadshot.png';

function Home() {
  return (
    <div className="home">
      <section className="landing-section">
        <div className="landing-content">
          <div className="landing-text">
            <h1 className="headline">
              Hi, I'm <span className="highlight">Kevin Wood</span>
            </h1>
            <h2 className="headline-subtitle">Computer Science Student & Developer, SDET</h2>
                      <p className="introduction">
                          Passionate about building innovative solutions and creating impactful software.
                          Specializing in Quality Assurance, data structures, and problem-solving.  I love to figure out how to break things, and help ensure they don't break again!
                      </p>
            <div className="cta-buttons">
              <Link to="/projects" className="btn btn-primary">View My Work</Link>
              <Link to="/contact" className="btn btn-secondary">Get In Touch</Link>
            </div>
          </div>
          <div className="professional-photo">
            <img src={professionalPhoto} alt="Kevin Wood - Professional Photo" />
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">What I Do</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💻</div>
              <h3>Web Development</h3>
              <p>Building responsive and user-friendly applications using C# .NET, Python, and JavaScript.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Problem Solving</h3>
              <p>Applying algorithms and data structures to solve complex computational challenges efficiently.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Full-Stack Development</h3>
              <p>Creating end-to-end solutions from database design to front-end implementation.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Let's Build Something Together</h2>
          <p>I'm always interested in hearing about new opportunities and collaborations.</p>
          <Link to="/contact" className="btn btn-primary">Contact Me</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;