const fs = require('fs');
const path = require('path');

const resumeDir = path.join(__dirname, '../../docs/Resume');
const outputPath = path.join(__dirname, '../data/resume-data.json');
const characterToIgnore = String.fromCharCode(61623);  // The bullet character
const indentCharacter = String.fromCharCode(61607);   // The indent character

async function extractResumeData() {
  try {
    // Find the first PDF file in the Resume directory
    const files = fs.readdirSync(resumeDir);
    const pdfFile = files.find(file => file.toLowerCase().endsWith('.pdf'));
    
    if (!pdfFile) {
      throw new Error('No PDF file found in docs/Resume directory');
    }
    
    const pdfPath = path.join(resumeDir, pdfFile);
    console.log(`📄 Found resume PDF: ${pdfFile}`);
    
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

    // Extract Education section
    const educationMatch = fullText.match(/\bEducation\s+and Professional Development\s+(.*?)(?=(Summary of Qualifications|Professional Experience|Certifications|$))/is);
    let education = educationMatch ? educationMatch[1].trim() : '';
    
    // Extract Skills from Summary of Qualifications section
    const skillsMatch = fullText.match(/Summary of Qualifications\s+(.*?)(?=(Education|Professional Experience|Certifications|Work Experience|$))/is);
    let skills = skillsMatch ? skillsMatch[1].trim() : '';
    
    // Process skills to remove bullets and special characters
    if (skills) {
      let lines = skills.split('\n');
      lines = lines.map((line) => {
        let cleaned = line;
        // Remove special PDF characters
        while (cleaned.includes(characterToIgnore)) {
          cleaned = cleaned.replace(characterToIgnore, '');
        }
        while (cleaned.includes(indentCharacter)) {
          cleaned = cleaned.replace(indentCharacter, '');
        }
        // Remove "o  " bullet pattern
        cleaned = cleaned.replace(/^o\s\s+/, '');
        
        return cleaned.trim();
      });
      skills = lines.join('\n');
      
      // Normalize line breaks
      skills = skills.replace(/\n\s*\n+/g, '\n');
      skills = skills.trim();
    }
    
    // Clean up education formatting
    education = education.replace(/[ \t]+/g, ' ').replace(/\n\s+/g, '\n').trim();

    const resumeData = {
      education,
      skills,
      pdfFileName: pdfFile,
      lastUpdated: new Date().toISOString()
    };

    // Ensure data directory exists
    const dataDir = path.dirname(outputPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(resumeData, null, 2));
    console.log('✅ Resume data extracted successfully!');
  } catch (error) {
    console.error('❌ Error extracting resume data:', error);
    process.exit(1);
  }
}

extractResumeData();