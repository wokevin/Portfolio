import { useState } from 'react';
import './Contact.css';
import siteConfig from '../config/siteConfig';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="contact">
      <section className="contact-professional">
        <div className="container">
          <h1>Get In Touch</h1>
        </div>
      </section>

      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Contact Information</h2>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <h3>Email</h3>
                  <a href={`mailto:${siteConfig.personal.email}`}>{siteConfig.personal.email}</a>
                </div>
              </div>
              <div className="contact-item">
                <i className="fab fa-github"></i>
                <div>
                  <h3>GitHub</h3>
                  <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer">
                    {siteConfig.social.github.replace('https://', '')}
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <i className="fab fa-linkedin"></i>
                <div>
                  <h3>LinkedIn</h3>
                  <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer">
                    {siteConfig.social.linkedin.replace('https://', '')}
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-form-container">
              <h2>Send Me a Message</h2>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name *</label>
                  <input type="text" id="name" name="name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea id="message" name="message" required rows="6"></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;