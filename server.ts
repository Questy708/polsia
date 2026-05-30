import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = 3000;

// Lazy initialization of GoogleGenAI
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return ai;
}

// Helper to provide robust, creative fallback company generation if Gemini API key is missing
function generateHighFidelityFallback(idea: string) {
  // Clean up and extract clean name tokens
  const cleanIdea = idea.replace(/[^\w\s-]/gi, '').trim();
  const words = cleanIdea.split(/\s+/).filter(w => w.length > 2);
  const keyword = words[0] ? words[0].charAt(0).toUpperCase() + words[0].slice(1) : "Pionia";
  const secondKeyword = words[1] ? words[1].charAt(0).toUpperCase() + words[1].slice(1) : "Flow";
  
  // Format beautifully branded name
  const name = `${keyword}${secondKeyword}`;
  const tagline = `Autonomous end-to-end operations for ${idea.toLowerCase()}`;

  return {
    id: `comp_${Math.random().toString(36).substr(2, 9)}`,
    name,
    tagline,
    businessIdea: idea,
    createdAt: new Date().toISOString(),
    status: "operating",
    planner: {
      valueProp: `Polsia's autonomous planner identified a critical gap: Traditional players in "${idea}" require manual operations. We automate 100% of workflows using self-improving agents, lowering setup cost by 95% and scaling outreach exponentially.`,
      roadmap: [
        { phase: "Phase 1", title: "Market Feasibility & Brand", description: "Collect demographics, analyze competitor pricing, and automatically register sandbox domains.", status: "completed" },
        { phase: "Phase 2", title: "Autonomous App Development", description: "Developer agent scaffolds database schemas and generates pristine react-vite frontends.", status: "completed" },
        { phase: "Phase 3", title: "Automated Cold Campaigns", description: "Outreach agent launches outreach scripts customized with personal customer business data.", status: "in-progress" },
        { phase: "Phase 4", title: "Viral Ad Deployment", description: "Ads agent tests optimal budget allocation over Search, LinkedIn, and Meta.", status: "pending" }
      ]
    },
    developer: {
      techStack: ["React 19", "Vite", "TailwindCSS v4", "Node.js Express", "Supabase PostgreSQL", "D3.js Dataviz"],
      schema: `CREATE TABLE users (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  email VARCHAR(255) UNIQUE NOT NULL,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\nCREATE TABLE subscriptions (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id UUID REFERENCES users(id),\n  tier VARCHAR(50) DEFAULT 'basic',\n  status VARCHAR(50) DEFAULT 'active',\n  price_cents INTEGER DEFAULT 2900\n);`,
      code: `export default function App() {\n  return (\n    <div className="bg-[#0A0A0A] text-white min-h-screen p-8 flex flex-col justify-between">\n      <header className="border-b border-gray-800 pb-4">\n        <h1 className="text-xl font-bold tracking-tight">${name}</h1>\n      </header>\n      <main className="my-12 max-w-md mx-auto space-y-6">\n        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">${tagline}</h2>\n        <p className="text-gray-400 text-sm">Powered by Polsia's autonomous execution container.</p>\n        <button className="bg-white text-black px-6 py-3 rounded-full hover:opacity-90 font-medium">Get Scheduled Access</button>\n      </main>\n      <footer className="text-xs text-gray-500 text-center border-t border-gray-800 pt-4">© 2026 ${name}. All rights reserved.</footer>\n    </div>\n  );\n}`,
      repoName: `github.com/polsia-autonomous/${name.toLowerCase()}`
    },
    outreach: {
      emailSubject: `Exclusive: AI-managed optimization for ${keyword}`,
      emailBody: `Hi {{contactName}},\n\nI was reviewing companies in San Francisco and noticed your team at {{companyName}} spends substantial overhead on manual operations.\n\nOur platform ${name} autonomously coordinates workflows for "${idea}". We would love to pilot this at your office for a trial period. Are you free for a brief 10-minute demo on Monday?\n\nBest,\nAutonomous Outreach Agent of ${name}`,
      leads: [
        { companyName: "Sutter Tech Partners", contactName: "Sarah Jenkins", role: "Vite Director", estimatedContractValue: "$1,200 /mo", status: "contacted" },
        { companyName: "Mission AI Labs", contactName: "David Lee", role: "SaaS Lead", estimatedContractValue: "$2,400 /mo", status: "negotiating" },
        { companyName: "Fillmore Capital", contactName: "Rebecca Chen", role: "VP Strategy", estimatedContractValue: "$4,500 /mo", status: "leads" }
      ]
    },
    ads: {
      audienceProfile: "SF Tech Founders, Product Managers, Venture Capitalists looking to optimize manual workflow in the SF Region.",
      campaigns: [
        { platform: "LinkedIn", headline: `${name}: Run your business workflows automatically while you sleep.`, dailyBudget: 50, clicks: 124, conversions: 12, status: "active" },
        { platform: "Google", headline: "Automate All Sourcing & Operations - From $29/mo", dailyBudget: 25, clicks: 96, conversions: 8, status: "active" },
        { platform: "Meta", headline: `${tagline}. Try SF's leading autonomous SaaS cloud.`, dailyBudget: 15, clicks: 45, conversions: 2, status: "paused" }
      ]
    },
    support: {
      faqs: [
        { question: `What exactly does ${name} do?`, answer: `${name} is an end-to-end automated platform that autonomously executes business tasks for "${idea}".` },
        { question: "How safe is this autonomous platform?", answer: "Fully safe. Polsia sandbox containers run secure virtual browsers and verified API proxies to handle operation logs easily." }
      ],
      tickets: [
        { sender: "customer", message: "Hi, I wanted to change the frequency of my delivery. How do I do that?", timestamp: "10:14 AM" },
        { sender: "support_agent", message: `Hi there! I can help with that. I have updated your subscriber account frequency to weekly, which will apply beginning with your upcoming batch. Let me know if you need anything else!`, timestamp: "10:15 AM" }
      ]
    },
    financials: {
      mrr: 3600,
      revenue: 8900,
      cac: 45,
      ltv: 1800,
      margin: 88,
      monthlyHistory: [
        { month: "Jan", revenue: 1500, mrr: 800 },
        { month: "Feb", revenue: 2400, mrr: 1200 },
        { month: "Mar", revenue: 4100, mrr: 2100 },
        { month: "Apr", revenue: 6200, mrr: 2900 },
        { month: "May", revenue: 8900, mrr: 3600 }
      ],
      ledger: [
        { date: "May 28", description: "Subscription renewal from Sutter Tech Partners", type: "income", amount: 1200 },
        { date: "May 27", description: "Google Ads Daily campaign budget spend", type: "expense", amount: -25 },
        { date: "May 26", description: "LinkedIn business lead campaign budget spend", type: "expense", amount: -50 },
        { date: "May 24", description: "New customer sign up: Mission AI Labs", type: "income", amount: 2400 }
      ]
    },
    logs: [
      { timestamp: "14:15:22", agent: "Planner", text: `Analyzing market viability for "${idea}". Identified high-density demographic in California.`, level: "info" },
      { timestamp: "14:15:30", agent: "Planner", text: `Devised Brand Guideline: '${name}' - Tagline: '${tagline}'.`, level: "success" },
      { timestamp: "14:15:40", agent: "Developer", text: `Scaffolded backend routes & React landing page client. Committed to ${name} repository.`, level: "info" },
      { timestamp: "14:16:05", agent: "Developer", text: "Database schema generated and compiled. Port 3000 mapping validated.", level: "success" },
      { timestamp: "14:16:15", agent: "Outreach", text: "Identified 3 top San Francisco prospects; sent randomized cold outreach template.", level: "info" },
      { timestamp: "14:16:40", agent: "Ads", text: "Meta, Google and LinkedIn ad creatives created. Set active with budget allocated.", level: "success" },
      { timestamp: "14:17:10", agent: "Support", text: "Automated support queue active. Initialized ticket listener successfully.", level: "success" },
      { timestamp: "14:17:35", agent: "Financial", text: "Prepared real-time MRR and Cash Flow projection sheets for Q2.", level: "info" }
    ]
  };
}

