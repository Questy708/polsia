import { PolsiaCompany } from "./types";

export const initialCompanies: PolsiaCompany[] = [
  {
    id: "prj_dPl4wtp8DUwPLaFwKZmX4bLbjd0Q",
    name: "project-4y06p",
    tagline: "Autonomous customer segmentation and cohort intelligence",
    businessIdea: "B2B SaaS cohort retention analyzer",
    createdAt: "2026-05-19T00:00:00.000Z",
    status: "operating",
    planner: {
      valueProp: "A fully autonomous workflow that consumes stripe and custom segment webhooks, automatically drafts churn prevention strategies, and prompts developers to deploy customized discount code parameters.",
      roadmap: [
        { phase: "Phase 1", title: "API Validation", description: "Map out the Stripe webhook schemas and cohort tables.", status: "completed" },
        { phase: "Phase 2", title: "App Scaffolding", description: "Developer agent scaffolds Node hook microservices.", status: "completed" },
        { phase: "Phase 3", title: "Outreach Sequences", description: "Reach out to 50 local SF B2B founders.", status: "completed" },
        { phase: "Phase 4", title: "Ads Campaign", description: "LinkedIn ads tested with $10CPA target.", status: "completed" }
      ]
    },
    developer: {
      techStack: ["React 19", "Vite", "Node.js", "Express", "PostgreSQL", "TailwindCSS"],
      schema: `CREATE TABLE cohorts (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  name VARCHAR(100) NOT NULL,\n  started_at DATE NOT NULL,\n  count INTEGER\n);\n\nCREATE TABLE retention_events (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  cohort_id UUID REFERENCES cohorts(id),\n  week_index INTEGER,\n  retained_count INTEGER\n);`,
      code: `// project-4y06p cohort view\nexport default function Dashboard() {\n  return (\n    <div className="bg-[#0b0b0a] text-white min-h-[400px] flex items-center justify-center p-6 border border-gray-800 rounded-xl">\n      <div className="text-center space-y-4">\n        <div className="inline-block px-3 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-400 font-mono">☉ Operating Live</div>\n        <h2 className="text-2xl font-bold tracking-tight">Active Cohort Optimization</h2>\n        <p className="text-gray-400 max-w-sm text-xs leading-relaxed">Polsia Dev Agent is currently polling Stripe metrics to optimize retention parameters.</p>\n      </div>\n    </div>\n  );\n}`,
      repoName: "github.com/abramswalkerx-cell/project-4y06p"
    },
    outreach: {
      emailSubject: "Optimizing retention at {{companyName}} - Case Study",
      emailBody: "Hi {{contactName}},\n\nI was looking at {{companyName}}'s customer metrics. For highly targeted B2B products like yours, a 1% decrease in churn results in a 12% improvement in enterprise valuation.\n\nOur autonomous tool integrates securely in 5 minutes and flags churn risks automatically while you sleep.\n\nBest,\nAutonomous Agent",
      leads: [
        { companyName: "LogiTech SF", contactName: "Michael Chang", role: "Director of Product", estimatedContractValue: "$1,500 /mo", status: "contacted" },
        { companyName: "SentryHub", contactName: "Diana Ross", role: "Head of Growth", estimatedContractValue: "$3,000 /mo", status: "negotiating" }
      ]
    },
    ads: {
      audienceProfile: "Specialized B2B software founders, growth directors, and retention engineers in major hub cities.",
      campaigns: [
        { platform: "LinkedIn", headline: "Let AI analyze your software's user cohorts automatically.", dailyBudget: 30, clicks: 88, conversions: 9, status: "active" },
        { platform: "Google", headline: "SaaS Retention Tool - Autonomous cohort generator", dailyBudget: 20, clicks: 104, conversions: 11, status: "active" }
      ]
    },
    support: {
      faqs: [
        { question: "Do you store Stripe customer keys?", answer: "No, we use read-only webhooks via an encrypted secure pipeline." }
      ],
      tickets: [
        { sender: "customer", message: "Can we track cohort metrics by referral source?", timestamp: "9:10 AM" },
        { sender: "support_agent", message: "Yes! Polsia recently committed updates to support referral tracking query parameters. It will automatically filter on your dashboard.", timestamp: "9:12 AM" }
      ]
    },
    financials: {
      mrr: 1200,
      revenue: 3500,
      cac: 55,
      ltv: 1500,
      margin: 92,
      monthlyHistory: [
        { month: "Mar", revenue: 800, mrr: 400 },
        { month: "Apr", revenue: 1900, mrr: 800 },
        { month: "May", revenue: 3500, mrr: 1200 }
      ],
      ledger: [
        { date: "May 28", description: "Subscription renewal from Sutter Tech Partners", type: "income", amount: 1200 },
        { date: "May 27", description: "Google Ads campaign charge", type: "expense", amount: -20 },
        { date: "May 26", description: "LinkedIn business campaign budget", type: "expense", amount: -30 }
      ]
    },
    logs: [
      { timestamp: "08:12:00", agent: "Planner", text: "Stripe retention pipeline mapped properly.", level: "success" },
      { timestamp: "09:30:15", agent: "Developer", text: "Deployed webhook listener on production server container.", level: "info" }
    ]
  },
  {
    id: "prj_pCLSmsuj8f366p7gzKwjRnWKPx1p",
    name: "artifacts-xcelero-labs",
    tagline: "Autonomous document cataloging with neural semantic search",
    businessIdea: "AI document semantic knowledge retrieval for laboratories",
    createdAt: "2026-04-03T00:00:00.000Z",
    status: "operating",
    planner: {
      valueProp: "An automated document workflow that parses pdf, docx, and txt files in secure chemical lab databases and maps them into vector databases so research biologists can query legacy patents seamlessly.",
      roadmap: [
        { phase: "Phase 1", title: "Vector Design", description: "Formulate embedding schema based on gemini-embedding.", status: "completed" },
        { phase: "Phase 2", title: "Parser Deploy", description: "Developer agent instantiates OCR and semantic chunking.", status: "completed" },
        { phase: "Phase 3", title: "Outreach Pilots", description: "Automated sequence to bioscience labs across Boston and SF.", status: "completed" },
        { phase: "Phase 4", title: "SaaS Scaling", description: "Ads tested on bio-research keywords.", status: "in-progress" }
      ]
    },
    developer: {
      techStack: ["React 19", "TypeScript", "Vite", "Pinecone VectorDB", "Gemini Embeddings", "Express", "Node"],
      schema: `CREATE TABLE lab_documents (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  file_name VARCHAR(255) NOT NULL,\n  file_path TEXT NOT NULL,\n  semantic_hash VARCHAR(64),\n  embedded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\nCREATE TABLE document_chunks (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  document_id UUID REFERENCES lab_documents(id),\n  content TEXT,\n  vector_index INTEGER\n);`,
      code: `// artifacts-xcelero-labs main window\nexport default function LabSearch() {\n  return (\n    <div className="bg-zinc-950 p-6 rounded-xl border border-gray-800 space-y-4 font-sans text-white max-w-lg mx-auto">\n      <div className="flex justify-between items-center border-b border-gray-800 pb-3">\n        <h3 className="font-bold">Neural PDF Indexer</h3>\n        <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">☉ Semantic Sync Active</span>\n      </div>\n      <input type="text" placeholder="Query legacy chemical pathways..." className="w-full text-xs bg-gray-900 border border-gray-800 p-2.5 rounded-md outline-none" />\n      <div className="text-gray-400 text-xs">Vector Search response matches 14 historical biological patents</div>\n    </div>\n  );\n}`,
      repoName: "github.com/abramswalkerx-cell/artifacts-xcelero-labs"
    },
    outreach: {
      emailSubject: "Optimizing semantic research at {{companyName}}",
      emailBody: "Hi {{contactName}},\n\nI was looking at {{companyName}}'s science publications. For bio-research firms, researchers waste up to 4.5 hours a week searching through legacy PDFs.\n\nOur autonomous tool, artifacts-xcelero-labs, indexes physical scanned pdfs into vector storage. We have mapped out a demo specifically for bio labs.\n\nDo you have 10 minutes next Tuesday?\n\nBest,\nAutonomous Outreach Suite",
      leads: [
        { companyName: "Xcelero BioLabs", contactName: "Dr. Andrew Miller", role: "VP R&D", estimatedContractValue: "$4,500 /mo", status: "converted" },
        { companyName: "Cambridge BioTech", contactName: "Sarah Sterling", role: "Lab Lead", estimatedContractValue: "$5,200 /mo", status: "negotiating" }
      ]
    },
    ads: {
      audienceProfile: "Biomedical lab assistants, VP of R&D, clinical scientists, and biopharma researchers.",
      campaigns: [
        { platform: "LinkedIn", headline: "Bio labs: search a million pages of historical chemistry in 0.2s.", dailyBudget: 60, clicks: 194, conversions: 24, status: "active" },
        { platform: "Google", headline: "AI Chemical semantic search - Pinecone Vector Integration", dailyBudget: 40, clicks: 145, conversions: 18, status: "active" }
      ]
    },
    support: {
      faqs: [
        { question: "Is this HIPAA compliant?", answer: "Yes, documents are secured in safe private VPC containers." }
      ],
      tickets: [
        { sender: "customer", message: "Our laboratory requires absolute encryption of structural diagrams.", timestamp: "11:20 AM" },
        { sender: "support_agent", message: "Every vector segment is encrypted using AES-256 standard and mapped using zero-knowledge encryption.", timestamp: "11:22 AM" }
      ]
    },
    financials: {
      mrr: 4500,
      revenue: 12500,
      cac: 90,
      ltv: 24000,
      margin: 85,
      monthlyHistory: [
        { month: "Feb", revenue: 2000, mrr: 1500 },
        { month: "Mar", revenue: 6500, mrr: 3000 },
        { month: "Apr", revenue: 12500, mrr: 4500 }
      ],
      ledger: [
        { date: "May 28", description: "Bi-annual payment from Xcelero BioLabs", type: "income", amount: 4500 },
        { date: "May 27", description: "B2B Scientific Google Search budget", type: "expense", amount: -40 },
        { date: "May 26", description: "Specialized biochemist recruitment ad spend", type: "expense", amount: -60 }
      ]
    },
    logs: [
      { timestamp: "11:20:00", agent: "Developer", text: "Linked schema, Pinecone cluster state matches OK.", level: "success" },
      { timestamp: "12:00:25", agent: "Outreach", text: "Outreach email sequence sent successfully to Cambridge BioTech.", level: "info" }
    ]
  }
];
