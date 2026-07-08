import puppeteer from 'puppeteer-core';
import { findBrowser } from './findBrowser.js';

/**
 * Enhanced PDF Generator Utility
 * Implements precise visual fixes requested by the user.
 */
export async function generatePDF(cvData) {
  let browser = null;
  const browserPath = findBrowser();

  if (!browserPath) {
    throw new Error("No browser found for PDF generation.");
  }

  try {
    // --- 1. DATA EXTRACTION (Hybrid to support various frontend formats) ---

    // Extraction helper
    const getSection = (type) => {
      // Check if sections array exists (User proposed structure)
      if (cvData.sections && Array.isArray(cvData.sections)) {
        return cvData.sections.find(s => s.type === type)?.data || null;
      }
      // Check if flat object exists (Current frontend state)
      if (type === 'header' || type === 'personalInfo') {
        return cvData.personalInfo || cvData.header || cvData;
      }
      return cvData[type] || null;
    };

    const header = getSection('header') || getSection('personalInfo') || {};
    const summary = getSection('summary') || getSection('profile') || header.summary || header.about || null;
    const experience = getSection('experience') || [];
    const education = getSection('education') || [];
    const skills = getSection('skills') || [];

    // Branding
    const colors = cvData.styles?.colors || cvData.colors || { primary: "#1E1B4B", text: "#1a1a1a", background: "#ffffff" };
    const font = cvData.styles?.fonts?.body || cvData.font || "Inter";
    const primaryColor = colors.primary || "#1E1B4B";
    const textColor = colors.text || "#1a1a1a";
    const bgColor = colors.background || "#ffffff";

    // Photo Handling
    const photoUrl = header.photo || header.profileImage?.secure_url || header.profileImage || null;

    // --- 2. HTML TEMPLATE (User's Modern Template) ---
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
  <style>
    /* CRITICAL FIXES */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: '${font}', 'Inter', Arial, sans-serif; 
      color: ${textColor}; 
      line-height: 1.5;
      font-size: 14px;
      background: white;
    }
    .page { 
      width: 210mm; 
      min-height: 297mm; 
      padding: 20mm; 
      background: ${bgColor};
    }
    
    .header { 
      display: flex; 
      gap: 20px; 
      margin-bottom: 25px;
      align-items: flex-start;
    }
    
    .photo { 
      width: 100px; 
      height: 100px; 
      border-radius: 50%; 
      object-fit: cover;
      display: ${photoUrl ? 'block' : 'none'};
      border: 2px solid ${primaryColor};
    }
    
    .header-info { flex: 1; }
    .name { 
      font-size: 28px; 
      font-weight: 900; 
      color: ${primaryColor};
      margin-bottom: 5px;
      text-transform: uppercase;
    }
    .title { font-size: 16px; color: #666; margin-bottom: 10px; font-weight: 700; }
    .contact { font-size: 12px; color: #666; }
    .contact span { margin-right: 15px; }
    
    .section { margin-bottom: 20px; }
    .section-title { 
      font-size: 14px; 
      font-weight: bold; 
      text-transform: uppercase;
      letter-spacing: 2px;  /* ONLY APPLIED TO TITLES */
      color: ${primaryColor};
      border-bottom: 2px solid ${primaryColor};
      padding-bottom: 5px;
      margin-bottom: 12px;
    }
    
    .entry { margin-bottom: 15px; }
    .entry-header { 
      display: flex; 
      justify-content: space-between; 
      margin-bottom: 3px;
    }
    .entry-title { font-weight: bold; font-size: 14px; color: #111; }
    .entry-subtitle { font-style: italic; color: #444; font-size: 13px; font-weight: 700; }
    .entry-date { font-size: 12px; color: #888; font-weight: 600; }
    .entry-description { font-size: 13px; margin-top: 5px; white-space: pre-line; color: #333; }
    .entry-list { margin-left: 18px; margin-top: 5px; }
    .entry-list li { font-size: 13px; margin-bottom: 3px; }
    
    .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill-tag { 
      background: ${primaryColor}; 
      color: white; 
      padding: 4px 12px; 
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
    }
    
    .hidden { display: none !important; }
  </style>
</head>
<body>
  <div class="page">
    <!-- HEADER -->
    <div class="header">
      <img src="${photoUrl}" class="photo" alt="" />
      <div class="header-info">
        <div class="name">${header.name || header.fullName || 'Your Name'}</div>
        <div class="title">${header.title || ''}</div>
        <div class="contact">
          ${header.email ? `<span>${header.email}</span>` : ''}
          ${header.phone ? `<span>${header.phone}</span>` : ''}
          ${header.address || header.location ? `<span>${header.address || header.location}</span>` : ''}
        </div>
      </div>
    </div>
    
    <!-- SUMMARY -->
    ${summary ? `
    <div class="section">
      <div class="section-title">Summary</div>
      <p style="text-align: justify;">${typeof summary === 'string' ? summary : summary.text}</p>
    </div>
    ` : ''}
    
    <!-- EXPERIENCE -->
    ${experience?.length ? `
    <div class="section">
      <div class="section-title">Experience</div>
      ${experience.map(job => `
        <div class="entry">
          <div class="entry-header">
            <div>
              <div class="entry-title">${job.role || job.position}</div>
              <div class="entry-subtitle">${job.company}${job.location ? `, ${job.location}` : ''}</div>
            </div>
            <div class="entry-date">${job.duration || (job.startDate ? `${job.startDate} - ${job.current ? 'Present' : job.endDate}` : '')}</div>
          </div>
          ${job.description ? `<div class="entry-description">${job.description}</div>` : ''}
          ${job.achievements?.length ? `
            <ul class="entry-list">
              ${job.achievements.map(a => `<li>${a}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    <!-- EDUCATION -->
    ${education?.length ? `
    <div class="section">
      <div class="section-title">Education</div>
      ${education.map(edu => `
        <div class="entry">
          <div class="entry-header">
            <div>
              <div class="entry-title">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</div>
              <div class="entry-subtitle">${edu.institute || edu.school}${edu.location ? `, ${edu.location}` : ''}</div>
            </div>
            <div class="entry-date">${edu.year || (edu.startDate ? `${edu.startDate} - ${edu.endDate}` : '')}</div>
          </div>
          ${edu.gpa ? `<div class="entry-description">GPA: ${edu.gpa}</div>` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    <!-- SKILLS -->
    ${skills?.length ? `
    <div class="section">
      <div class="section-title">Skills</div>
      <div class="skills-list">
        ${skills.map(s => {
      const sName = typeof s === 'string' ? s : (s.name || s.label);
      const sLevel = typeof s === 'object' && s.level ? ` • ${s.level}` : '';
      return `<span class="skill-tag">${sName}${sLevel}</span>`;
    }).join('')}
      </div>
    </div>
    ` : ''}

    <!-- ADDITIONAL SECTIONS -->
    ${(cvData.additionalSections || []).map(aside => `
      <div class="section">
        <div class="section-title">${aside.title}</div>
        <div class="entry-description">${aside.details}</div>
      </div>
    `).join('')}

  </div>
</body>
</html>
        `;

    // 3. Puppeteer Rendering
    browser = await puppeteer.launch({
      executablePath: browserPath,
      headless: true, // Use standard headless for better stability on Edge
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--disable-extensions',
        '--hide-scrollbars',
        '--mute-audio',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-client-side-phishing-detection',
        '--disable-default-apps',
        '--disable-hang-monitor',
        '--disable-ipc-flooding-protection',
        '--disable-popup-blocking',
        '--disable-prompt-on-repost',
        '--disable-renderer-backgrounding',
        '--disable-sync'
      ]
    });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);
    await page.setDefaultTimeout(60000);

    // Inject content
    await page.setContent(html, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Extra wait for resources (Fonts etc)
    await new Promise(r => setTimeout(r, 2500));

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
      // Removed preferCSSPageSize to avoid crashes
    });

    return pdf;

  } catch (error) {
    console.error('PDF Generator Utility Error:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close().catch(err => console.error('Browser Close Error:', err));
    }
  }
}