// Server end points helper
app.post("/api/operate", async (req, res) => {
  const { businessIdea } = req.body;
  
  if (!businessIdea || typeof businessIdea !== "string" || businessIdea.trim() === "") {
    return res.status(400).json({ error: "Please submit a valid business idea." });
  }

  const gemini = getGeminiClient();

  if (!gemini) {
    // Graceful fallback when the key isn't provided
    console.log("No Gemini API Key found or default fallback used. Generating high fidelity mockup...");
    const fallback = generateHighFidelityFallback(businessIdea);
    return res.json({ company: fallback });
  }

  try {
    const prompt = `
      Create a fully-detailed configuration for an autonomous company centered on the business idea: "${businessIdea?.replace(/"/g, '\\"')}".
      You are Polsia's core planner engine. You MUST generate the response in structured JSON matching this TypeScript representation strictly:
      
      {
        "name": "a creative, professional, single-word or camelCase name for the company",
        "tagline": "a powerful, short catchy 1-sentence sales tagline",
        "planner": {
          "valueProp": "detailed AI value proposition analysis of the idea",
          "roadmap": [
            { "phase": "Phase 1", "title": "Feasibility", "description": "Compiling details...", "status": "completed" },
            { "phase": "Phase 2", "title": "Sourcing", "description": "...", "status": "completed" },
            { "phase": "Phase 3", "title": "SaaS Launch", "description": "...", "status": "in-progress" },
            { "phase": "Phase 4", "title": "Scaling", "description": "...", "status": "pending" }
          ]
        },
        "developer": {
          "techStack": ["React", "Express", "Node.js", "etc"],
          "schema": "SQL database code representing their database schema",
          "code": "A single compact snippet of a React component serving as the customized Landing Page for this company, styled beautifully with styled tags or simple clean TSX",
          "repoName": "github.com/polsia-autonomous/..."
        },
        "outreach": {
          "emailSubject": "engaging B2B cold outreach email subject",
          "emailBody": "professional cold email content (use {{companyName}} and {{contactName}} as tags inside it)",
          "leads": [
            { "companyName": "TechCorp", "contactName": "John Doe", "role": "CTO", "estimatedContractValue": "$1,000 /mo", "status": "contacted" },
            { "companyName": "SaaSify", "contactName": "Alice Smith", "role": "Founder", "estimatedContractValue": "$2,500 /mo", "status": "leads" }
          ]
        },
        "ads": {
          "audienceProfile": "description of customer persona",
          "campaigns": [
            { "platform": "LinkedIn", "headline": "Ad Headline", "dailyBudget": 50, "clicks": 150, "conversions": 10, "status": "active" },
            { "platform": "Google", "headline": "Search Ad Headline", "dailyBudget": 25, "clicks": 200, "conversions": 15, "status": "active" }
          ]
        },
        "support": {
          "faqs": [
            { "question": "What is ...?", "answer": "..." }
          ],
          "tickets": [
            { "sender": "customer", "message": "Can I cancel?", "timestamp": "12:00 PM" },
            { "sender": "support_agent", "message": "Hi, yes absolute pricing freedom...", "timestamp": "12:01 PM" }
          ]
        },
        "financials": {
          "mrr": 4200,
          "revenue": 10500,
          "cac": 60,
          "ltv": 2000,
          "margin": 90,
          "monthlyHistory": [
            { "month": "Jan", "revenue": 2000, "mrr: 1500 },
            { "month": "Feb", "revenue": 5000, "mrr": 3200 },
            { "month": "Mar", "revenue": 10500, "mrr": 4200 }
          ],
          "ledger": [
            { "date": "Today", "description": "Customer Renewal", "type": "income", "amount": 1000 },
            { "date": "Yesterday", "description": "Ad Campaign Budget", "type": "expense", "amount": -75 }
          ]
        },
        "logs": [
          { "timestamp": "12:00:00", "agent": "Planner", "text": "Formulating market positioning & outline.", "level": "info" },
          { "timestamp": "12:05:00", "agent": "Developer", "text": "Drafting optimal SQL schemas and container routes.", "level": "success" }
        ]
      }

      Generate highly specific copy tailored precisely to this business idea. Be extremely creative and realistic.
    `;

    const geminiRes = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            tagline: { type: Type.STRING },
            planner: {
              type: Type.OBJECT,
              properties: {
                valueProp: { type: Type.STRING },
                roadmap: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      phase: { type: Type.STRING },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      status: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            developer: {
              type: Type.OBJECT,
              properties: {
                techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                schema: { type: Type.STRING },
                code: { type: Type.STRING },
                repoName: { type: Type.STRING }
              }
            },
            outreach: {
              type: Type.OBJECT,
              properties: {
                emailSubject: { type: Type.STRING },
                emailBody: { type: Type.STRING },
                leads: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      companyName: { type: Type.STRING },
                      contactName: { type: Type.STRING },
                      role: { type: Type.STRING },
                      estimatedContractValue: { type: Type.STRING },
                      status: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            ads: {
              type: Type.OBJECT,
              properties: {
                audienceProfile: { type: Type.STRING },
                campaigns: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      platform: { type: Type.STRING },
                      headline: { type: Type.STRING },
                      dailyBudget: { type: Type.NUMBER },
                      clicks: { type: Type.NUMBER },
                      conversions: { type: Type.NUMBER },
                      status: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            support: {
              type: Type.OBJECT,
              properties: {
                faqs: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      answer: { type: Type.STRING }
                    }
                  }
                },
                tickets: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      sender: { type: Type.STRING },
                      message: { type: Type.STRING },
                      timestamp: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            financials: {
              type: Type.OBJECT,
              properties: {
                mrr: { type: Type.NUMBER },
                revenue: { type: Type.NUMBER },
                cac: { type: Type.NUMBER },
                ltv: { type: Type.NUMBER },
                margin: { type: Type.NUMBER },
                monthlyHistory: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      month: { type: Type.STRING },
                      revenue: { type: Type.NUMBER },
                      mrr: { type: Type.NUMBER }
                    }
                  }
                },
                ledger: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      date: { type: Type.STRING },
                      description: { type: Type.STRING },
                      type: { type: Type.STRING },
                      amount: { type: Type.NUMBER }
                    }
                  }
                }
              }
            },
            logs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timestamp: { type: Type.STRING },
                  agent: { type: Type.STRING },
                  text: { type: Type.STRING },
                  level: { type: Type.STRING }
                }
              }
            }
          },
          required: ["name", "tagline", "planner", "developer", "outreach", "ads", "support", "financials", "logs"]
        }
      }
    });

    const resultText = geminiRes.text;
    const parsed = JSON.parse(resultText || "{}");
    
    // Add missing metadata for state
    const company = {
      ...parsed,
      id: `comp_${Math.random().toString(36).substr(2, 9)}`,
      businessIdea,
      createdAt: new Date().toISOString(),
      status: "operating"
    };

    res.json({ company });
  } catch (error) {
    console.error("Gemini context generation failed:", error);
    // Graceful fallback to client
    const fallback = generateHighFidelityFallback(businessIdea);
    res.json({ company: fallback, warning: "Fell back to highly detailed lexical engine." });
  }
});

