import './Resume.css';
import { useState, useEffect } from 'react';

function Resume() {
    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(true);

    const pdfPath = `${import.meta.env.BASE_URL}docs/Resume/Kevin Wood Software Developer 2026.pdf`;

    useEffect(() => {
        // Load the pre-extracted resume data
        import('../data/resume-data.json')
            .then(module => {
                setResumeData(module.default);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error loading resume data:', error);
                setLoading(false);
            });
    }, []);

    // Helper function to render text with line breaks
    const renderText = (text) => {
        if (!text) return 'Section not found';

        return text.split('\n').map((line, index) => (
            <div key={index} className="resume-line">
                {line.trim() || '\u00A0'} {/* Non-breaking space for empty lines */}
            </div>
        ));
    };

    // Helper function to render skills with smart formatting
    const renderSkills = (text) => {
        if (!text) return 'Skills section not found';

        const sections = [];
        let currentSection = null;

        // Split by lines and process
        const lines = text.split('\n');

        lines.forEach((line) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;

            // Look for pattern "Word:" or "Word Word:" anywhere in the line (more flexible)
            const headerMatch = trimmedLine.match(/([A-Za-z][\w\s-]*?):\s*(.*)/);

            if (headerMatch) {
                // Found a header (e.g., "Programming:", "Web Technologies:", "Problem-Solving:")
                const header = headerMatch[1].trim();
                const restOfLine = headerMatch[2].trim();

                // Save previous section
                if (currentSection) {
                    sections.push(currentSection);
                }

                // Start new section
                currentSection = {
                    header,
                    items: []
                };

                // If there's content after the colon, split by comma
                if (restOfLine) {
                    const items = restOfLine.split(',').map(item => item.trim()).filter(item => item);
                    currentSection.items.push(...items);
                }
            } else if (currentSection) {
                // Continuation line - split by comma and add to current section
                const items = trimmedLine.split(',').map(item => item.trim()).filter(item => item);
                currentSection.items.push(...items);
            } else {
                // No header yet, treat as standalone items
                const items = trimmedLine.split(',').map(item => item.trim()).filter(item => item);
                if (items.length > 0) {
                    sections.push({ header: null, items });
                }
            }
        });

        // Don't forget the last section
        if (currentSection) {
            sections.push(currentSection);
        }

        return (
            <ul className="skill-list-main">
                {sections.map((section, sectionIndex) => (
                    <li key={sectionIndex} className="skill-section">
                        {section.header && <span className="skill-header">{section.header}</span>}
                        {section.items.length > 0 && (
                            <ul className="skill-list-nested">
                                {section.items.map((item, itemIndex) => (
                                    <li key={itemIndex}>{item}</li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="resume">
            <section className="resume-professional">
                <div className="container">
                    <h1>Resume</h1>
                    <a href={pdfPath} download className="btn btn-download">
                        <i className="fas fa-download"></i> Download PDF
                    </a>
                </div>
            </section>

            <section className="resume-content">
                <div className="container">
                    {loading ? (
                        <p>Loading resume...</p>
                    ) : resumeData ? (
                        <>
                            <div className="resume-section">
                                <h2>Education</h2>
                                <div className="resume-item">
                                    {renderText(resumeData.education)}
                                </div>
                            </div>

                            <div className="resume-section">
                                <h2>Skills</h2>
                                <div className="resume-item">
                                    {renderSkills(resumeData.skills)}
                                </div>
                            </div>
                        </>
                    ) : (
                        <p>Unable to load resume data</p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Resume;