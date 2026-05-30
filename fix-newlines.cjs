const fs = require('fs');

let content = fs.readFileSync('src/components/CompanyDetail.tsx', 'utf8');

// The file was written with literal backslash 'n's: "\\n"
// Let's replace the literal backslash n with a real newline.
content = content.replace(/\\n/g, '\n');

fs.writeFileSync('src/components/CompanyDetail.tsx', content);

console.log("Restored newlines.");
