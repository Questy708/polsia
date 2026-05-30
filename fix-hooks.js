const fs = require('fs');
const content = fs.readFileSync('src/components/CompanyDetail.tsx', 'utf8');
const lines = content.split('\n');

const startIndex = lines.findIndex(l => l.includes('if (activeTab === "issues" || activeTab === "onboarding_project" || activeTab === "agent_ceo") {'));

// We need to find the matching closing brace.
let openBraces = 0;
let endIndex = -1;
for (let i = startIndex; i < lines.length; i++) {
    if (lines[i].includes('{')) openBraces += lines[i].split('{').length - 1;
    if (lines[i].includes('}')) openBraces -= lines[i].split('}').length - 1;
    
    if (openBraces === 0) {
        endIndex = i;
        break;
    }
}

if (startIndex > -1 && endIndex > -1) {
    const block = lines.splice(startIndex, endIndex - startIndex + 1);
    
    // Find where to insert it (before the main return hook)
    const insertIndex = lines.findIndex((l, i) => i >= endIndex - startIndex && l.includes('return (') && lines[i+1] && lines[i+1].includes('className="w-full flex-grow bg-[#000000] text-zinc-100 flex flex-col'));
    
    // Add useState hook
    const stateHook = '  const [showProperties, setShowProperties] = useState(true);';
    lines.splice(insertIndex - 1, 0, stateHook, ...block);
    
    fs.writeFileSync('src/components/CompanyDetail.tsx', lines.join('\n'));
    console.log("Success");
} else {
    console.log("Could not find boundaries: " + startIndex + ", " + endIndex);
}
