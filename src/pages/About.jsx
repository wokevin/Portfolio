import './About.css';

function About() {
  return (
    <div className="about">
      <section className="about-professional">
        <div className="container">
          <h1>About Me</h1>
          <p className="lead">Building the future, by testing one line of code at a time</p>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>My Journey in Computer Science</h2>
              <p>
                I'm a passionate Computer Science student with a deep love for technology and problem-solving.
                              My journey into programming began in the 1980's with inputting machine code for my computers - a Timex Sinclair and Commodore 64,
                              and while that was extremely annoying it got me wondering how you could get a computer to do what you wanted, and I've been constantly learning and growing my skills across various domains since.
              </p>

              <h2>Technical Interests</h2>
              <ul className="interests-list">
                <li>Quality Assurance & Testing - how can one turn out a product that meets the highest standards, if you release broken code?</li>
                <li>Data Structures & Algorithms</li>
                <li>Software Engineering Best Practices</li>
              </ul>

              <h2>My Values</h2>
              <div className="values-grid">
                <div className="value-card">
                  <h3>🎯 Continuous Learning</h3>
                  <p>Technology evolves rapidly, and I'm committed to staying current.</p>
                </div>
                <div className="value-card">
                  <h3>🤝 Collaboration</h3>
                  <p>Great software is built by great teams.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;