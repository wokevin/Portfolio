const fs = require('fs');
const path = require('path');

const pdfPath = path.join(__dirname, '../../docs/Resume/Kevin Wood Software Developer 2026.pdf');
const outputPath = path.join(__dirname, '../data/resume-data.json');

async function extractResumeData() {
  try {
    // Use dynamic import for ESM module
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    
    // Read the PDF file
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    // Extract text from all pages with better line handling
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      let lastY = null;
      textContent.items.forEach(item => {
        // Add newline when Y position changes significantly (new line in PDF)
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          fullText += '\n';
        }
        fullText += item.str;
        // Add space if this item doesn't end with space and isn't empty
        if (item.str && !item.str.endsWith(' ')) {
          fullText += ' ';
        }
        lastY = item.transform[5];
      });
      fullText += '\n\n'; // Double newline between pages
    }
    
    // Debug: Show what we extracted
    console.log('--- Extracted Text (first 1000 chars) ---');
    console.log(fullText.substring(0, 1000));
    console.log('--- End Preview ---\n');

    // Extract Education section
    const educationMatch = fullText.match(/Education:(.*?)(?=(Skills:|Experience:|Certifications:|$))/is);
    let education = educationMatch ? educationMatch[1].trim() : '';
    
    // Extract Skills section
    const skillsMatch = fullText.match(/Skills:(.*?)(?=(Education:|Experience:|Certifications:|$))/is);
    let skills = skillsMatch ? skillsMatch[1].trim() : '';
    
    // Clean up formatting: normalize whitespace but preserve newlines
    education = education.replace(/[ \t]+/g, ' ').replace(/\n\s+/g, '\n').trim();
    skills = skills.replace(/[ \t]+/g, ' ').replace(/\n\s+/g, '\n').trim();
    
    console.log('Education match found:', !!educationMatch);
    console.log('Education content length:', education.length);
    console.log('Skills match found:', !!skillsMatch);
    console.log('Skills content length:', skills.length);

    const resumeData = {
      education,
      skills,
      lastUpdated: new Date().toISOString()
    };

    // Ensure data directory exists
    const dataDir = path.dirname(outputPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(resumeData, null, 2));
    console.log('\n✅ Resume data extracted successfully!');
  } catch (error) {
    console.error('❌ Error extracting resume data:', error);
    process.exit(1);
  }
}

extractResumeData();