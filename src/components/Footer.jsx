import './Footer.css';
import siteConfig from '../config/siteConfig';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Connect With Me</h3>
            <div className="social-links">
              <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <i className="fab fa-github"></i>
              </a>
              <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href={`mailto:${siteConfig.personal.email}`} aria-label="Email">
                <i className="fas fa-envelope"></i>
              </a>
            </div>
          </div>
          <div className="footer-section">
            <p>&copy; {currentYear} {siteConfig.personal.name}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;