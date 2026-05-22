import './Resume.css';
import { useState, useEffect } from 'react';

function Resume() {
    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const characterToIgnore = '';  // The actual bullet character from the PDF

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
                {line.trim() || '\u00A0'}
            </div>
        ));
    };

    // Helper function to render skills with hierarchy
    const renderSkills = (text) => {
        if (!text) return 'Skills section not found';

        const categories = [];
        let currentCategory = null;
        let currentSubCategory = null;

        const lines = text.split('\n').map(line => {
            let trimmed = line.trim();
            // Remove ALL occurrences of the character, not just at the start
            while (trimmed.includes(characterToIgnore)) {
                trimmed = trimmed.replace(characterToIgnore, '');
            }
            return trimmed.trim();
        }).filter(line => line);

        lines.forEach((line) => {
            // Check if it's a sub-category (Experienced: or Familiar:)
            const subMatch = line.match(/^(Experienced|Familiar):\s*(.*)$/i);
            
            if (subMatch) {
                // Save previous sub-category if exists
                if (currentSubCategory && currentCategory) {
                    currentCategory.subCategories.push(currentSubCategory);
                }

                const subName = subMatch[1].trim();
                const restOfLine = subMatch[2].trim();

                currentSubCategory = {
                    name: subName,
                    items: []
                };

                // Add items after the colon if present (as comma-separated)
                if (restOfLine) {
                    const items = restOfLine.split(',').map(item => item.trim()).filter(item => item);
                    currentSubCategory.items.push(...items);
                }
            }
            // Check if it's a main category (has colon but not Experienced/Familiar)
            else if (line.includes(':')) {
                const match = line.match(/^([^:]+):\s*(.*)$/);
                if (match) {
                    // Save previous category
                    if (currentSubCategory && currentCategory) {
                        currentCategory.subCategories.push(currentSubCategory);
                    }
                    if (currentCategory) {
                        categories.push(currentCategory);
                    }

                    const categoryName = match[1].trim();
                    const restOfLine = match[2].trim();

                    currentCategory = {
                        name: categoryName,
                        subCategories: [],
                        items: []
                    };
                    currentSubCategory = null;

                    // If there's content after colon, add it
                    if (restOfLine) {
                        currentCategory.items.push(restOfLine);
                    }
                }
            }
            // Check if it's a main category without colon (like "Programming")
            // Long lines (>40 chars) should also be treated as top-level categories
            else if (!currentSubCategory || line.length > 40) {
                // Save previous category
                if (currentSubCategory && currentCategory) {
                    currentCategory.subCategories.push(currentSubCategory);
                }
                if (currentCategory) {
                    categories.push(currentCategory);
                }

                currentCategory = {
                    name: line,
                    subCategories: [],
                    items: []
                };
                currentSubCategory = null;
            }
            // Otherwise, decide if it's an item or a new top-level category
            else {
                // Short lines are items; longer descriptive lines are categories
                const looksLikeItem = line.length < 20 && !line.includes(' through ') && !line.includes(' and ');
                
                if (looksLikeItem) {
                    // It's an item
                    if (currentSubCategory) {
                        currentSubCategory.items.push(line);
                    } else if (currentCategory) {
                        currentCategory.items.push(line);
                    }
                } else {
                    // It's a new top-level category
                    if (currentSubCategory && currentCategory) {
                        currentCategory.subCategories.push(currentSubCategory);
                        currentSubCategory = null;
                    }
                    if (currentCategory) {
                        categories.push(currentCategory);
                    }
                    
                    currentCategory = {
                        name: line,
                        subCategories: [],
                        items: []
                    };
                }
            }
        });

        // Don't forget the last category and sub-category
        if (currentSubCategory && currentCategory) {
            currentCategory.subCategories.push(currentSubCategory);
        }
        if (currentCategory) {
            categories.push(currentCategory);
        }

        return (
            <ul className="skill-list-main">
                {categories.map((category, catIndex) => (
                    <li key={catIndex} className="skill-category">
                        <span className="skill-header">{category.name}</span>
                        
                        {/* Render sub-categories with items as separate bullets */}
                        {category.subCategories.length > 0 && (
                            <ul className="skill-subcategory-list">
                                {category.subCategories.map((subCat, subIndex) => (
                                    <li key={subIndex} className="skill-subcategory">
                                        <span className="skill-subheader">{subCat.name}</span>
                                        {subCat.items.length > 0 && (
                                            <ul className="skill-items-list">
                                                {subCat.items.map((item, itemIndex) => (
                                                    <li key={itemIndex}>{item}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Render direct items as separate list items with bullets */}
                        {category.items.length > 0 && (
                            <ul className="skill-list-nested">
                                {category.items.map((item, itemIndex) => (
                                    <li key={itemIndex}>{item}</li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    // Build the PDF path dynamically from the stored filename
    const pdfPath = resumeData?.pdfFileName 
        ? `${import.meta.env.BASE_URL}docs/Resume/${resumeData.pdfFileName}`
        : `${import.meta.env.BASE_URL}docs/Resume/resume.pdf`;

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
                                <h2>Education and Professional Development</h2>
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