// Chat Endpoint for Manus AI conversational interface
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "No message provided." });
  }

  const gemini = getGeminiClient();
  if (!gemini) {
    // Elegant system assistant responses
    let answer = `I'm currently running in offline mock-development mode. However, in our deployment orchestrator, we automate this request. Polsia can provision specific containers, seed mock Postgres schemas, and deploy marketing landing pages instantly. Try entering a business idea like "automated micro-SaaS" so I can execute standard deployment layers!`;
    
    const msgLower = message.toLowerCase();
    if (msgLower.includes("manus") || msgLower.includes("who are you")) {
      answer = `I am Polsia's integrated Manus AI agent core. I leverage Gemini-3.5-flash to autonomously manage microservice deployments, outline financials, compile SQL schemas, and simulate B2B outreach loops.`;
    } else if (msgLower.includes("react") || msgLower.includes("code")) {
      answer = `To spin up a new React platform:
1. Define a robust schema (e.g. Users, Subscriptions).
2. Scaffold a clean layout using Tailwind CSS.
3. Hook up server-side routes to keep secrets safe.
Polsia streamlines this automatically when you enter any business idea above.`;
    }
    
    return res.json({ response: answer });
  }

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction: "You are the Manus AI core inside Polsia. You are an expert system-level assistant, autonomous programmer, and operations manager. Keep answers concise, highly structured, professional, and explain everything with a clear outline when necessary. Avoid mentions of API keys or container limits unless asked.",
      }
    });
    res.json({ response: response.text });
  } catch (err: any) {
    console.error("Gemini chat failed:", err);
    const inputLower = message.toLowerCase();
    let textOut = "";
    if (inputLower.includes("hello") || inputLower.includes("hi ") || inputLower.includes("hey")) {
      textOut = `Hello! I am Manus AI, your autonomous company-building agent. How can I help you architect your next venture today?`;
    } else if (inputLower.includes("who are you") || inputLower.includes("what is this") || inputLower.includes("polsia") || inputLower.includes("manus")) {
      textOut = `I am Polsia's integrated Manus AI agent core. I leverage Gemini models to autonomously coordinate end-to-end operations: drawing up business plans, spinning up relational schemas, writing Tailwind-styled frontends, and setting up B2B marketing pipelines.`;
    } else if (inputLower.includes("compile") || inputLower.includes("build") || inputLower.includes("deploy") || inputLower.includes("code")) {
      textOut = `I can scaffold directories, package React apps with Vite, and run Node servers dynamically on Port 3000. Just submit your SaaS idea in the top field, and watch the live logs compile a bespoke workspace instantly!`;
    } else {
      textOut = `I am ready to help you coordinate your SaaS venture. (Note: The Gemini subnet returned an API key validation alert. To unlock full real-time reasoning with Gemini-3.5-flash, please configure a valid API key in **Settings > Secrets**). \n\nHow would you like to proceed with your business idea?`;
    }
    res.json({ response: textOut, error: err.message || String(err) });
  }
});

// Configure Vite integration or production static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
