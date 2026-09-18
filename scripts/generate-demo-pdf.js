import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to create a valid minimal PDF file with text content
function createMinimalPdf(text, outputPath) {
  const content = text.replace(/[\(\)\\]/g, "\\$&");
  const stream = `BT
/F1 12 Tf
72 712 Td
(${content.replace(/\n/g, ") Tj\n0 -16 Td (")}) Tj
ET`;

  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${stream.length} >>
stream
${stream}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000234 00000 n 
0000000${(300 + stream.length).toString().padStart(3, "0")} 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${400 + stream.length}
%%EOF`;

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, pdf, "latin1");
  console.log(`[PDF Generator] Created PDF at: ${outputPath}`);
}

const johnResumeText = `John Doe
Email: john.doe.dev@example.com
Phone: (555) 234-5678
Location: San Francisco, CA

Professional Summary:
Senior Frontend Developer with 4+ years of experience building modern web applications.
Specialized in React, JavaScript, Next.js, CSS, HTML5, Tailwind CSS, and REST APIs.

Skills:
React, JavaScript, Next.js, Tailwind CSS, CSS, HTML, REST APIs, Git, TypeScript

Experience:
Frontend Engineer - TechNova Inc (2022 - Present)
- Engineered responsive client dashboards in React and Next.js with stateful workflow management.
- Improved Core Web Vitals and load performance by 35% through code splitting.

Software Developer - CodeCraft Labs (2020 - 2022)
- Built interactive single page applications using React, JavaScript, and Tailwind CSS.
- Collaborated with product designers to implement pixel-perfect user experiences.

Education:
Bachelor of Science in Computer Science - University of California (2016 - 2020)`;

const demoDir = path.resolve(__dirname, "../demo-data/resumes");
createMinimalPdf(johnResumeText, path.join(demoDir, "john-react-resume.pdf"));
