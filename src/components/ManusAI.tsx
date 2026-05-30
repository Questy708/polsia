import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Terminal, Search, Plus, Sparkles, Send, Bot, User, X, 
  Paperclip, Globe, FileText, Play, CheckCircle2, RefreshCw, 
  ArrowUpRight, SlidersHorizontal, Settings, Volume2, HelpCircle, 
  PhoneCall, Users, ChevronDown, ChevronRight, Eye, Star, Share2, 
  MoreHorizontal, Table, Image as ImageIcon, Presentation, BarChart3, 
  Bookmark, Calendar, Bell, Sliders, Menu, Heart, ClipboardCheck, ArrowRight,
  ShieldCheck, Cpu, Database, AlertCircle, AlertTriangle, Filter, ArrowLeft
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { PolsiaCompany } from "../types";

interface ManusAIProps {
  onAddCompany: (newCompany: PolsiaCompany) => void;
  setTab: (tab: "homepage" | "dashboard" | "manus") => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  isStepExecution?: boolean;
  steps?: {
    title: string;
    description: string;
    completed: boolean;
    active?: boolean;
    logs?: string[];
  }[];
  generatedCompany?: PolsiaCompany;
}

interface ChatHistoryItem {
  id: string;
  title: string;
  timeAgo: string;
  messages: ChatMessage[];
  currentStepIndex?: number;
}

// 8 High Fidelity ProtoCos Ventures representing dynamic live subpages
interface DemoVenture {
  name: string;
  category: "AI Agents" | "BioTech" | "Corridors" | "Fintech" | "Logistics";
  location: string;
  status: "operating" | "launching";
  mrr: string;
  valueProp: string;
  techStack: string[];
  schema: string;
  code: string;
  repo: string;
}

const DEMO_VENTURES: DemoVenture[] = [
  {
    name: "Sovereign AgriHubs",
    category: "Fintech",
    location: "Lagos Corridor",
    status: "operating",
    mrr: "$4,200",
    valueProp: "Distributed solar-powered milling and agricultural logistics platform that automates split revenue shares through localized ledger smart policies.",
    techStack: ["React 19", "Vite", "Solidity", "Node.js Express", "PostgreSQL"],
    schema: "CREATE TABLE farm_yields (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  mill_id UUID NOT NULL,\n  yield_kg DECIMAL(10,2),\n  payout_stablecents INTEGER\n);",
    code: "export default function PayoutCalculator() {\n  return <div>LEDGER STATUS: ACTIVE Payout cleared successfully to 14 cooperative farmers.</div>;\n}",
    repo: "github.com/protocos/sovereign-agrihubs"
  },
  {
    name: "Nero Cargo Delivery",
    category: "Logistics",
    location: "Nairobi Valley",
    status: "operating",
    mrr: "$6,500",
    valueProp: "Autonomous drone freight orchestrator pairing rural farm sectors with urban processing hubs via automated flight clearance airspace APIs.",
    techStack: ["React 19", "Three.js", "Express", "Python FastAPI", "Leaflet Maps"],
    schema: "CREATE TABLE flight_missions (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  uav_identifier VARCHAR(50),\n  route_line GEOMETRY(LineString, 4326),\n  payload_weight_grams INTEGER\n);",
    code: "export default function Telemetry() {\n  return <div>DRONE FREIGHT ACTIVE: UAV-42 cleared for altitude 120m corridor Nairobi West.</div>;\n}",
    repo: "github.com/protocos/nero-cargo"
  },
  {
    name: "Polsia Core Workstation",
    category: "AI Agents",
    location: "San Francisco Hub",
    status: "operating",
    mrr: "$12,800",
    valueProp: "Autonomous developer sandbox environment that provisions fully containerized server ports, builds web frontends and spins up outreach nodes behind encrypted proxies.",
    techStack: ["React 19", "D3.js", "Docker Node SDK", "Next.js", "Tailwind CSS"],
    schema: "CREATE TABLE sandbox_containers (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  owner_id UUID NOT NULL,\n  allocated_port INTEGER UNIQUE,\n  cpu_shares INTEGER,\n  memory_mb INTEGER\n);",
    code: "export default function ContainerStatus() {\n  return <div>POLSIA CORE ACTIVE: Server ingress mapping verified live on Port 3000 mapping.</div>;\n}",
    repo: "github.com/polsia/core-sandbox"
  },
  {
    name: "BioVeda Therapeutics",
    category: "BioTech",
    location: "Kigali Gateway",
    status: "operating",
    mrr: "$2,400",
    valueProp: "Ethnobotanical flora databases cataloged via neural text embeddings, allowing biotech labs to query complex chemical pathways and local medical remedies.",
    techStack: ["React 19", "Pinecone VectorDB", "Gemini Embeddings", "Flask", "SQLite"],
    schema: "CREATE TABLE botanical_compounds (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  plant_name VARCHAR(100),\n  molecular_weight DECIMAL(8,3),\n  vector_content_id UUID\n);",
    code: "export default function SemanticSearch() {\n  return <div>SEMANTIC ACTIVE: Matches 9 legacy natural medicine references in Central Africa.</div>;\n}",
    repo: "github.com/protocos/bioveda-rx"
  },
  {
    name: "Aura Multimedia Labs",
    category: "AI Agents",
    location: "Accra Hub",
    status: "launching",
    mrr: "$0",
    valueProp: "Adaptive voice synthesizers transforming local linguistic oral histories into interactive game books featuring instant audio waveform rendering.",
    techStack: ["React 18", "Tauri", "TTS Synthesis", "Tailwind CSS", "Express Server"],
    schema: "CREATE TABLE audio_narratives (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  folklore_title VARCHAR(200),\n  language_code VARCHAR(10),\n  transcript_content TEXT\n);",
    code: "export default function NarrativeRender() {\n  return <div>SYNTH ACTIVE: Voice Zephyr is compiled and ready for narration export (24kHz).</div>;\n}",
    repo: "github.com/protocos/aura-voice"
  },
  {
    name: "Lera Clearing Pools",
    category: "Fintech",
    location: "Cape Town Summit",
    status: "operating",
    mrr: "$9,200",
    valueProp: "Instant multi-currency clearing protocol utilizing stable pools for zero-slippage B2B wholesale transaction settle rates across Southern Africa.",
    techStack: ["React 19", "Solidity Smart Contract", "Express", "Node", "PostgreSQL"],
    schema: "CREATE TABLE cross_border_checks (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  source_currency VARCHAR(10),\n  destination_currency VARCHAR(10),\n  amount_cents BIGINT,\n  rate_multiplier DOUBLE PRECISION\n);",
    code: "export default function PoolSettle() {\n  return <div>STABLEPOOL STATUS: Sovereign liquidity pool balanced at $450K collateral.</div>;\n}",
    repo: "github.com/protocos/lera-routing"
  },
  {
    name: "Spara Digital Escrow",
    category: "Fintech",
    location: "Lisbon Outpost",
    status: "operating",
    mrr: "$5,100",
    valueProp: "Zero-knowledge contract milestone escrows that secure project pricing payouts between digital nomad freelancers and global remote agencies.",
    techStack: ["React 19", "Web3Auth", "NextExpress", "TailwindCSS v4", "Docker"],
    schema: "CREATE TABLE escrows (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  employer_id UUID NOT NULL,\n  contractor_id UUID NOT NULL,\n  milestone_value_usd INTEGER,\n  contract_state VARCHAR(50)\n);",
    code: "export default function EscrowAudit() {\n  return <div>ESCROW ACTIVE: Zero-knowledge proofs match milestone audit guidelines safely.</div>;\n}",
    repo: "github.com/protocos/spara-safe"
  },
  {
    name: "Zephyr Wind Grid",
    category: "Logistics",
    location: "Nairobi Valley",
    status: "operating",
    mrr: "$3,800",
    valueProp: "Community microgrid energy distribution trading platform using smart credit models to exchange hyper-localized power shares peer-to-peer.",
    techStack: ["React 19", "D3.js Vis", "Express", "TypeScript", "InfluxDB TimeSeries"],
    schema: "CREATE TABLE power_transfers (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  sender_meter_id VARCHAR(100),\n  receiver_meter_id VARCHAR(100),\n  kwh_transferred DECIMAL(8,4),\n  clearing_timestamp TIMESTAMP WITH TIME ZONE\n);",
    code: "export default function GridBalance() {\n  return <div>GRID BALANCED: System active. Total real-time load sharing is 142 Amps.</div>;\n}",
    repo: "github.com/protocos/zephyr-energy"
  }
];

export default function ManusAI({ onAddCompany, setTab }: ManusAIProps) {
  const { theme } = useTheme();
  
  // Sidebar states
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "favorites" | "scheduled">("all");
  const [searchHistoryQuery, setSearchHistoryQuery] = useState("");

  // Input Box states
  const [inputValue, setInputValue] = useState("");
  const [selectedSpeed, setSelectedSpeed] = useState<"Speed" | "Pro" | "Creative">("Speed");
  const [selectedCategory, setSelectedCategory] = useState("Recommend");

  // PREVIEW CONTAINER STATES (Interactive Webpage Preview Frame)
  const [previewTab, setPreviewTab] = useState<"route" | "cities" | "protocos" | "league">("route");
  const [showPackageDeals, setShowPackageDeals] = useState(false);
  const [selectedVentureSearch, setSelectedVentureSearch] = useState("");
  const [selectedVentureCategory, setSelectedVentureCategory] = useState<string>("All");
  const [selectedVentureDetail, setSelectedVentureDetail] = useState<DemoVenture | null>(null);
  
  // Active selected city in bento view
  const [selectedCityDetail, setSelectedCityDetail] = useState<string | null>(null);

  // Active task & Chat states
  const [currentChatId, setCurrentChatId] = useState<string | null>("history-5");
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([
    {
      id: "history-5",
      title: "Real-time B2B Analytics & Client Portal",
      timeAgo: "1 minute ago",
      messages: [
        {
          id: "m-u-5",
          sender: "user",
          text: "Scaffold a full-stack dashboard featuring real-time socket events for conversions, a PostgreSQL tracking schema, and a customized client portal for Sutter Tech Partners."
        },
        {
          id: "m-ai-5",
          sender: "ai",
          text: "Double subpage and cloud compilation successful! I have successfully generated and launched the B2B Analytics Workspace and Client Portal. Built a modular architecture with an Express websocket proxy on Port 3000, optimized D3.js visualization charts, fully validated PostgreSQL queries, and an onboarding client portal for Sutter Tech Partners. All endpoints are fully operational.",
          isStepExecution: true,
          steps: [
            {
              title: "Draft PostgreSQL Relational Schema & Indices",
              description: "Designed a secure and scale-ready multi-tenant relational system for tracking metrics, users, and client portal access tokens.",
              completed: true,
              logs: [
                "Compiled migration file: 001_analytics_schema.sql",
                "Created indices on client_sessions(token_expiry, tenant_id)",
                "Successfully executed migration. Row-level security settings validated."
              ]
            },
            {
              title: "Build Real-time Express WS API Proxy & Controllers",
              description: "Developed core event-driven proxy server with robust routing to process conversion streams and sync client session state.",
              completed: true,
              logs: [
                "Constructed server-side socket emitter matching Express routing rules",
                "Configured env declarations for client portal parameters",
                "Ingress route active and responding dynamically on Port 3000."
              ]
            },
            {
              title: "Develop Interactive Single-Screen Dashboard & Client UI",
              description: "Designed beautiful dark-themed dashboard using high-fidelity D3 maps and custom React panels.",
              completed: true,
              logs: [
                "Extracted responsive Tailwind color palettes adapted to modern Dark visual theme",
                "Validated local React context hook for seamless state management",
                "Built live telemetry tracking panel matching elite design specifications."
              ]
            }
          ]
        }
      ]
    },
    {
      id: "history-4",
      title: "Self-Sustaining Venture Platform wit...",
      timeAgo: "2 minutes ago",
      messages: [
        {
          id: "m-u-4",
          sender: "user",
          text: "Analyze Xcelero design system and extract color/typography tokens across existing structures"
        },
        {
          id: "m-ai-4",
          sender: "ai",
          text: "Complete redesign delivered! The ProtoCo Venture Platform now seamlessly integrates into Xcelero Labs' dark futuristic aesthetic. Transformed from warm Afrofuturist tones to deep dark backgrounds (#050505) with electric blue accents (#3B82F6), Inter typography, and modern navigation. ProtoCos is now a featured subpage accessible from the main navigation, featuring all 105+ ventures with filtering, search, and styled detail modals matching Xcelero's visual language.",
          isStepExecution: true,
          steps: [
            {
              title: "Analyze Xcelero design system and extract color/typography tokens",
              description: "Finished integrating the redesigned ProtoCo platform into the Xcelero Labs design system, applying the dark aesthetic, blue accents, and Inter font, matching the overall visual language.",
              completed: true,
              logs: [
                "Successfully parsed custom tokens from main index database",
                "Extracted visual assets from portfolio directory",
                "Extracted base color system: primary (#050505), accents (#3B82F6)",
                "Saved the redesigned ProtoCo platform integrated with Xcelero Labs design system."
              ]
            },
            {
              title: "Deliver the final integrated platform",
              description: "Finished deploying the full active ProtoCo Venture Platform Explorer to the Cloud Run server ingress.",
              completed: true,
              logs: [
                "Build assets compiled successfully in 1435ms",
                "Port 3000 mapping validated.",
                "Ingress active at protocontrol-shcggmfg.manus.space"
              ]
            }
          ]
        }
      ]
    },
    {
      id: "history-1",
      title: "Building a Fund Deck for New Invest...",
      timeAgo: "8 minutes ago",
      messages: [
        {
          id: "m1",
          sender: "user",
          text: "Analyze market indicators and prepare a fund deck outline for Sutter Venture Fund"
        },
        {
          id: "m2",
          sender: "ai",
          text: "I have gathered financial parameters and developed the draft outline for your new Sutter Venture Fund Series-A invest deck. Let's start tracking SaaS indices.",
          isStepExecution: true,
          steps: [
            {
              title: "Gather competitive landscape data",
              description: "Extracted demographics, financial margins, and TAM/SAM assessments.",
              completed: true,
              logs: [
                "Searching: SF fintech venture valuations 2026",
                "Creating file: sutter_fund/competitors.json"
              ]
            },
            {
              title: "Outline slide layout decks",
              description: "Prepared 10-slide outline for investor-ready deck documentation.",
              completed: true,
              logs: [
                "Wrote draft file sutter_fund/slides_outline.md"
              ]
            }
          ]
        }
      ]
    },
    {
      id: "history-2",
      title: "Build Slide Presentation from Attac...",
      timeAgo: "15 minutes ago",
      messages: [
        {
          id: "m3",
          sender: "user",
          text: "Build Slide Presentation from Attachment list"
        },
        {
          id: "m4",
          sender: "ai",
          text: "I analyzed the attached strategic roadmap document and successfully generated a beautiful dark-themed pitch slide deck for your team."
        }
      ]
    },
    {
      id: "history-3",
      title: "Building a Website for University of...",
      timeAgo: "1 hour ago",
      messages: [
        {
          id: "m5",
          sender: "user",
          text: "Build a modern interactive research website for the University of SF CS department"
        },
        {
          id: "m6",
          sender: "ai",
          text: "Deployment final! Scaffolded a clean and responsive dashboard for CS faculty members, hosting a directory of publications and active research research grids."
        }
      ]
    }
  ]);

  // Loading build simulation active state
  const [isBuildingTask, setIsBuildingTask] = useState(false);
  const [buildSteps, setBuildSteps] = useState<any[]>([]);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll ref
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isBuildingTask, activeStepIdx]);

  // Handle ticking duration timer
  useEffect(() => {
    if (isBuildingTask) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setElapsedSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isBuildingTask]);

  const activeChat = chatHistory.find(h => h.id === currentChatId) || null;

  // Format stopwatch clock
  const formatSeconds = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Triggering the high fidelity dynamic agent build sequence
  const startAgentBuildFlow = async (ideaText: string) => {
    setIsBuildingTask(true);
    setActiveStepIdx(0);
    setElapsedSeconds(0);

    // Dynamic step names matching the idea
    const keyword = ideaText.split(" ").slice(0, 3).join(" ");
    const stepsConfig = [
      {
        title: `Formulate startup model and evaluate brand strategy for "${keyword}"`,
        description: "Orchestrating demographic targets and creating outline guides...",
        completed: false,
        active: true,
        logs: [
          `Executing command: mkdir -p saas_${keyword.toLowerCase().replace(/\s+/g, "_")}`,
          "Searching: Competitor landscapes and pricing directories",
          "Creating file: saas_profile/outline.md",
          "Generated business concept metadata and tagline"
        ]
      },
      {
        title: "Model high-fidelity schema & develop custom server configurations",
        description: "Compiling database migrations and server routers dynamically...",
        completed: false,
        active: false,
        logs: [
          "Creating file: saas_profile/schema.sql",
          "Evaluating React index elements...",
          "Compiling main.tsx with Node-PostgreSQL drivers."
        ]
      },
      {
        title: "Produce cold B2B outreach scripts & launch local ad campaigns",
        description: "Drafting optimized emails and tracking conversion criteria...",
        completed: false,
        active: false,
        logs: [
          "Scaffolded Outreach agent draft template with email parameters",
          "Creating ads campaign allocations for LinkedIn & Google Ads"
        ]
      },
      {
        title: "Bind container servers & finalize operations orchestrator",
        description: "Initializing ledger records, FAQ guides, and live support tickets...",
        completed: false,
        active: false,
        logs: [
          "Mapping local ingress port to 3000 mapping successfully",
          "Securing environment variables",
          "Finalizing ledger projection MRR & margins"
        ]
      }
    ];

    setBuildSteps(stepsConfig);

    // Chat History entry creation
    const newChatId = `chat_${Date.now()}`;
    const newHistoryItem: ChatHistoryItem = {
      id: newChatId,
      title: ideaText.length > 25 ? `${ideaText.slice(0, 25).trim()}...` : ideaText,
      timeAgo: "Just now",
      messages: [
        {
          id: `msg-user-${Date.now()}`,
          sender: "user",
          text: ideaText
        }
      ]
    };

    setChatHistory(prev => [newHistoryItem, ...prev]);
    setCurrentChatId(newChatId);

    // Call actual server-side operates API in parallel to keep things highly responsive and valid!
    let generatedComp: PolsiaCompany | null = null;
    const operatePromise = fetch("/api/operate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessIdea: ideaText })
    }).then(res => res.json())
      .then(data => {
        if (data.company) {
          generatedComp = data.company;
        }
      })
      .catch(err => console.error("Operate request failed:", err));

    // Step 1 Simulation
    await new Promise(r => setTimeout(r, 2200));
    setBuildSteps(prev => {
      const copy = [...prev];
      copy[0].completed = true;
      copy[0].active = false;
      copy[1].active = true;
      return copy;
    });
    setActiveStepIdx(1);

    // Step 2 Simulation
    await new Promise(r => setTimeout(r, 2200));
    setBuildSteps(prev => {
      const copy = [...prev];
      copy[1].completed = true;
      copy[1].active = false;
      copy[2].active = true;
      return copy;
    });
    setActiveStepIdx(2);

    // Step 3 Simulation
    await new Promise(r => setTimeout(r, 2200));
    setBuildSteps(prev => {
      const copy = [...prev];
      copy[2].completed = true;
      copy[2].active = false;
      copy[3].active = true;
      return copy;
    });
    setActiveStepIdx(3);

    // Step 4 Simulation & wait for backend resolve
    await Promise.all([operatePromise, new Promise(r => setTimeout(r, 1800))]);

    // Complete all steps
    setBuildSteps(prev => {
      return prev.map(s => ({ ...s, completed: true, active: false }));
    });
    setActiveStepIdx(4);
    setIsBuildingTask(false);

    // Fallback if compilation was sluggish
    if (!generatedComp) {
      generatedComp = {
        id: `comp_${Date.now()}`,
        name: `${ideaText.split(" ")[0] || "Omni"}Flow`,
        tagline: `Orchestrated micro-solutions for ${ideaText.toLowerCase()}`,
        businessIdea: ideaText,
        createdAt: new Date().toISOString(),
        status: "operating",
        planner: {
          valueProp: `Autonomous cloud optimization model centered entirely on ${ideaText}`,
          roadmap: [
            { phase: "Phase 1", title: "Setup Profile", description: "Created schema configurations.", status: "completed" }
          ]
        },
        developer: {
          techStack: ["React 19", "Vite", "Tailwind CSS"],
          schema: "CREATE TABLE items (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid()\n);",
          code: "export default function App() { return <div>Demo</div>; }",
          repoName: "github.com/polsia-autonomous/project"
        },
        outreach: { emailSubject: "B2B Outreach launch", emailBody: "Hello team...", leads: [] },
        ads: { audienceProfile: "Targeted SaaS Buyers", campaigns: [] },
        support: { faqs: [], tickets: [] },
        financials: { mrr: 1200, revenue: 1200, cac: 40, ltv: 800, margin: 90, monthlyHistory: [], ledger: [] },
        logs: [{ timestamp: "12:00:00", agent: "Planner", text: "Successfully provisioned", level: "success" }]
      };
    }

    // Add company to applet dashboard scope
    onAddCompany(generatedComp);

    // Insert AI execution response into chat history
    setChatHistory(prev => {
      return prev.map(h => {
        if (h.id === newChatId) {
          return {
            ...h,
            messages: [
              ...h.messages,
              {
                id: `ai-msg-${Date.now()}`,
                sender: "ai",
                text: `Successfully provisioned, compiled, and deployed autonomous enterprise **${generatedComp?.name}**! Microservices are online and accessible.`,
                isStepExecution: true,
                steps: [
                  { title: "Formulating startup model & brand guidelines", description: "Compiled roadmap.", completed: true },
                  { title: "Developing SQL Schema & custom React landing page UI", description: "Committed to git main repository.", completed: true },
                  { title: "Composing cold B2B campaigns & leads directory", description: "Configured outreach sequences.", completed: true },
                  { title: "Spinning up hosting containers & ingress routes", description: "Provisioned Port 3000 endpoints.", completed: true }
                ],
                generatedCompany: generatedComp
              }
            ]
          };
        }
        return h;
      });
    });
  };

  // Conversational response submit
  const handleChatSubmit = async (text: string) => {
    if (!text.trim()) return;

    // Check if the input is a startup building request or plain conversation
    const isBuildRequest = text.toLowerCase().includes("create") || 
                           text.toLowerCase().includes("build") || 
                           text.toLowerCase().includes("saas") || 
                           text.toLowerCase().includes("deploy") || 
                           text.toLowerCase().includes("platform") || 
                           text.toLowerCase().includes("startup");

    if (isBuildRequest && !activeChat) {
      startAgentBuildFlow(text);
      return;
    }

    const newMessageId = `msg-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: newMessageId,
      sender: "user",
      text: text
    };

    // If there is no active chat history, create one
    let targetChatId = currentChatId;
    if (!targetChatId) {
      targetChatId = `chat_${Date.now()}`;
      const newHistoryItem: ChatHistoryItem = {
        id: targetChatId,
        title: text.length > 25 ? `${text.slice(0, 25).trim()}...` : text,
        timeAgo: "Just now",
        messages: [userMsg]
      };
      setChatHistory(prev => [newHistoryItem, ...prev]);
      setCurrentChatId(targetChatId);
    } else {
      setChatHistory(prev => {
        return prev.map(h => {
          if (h.id === targetChatId) {
            return {
              ...h,
              messages: [...h.messages, userMsg]
            };
          }
          return h;
        });
      });
    }

    setInputValue("");

    // Setup active typing simulator message
    const typingId = `typing-${Date.now()}`;
    setChatHistory(prev => {
      return prev.map(h => {
        if (h.id === targetChatId) {
          return {
            ...h,
            messages: [
              ...h.messages,
              { id: typingId, sender: "ai", text: "Manus is searching and reasoning..." }
            ]
          };
        }
        return h;
      });
    });

    try {
      const chatRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const data = await chatRes.json();
      
      setChatHistory(prev => {
        return prev.map(h => {
          if (h.id === targetChatId) {
            // Remove the typing indicator and push the response truth string
            const cleanedMsgs = h.messages.filter(m => m.id !== typingId);
            return {
              ...h,
              messages: [
                ...cleanedMsgs,
                {
                  id: `msg-ai-${Date.now()}`,
                  sender: "ai",
                  text: data.response
                }
              ]
            };
          }
          return h;
        });
      });
    } catch (e) {
      console.error(e);
      setChatHistory(prev => {
        return prev.map(h => {
          if (h.id === targetChatId) {
            const cleanedMsgs = h.messages.filter(m => m.id !== typingId);
            return {
              ...h,
              messages: [
                ...cleanedMsgs,
                {
                  id: `msg-ai-err-${Date.now()}`,
                  sender: "ai",
                  text: "Processing anomaly occurred. However Polsia is currently operational and ready to receive complex deployment sequences."
                }
              ]
            };
          }
          return h;
        });
      });
    }
  };

  // Prepopulate specific prompt values relative to quick buttons
  const clickQuickAction = (actionName: string) => {
    let preset = "";
    if (actionName === "Image") preset = "Create an AI image generator SaaS portfolio";
    else if (actionName === "Slides") preset = "Draft sales presentation outlines for premium drone-delivery startup";
    else if (actionName === "Webpage") preset = "Deploy a high-converting landing page for a SF speciality coffee service";
    else if (actionName === "Spreadsheet") preset = "Compile bookkeeping sheets and financial projections for autonomous agency";
    else if (actionName === "Visualization") preset = "Generate live analytic tracking tools of B2B outreach conversion";
    else preset = "Build automated logistics platform";

    setInputValue(preset);
  };

  const filteredHistory = chatHistory.filter(h => 
    h.title?.toLowerCase().includes(searchHistoryQuery.toLowerCase())
  );

  // Filtered list of ventures for page preview sub-tab
  const filteredVentures = DEMO_VENTURES.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(selectedVentureSearch.toLowerCase()) || 
                          v.valueProp.toLowerCase().includes(selectedVentureSearch.toLowerCase()) ||
                          v.location.toLowerCase().includes(selectedVentureSearch.toLowerCase());
    const matchesCategory = selectedVentureCategory === "All" || v.category === selectedVentureCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`flex flex-col lg:flex-row h-full w-full min-h-[calc(100vh-3.5rem)] text-zinc-100 ${
      theme === "black" ? "bg-[#000000]" : "bg-[#0F1015]"
    }`}>
      
      {/* 1. LEFT SIDEBAR PANEL (Manus AI exact style) */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className={`flex-shrink-0 border-r flex flex-col justify-between overflow-hidden select-none z-10 ${
              theme === "black" ? "bg-[#0A0A0C] border-[#1A1B1D]" : "bg-[#12131A] border-[#1E202C]"
            }`}
          >
            {/* Top Area: Sidebar toggle + Search box */}
            <div className="p-4 space-y-4 shrink-0">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="Collapse Sidebar"
                >
                  <Menu className="w-4 h-4" />
                </button>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-bold text-zinc-400 tracking-tight">Manus Workstations</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                </div>
              </div>

              {/* + New task button with shortcut label */}
              <button 
                onClick={() => {
                  setCurrentChatId(null);
                  setInputValue("");
                }}
                className={`w-full py-2 px-3 border rounded-lg text-xs font-medium flex items-center justify-between tracking-tight cursor-pointer transition-all ${
                  theme === "black" 
                    ? "bg-[#121214] hover:bg-[#1A1A1E] border-zinc-800 text-zinc-300" 
                    : "bg-slate-800 hover:bg-slate-700 border-slate-750 text-slate-200"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Plus className="w-3.5 h-3.5 text-zinc-400" />
                  <span>New task</span>
                </div>
                <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-805 text-zinc-500 border border-zinc-700">Ctrl K</kbd>
              </button>

              {/* All, Favorites, Scheduled Filter Tabs */}
              <div className="flex bg-zinc-950 p-0.5 rounded-md text-xs font-medium">
                <button 
                  onClick={() => setActiveFilter("all")}
                  className={`flex-1 py-1 rounded text-center transition-colors ${activeFilter === "all" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                >All</button>
                <button 
                  onClick={() => setActiveFilter("favorites")}
                  className={`flex-1 py-1 rounded text-center transition-colors ${activeFilter === "favorites" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                >Favorites</button>
                <button 
                  onClick={() => setActiveFilter("scheduled")}
                  className={`flex-1 py-1 rounded text-center transition-colors ${activeFilter === "scheduled" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                >Scheduled</button>
              </div>

              {/* Live Search History Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                <input 
                  type="text"
                  placeholder="Query past tasks..."
                  value={searchHistoryQuery}
                  onChange={(e) => setSearchHistoryQuery(e.target.value)}
                  className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-md border outline-none ${
                    theme === "black" 
                      ? "bg-[#0A0A0C] border-zinc-850 text-white focus:border-zinc-700" 
                      : "bg-[#0B0C10] border-zinc-800 text-zinc-100 focus:border-purple-900"
                  }`}
                />
              </div>
            </div>

            {/* Middle Area: Interactive Recent Chats / Task logs */}
            <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar">
              <span className="px-2 text-[10px] font-bold tracking-wider text-zinc-500 uppercase font-mono block mb-2">Recent Execution Items</span>
              {filteredHistory.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentChatId(item.id)}
                  className={`w-full px-3 py-2.5 rounded-lg text-left text-xs transition-all flex items-center justify-between group ${
                    currentChatId === item.id
                      ? "bg-purple-950/40 text-purple-300 border border-purple-900/30 font-semibold shadow-inner"
                      : "hover:bg-zinc-900/50 border border-transparent text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className="font-semibold truncate">{item.title}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{item.timeAgo}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              ))}

              {filteredHistory.length === 0 && (
                <div className="py-8 text-center text-[11px] text-zinc-500">
                  No previous workspaces found.
                </div>
              )}
            </div>

            {/* Bottom Invitation Prompt Card */}
            <div className="p-3 shrink-0">
              <div className={`p-4 rounded-xl border flex items-start space-x-3 transition-colors ${
                theme === "black" 
                  ? "bg-[#121214] border-zinc-800 hover:bg-[#1A1A1E]" 
                  : "bg-[#1E202C]/65 border-[#2A2D3E] hover:bg-[#202334]"
              }`}>
                <div className="text-[11px] leading-relaxed flex-grow">
                  <p className="font-extrabold text-white">Share Manus with a friend</p>
                  <p className="text-zinc-500 mt-1 font-medium">Earn 500 API orchestration credits instantly upon sign up.</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              </div>

              {/* Active Operator Bio Footer */}
              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-zinc-400">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-md">
                    GP
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-extrabold text-white text-[11px] leading-none">Gavin Phillips</p>
                    <p className="text-[9px] text-zinc-500 mt-1 font-mono tracking-wider">ENTERPRISE CREDITS</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button className="p-1 rounded text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors">
                    <Bell className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 rounded text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors">
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. DYNAMIC WORKSPACE WORK AREA (Manus Right Screen) */}
      <div className="flex-1 flex flex-col items-center overflow-y-auto relative p-4 lg:p-6 w-full">
        
        {/* Toggle Sidebar floating tab if sidebar is closed */}
        {!sidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(true)}
            className={`fixed left-4 top-20 p-2 border z-20 rounded-lg shadow-xl shrink-0 transition-colors cursor-pointer ${
              theme === "black" ? "bg-[#0A0A0C] border-zinc-800 text-white hover:bg-zinc-900" : "bg-[#12131A] border-[#1E202C] text-white hover:bg-slate-800"
            }`}
            title="Open Sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        {/* Dynamic Frame Switcher */}
        {!activeChat && !isBuildingTask ? (
          /* =========================================
             LAYOUT A: HOME SCREEN WORKSPACE
             ========================================= */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl py-12 md:py-20 flex flex-col justify-center text-center space-y-8"
          >
            {/* Header Greeting Display Typo */}
            <div className="space-y-2 font-sans">
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-250 to-zinc-400">Hello JR</h1>
              <p className="text-lg md:text-xl text-zinc-400 font-medium">What can I do for you?</p>
            </div>

            {/* Intricate Rounded Input Box Container Layer */}
            <div className={`p-4 rounded-2xl border text-left shadow-2xl relative space-y-3.5 ${
              theme === "black" ? "bg-[#0A0A0C] border-[#1F2021]" : "bg-[#151622] border-[#25283D]"
            }`}>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (inputValue.trim()) handleChatSubmit(inputValue);
                  }
                }}
                placeholder="Assign a task or ask anything..."
                rows={3}
                className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none resize-none px-1 py-1"
              />

              {/* Utility Panel */}
              <div className="flex items-center justify-between pt-1 border-t border-zinc-850">
                {/* Left icons block */}
                <div className="flex items-center space-x-3 text-zinc-400">
                  <button className="p-1 rounded hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer" title="Attach file">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button className="p-1 rounded hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer text-xs font-bold leading-none animate-pulse" title="Language settings">
                    ZH
                  </button>
                  <button className="p-1 rounded hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer" title="Advanced code modules">
                    <Terminal className="w-4 h-4" />
                  </button>
                  <button className="p-1 rounded hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer" title="Grounding datasources">
                    <Globe className="w-4 h-4" />
                  </button>
                </div>

                {/* Right button selectors */}
                <div className="flex items-center space-x-3">
                  {/* Speed trigger picker */}
                  <div className="relative">
                    <select
                      value={selectedSpeed}
                      onChange={(e) => setSelectedSpeed(e.target.value as any)}
                      className="bg-zinc-950 border border-zinc-800 text-zinc-400 text-xs px-2.5 py-1 rounded cursor-pointer outline-none focus:border-zinc-700 font-medium"
                    >
                      <option value="Speed">Speed</option>
                      <option value="Pro">Pro Mode</option>
                      <option value="Creative">Creative</option>
                    </select>
                  </div>
                  
                  {/* Blue Send action arrow circle */}
                  <button 
                    onClick={() => {
                      if (inputValue.trim()) handleChatSubmit(inputValue);
                    }}
                    disabled={!inputValue.trim()}
                    className={`p-2 rounded-full transition-all flex items-center justify-center ${
                      inputValue.trim() 
                        ? "bg-white text-black hover:opacity-90 shadow-md cursor-pointer" 
                        : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick action buttons row below text entry */}
            <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
              <button 
                onClick={() => clickQuickAction("Image")}
                className="bg-zinc-950 hover:bg-zinc-900 text-zinc-350 px-3.5 py-2 rounded-xl text-xs border border-zinc-800 flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                <span>Image</span>
              </button>
              <button 
                onClick={() => clickQuickAction("Slides")}
                className="bg-zinc-950 hover:bg-zinc-900 text-zinc-350 px-3.5 py-2 rounded-xl text-xs border border-zinc-800 flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Presentation className="w-3.5 h-3.5 text-purple-400" />
                <span>Slides</span>
              </button>
              <button 
                onClick={() => clickQuickAction("Webpage")}
                className="bg-zinc-950 hover:bg-zinc-900 text-zinc-350 px-3.5 py-2 rounded-xl text-xs border border-zinc-800 flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Webpage</span>
              </button>
              <button 
                onClick={() => clickQuickAction("Spreadsheet")}
                className="bg-zinc-950 hover:bg-zinc-900 text-zinc-350 px-3.5 py-2 rounded-xl text-xs border border-zinc-800 flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Table className="w-3.5 h-3.5 text-amber-400" />
                <span>Spreadsheet</span>
                <span className="bg-purple-900/40 text-purple-300 text-[9px] px-1 rounded-sm border border-purple-800/20 font-mono tracking-tighter">New</span>
              </button>
              <button 
                onClick={() => clickQuickAction("Visualization")}
                className="bg-zinc-950 hover:bg-zinc-900 text-zinc-350 px-3.5 py-2 rounded-xl text-xs border border-[#1E1F29] flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <BarChart3 className="w-3.5 h-3.5 text-rose-500" />
                <span>Visualization</span>
              </button>
              <button 
                onClick={() => clickQuickAction("More")}
                className="bg-zinc-950 hover:bg-zinc-900 text-zinc-350 px-3.5 py-2 rounded-xl text-xs border border-zinc-800 flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-zinc-500" />
                <span>More</span>
              </button>
            </div>

            {/* Recommand tabs */}
            <div className="space-y-4 pt-6">
              <div className="flex flex-wrap justify-center items-center gap-2">
                <button 
                  onClick={() => setSelectedCategory("Recommend")}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer font-bold ${
                    selectedCategory === "Recommend" 
                      ? "bg-white text-black border-transparent" 
                      : "bg-zinc-350/5 hover:bg-zinc-900 border-[#1F202E] text-zinc-400 hover:text-white"
                  }`}
                >
                  Recommend
                </button>
                <button 
                  onClick={() => setSelectedCategory("Featured")}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    selectedCategory === "Featured" 
                      ? "bg-white text-black border-transparent font-bold" 
                      : "bg-zinc-350/5 hover:bg-zinc-900 border-[#1F202E] text-zinc-400 hover:text-white"
                  }`}
                >Featured</button>
                <button 
                  onClick={() => setSelectedCategory("Research")}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    selectedCategory === "Research" 
                      ? "bg-white text-black border-transparent font-bold" 
                      : "bg-zinc-350/5 hover:bg-zinc-900 border-[#1F202E] text-zinc-400 hover:text-white"
                  }`}
                >Research</button>
                <button 
                  onClick={() => setSelectedCategory("Data")}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    selectedCategory === "Data" 
                      ? "bg-white text-black border-transparent font-bold" 
                      : "bg-zinc-350/5 hover:bg-zinc-900 border-[#1F202E] text-zinc-400 hover:text-white"
                  }`}
                >Data</button>
                <button 
                  onClick={() => setSelectedCategory("Programming")}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    selectedCategory === "Programming" 
                      ? "bg-white text-black border-transparent font-bold" 
                      : "bg-zinc-350/5 hover:bg-zinc-900 border-[#1F202E] text-zinc-400 hover:text-white"
                  }`}
                >Programming</button>
              </div>

              {/* Grid cards templates matching screenshot */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto mt-2">
                
                {/* Cards block 1 */}
                <button 
                  onClick={() => startAgentBuildFlow("Generate overview and tech specs of Teams Town Hall API")}
                  className={`p-5 rounded-xl border transition-all text-left select-none relative group cursor-pointer ${
                    theme === "black" ? "bg-[#0A0A0C] border-[#1F2021] hover:border-zinc-700" : "bg-[#1E202C]/30 border-[#25283D] hover:border-purple-900/40"
                  }`}
                >
                  <p className="text-sm font-bold text-zinc-200 line-clamp-2 leading-relaxed tracking-tight group-hover:text-white">
                    Teams Town Hall API Overview and Capabilities
                  </p>
                  <div className="flex items-center space-x-1.5 text-[10px] text-zinc-500 font-mono tracking-wider mt-10">
                    <FileText className="w-3.5 h-3.5 text-zinc-400" />
                    <span>DOCUMENT</span>
                  </div>
                </button>

                {/* Cards block 2 */}
                <button 
                  onClick={() => startAgentBuildFlow("Compose brief audio narrative for Squid Game Season 3 Story plot")}
                  className={`p-5 rounded-xl border transition-all text-left select-none relative group group-hover:border-zinc-700 cursor-pointer ${
                    theme === "black" ? "bg-[#0A0A0C] border-[#1F2021] hover:border-zinc-700" : "bg-[#1E202C]/30 border-[#25283D] hover:border-purple-900/40"
                  }`}
                >
                  <p className="text-sm font-bold text-zinc-200 line-clamp-2 leading-relaxed tracking-tight group-hover:text-white">
                    Squid Game Season 3 Plot Explained in 5 Minutes
                  </p>
                  <div className="flex items-center space-x-1.5 text-[10px] text-zinc-500 font-mono tracking-wider mt-10">
                    <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>AUDIO</span>
                  </div>
                </button>

                {/* Cards block 3 */}
                <button 
                  onClick={() => startAgentBuildFlow("Draft high resolution analytics chart representing monthy sales trends")}
                  className={`p-5 rounded-xl border transition-all text-left select-none relative group group-hover:border-zinc-700 cursor-pointer ${
                    theme === "black" ? "bg-[#0A0A0C] border-[#1F2021] hover:border-zinc-700" : "bg-[#1E202C]/30 border-[#25283D] hover:border-purple-900/40"
                  }`}
                >
                  <p className="text-sm font-bold text-zinc-200 line-clamp-2 leading-relaxed tracking-tight group-hover:text-white">
                    High-Resolution Line Chart of Monthly Sales Trends
                  </p>
                  <div className="flex items-center space-x-1.5 text-[10px] text-zinc-500 font-mono tracking-wider mt-10">
                    <FileText className="w-3.5 h-3.5 text-zinc-400" />
                    <span>PDF</span>
                  </div>
                </button>

              </div>
              <p className="text-[10px] text-zinc-650 leading-normal text-center font-mono opacity-80 pt-4">
                All community content is voluntarily shared by users and will not be displayed without consent.
              </p>
            </div>
          </motion.div>
        ) : (
          /* =========================================
             LAYOUT B: ACTIVE TASK PREVIEW & SPLIT CONTAINER FOR WEBSITE EXAMPLES
             ========================================= */
          <div className="w-full flex-grow flex flex-col justify-between">
            
            {/* Upper Action Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-850 shrink-0">
              <div className="flex items-center space-x-3 text-left font-sans">
                <h2 className="text-base font-bold text-white tracking-tight">
                  {isBuildingTask ? "Executing Deployment Strategy" : activeChat?.title}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-950 text-purple-400 border border-purple-950/40 font-mono">WORKSPACE SECURED</span>
              </div>

              {/* Toolbar */}
              <div className="flex items-center space-x-1 bg-[#12131C] p-1.5 rounded-lg border border-[#1E202E]">
                <button className="p-1 px-2.5 rounded text-xs font-semibold text-zinc-350 hover:text-white flex items-center space-x-1 hover:bg-zinc-800 transition-colors cursor-pointer" title="Share Workspace">
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                <div className="w-[1px] h-3.5 bg-zinc-800" />
                <button className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer" title="Star item">
                  <Star className="w-3.5 h-3.5" />
                </button>
                <button className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer" title="Expand view">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
                <button className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Split Grid for 4th Project ("Self-Sustaining Venture Platform") */}
            <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 w-full py-4 text-left">
              
              {/* LEFT COLUMN: Manus Agent Workspace (all messages & console checklist) */}
              <div className={`flex flex-col h-full justify-between focus-within:ring-0 ${
                activeChat?.id === "history-4" ? "xl:col-span-6" : "xl:col-span-12 max-w-4xl mx-auto"
              }`}>
                {/* Scroll container of agent outputs and checklist */}
                <div className="flex-1 overflow-y-auto w-full pr-1 space-y-6 max-h-[calc(100vh-17rem)] scrollbar">
                  
                  <div className="bg-[#121214] border border-[#1F2021] p-2 px-3 rounded-lg text-xs flex items-center space-x-2 text-zinc-400 self-start w-fit">
                    <ClipboardCheck className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                    <span>Connected to active Xcelero repositories (4)</span>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                  </div>

                  {/* Message Loop */}
                  <div className="space-y-6">
                    {(activeChat?.messages || []).map((msg) => (
                      <div key={msg.id} className="space-y-4">
                        
                        {/* User Prompt */}
                        {msg.sender === "user" && (
                          <div className="flex items-start space-x-3 bg-zinc-900/20 p-4 rounded-xl border border-[#1E202E]/30">
                            <div className="w-6 h-6 rounded-full bg-indigo-900/60 flex items-center justify-center text-[10px] font-bold text-white shrink-0 font-mono">
                              U
                            </div>
                            <div className="text-sm text-zinc-200 leading-relaxed font-sans">
                              {msg.text}
                            </div>
                          </div>
                        )}

                        {/* AI Response Block */}
                        {msg.sender === "ai" && (
                          <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 rounded-full bg-purple-950 border border-purple-800/40 flex items-center justify-center text-[10px] text-purple-400 font-bold shrink-0 mt-0.5 font-mono">
                                M
                              </div>
                              <div className="text-sm text-zinc-300 flex-grow pr-4 leading-relaxed font-sans font-medium">
                                {msg.text}
                              </div>
                            </div>

                            {/* Checklist steps inside the left agent bubble */}
                            {msg.isStepExecution && msg.steps && (
                              <div className="pl-9 space-y-5">
                                {msg.steps.map((step, sIdx) => (
                                  <div key={sIdx} className="space-y-2.5">
                                    <div className="flex items-center space-x-3">
                                      {step.completed ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                      ) : (
                                        <RefreshCw className="w-5 h-5 text-purple-400 animate-spin shrink-0" />
                                      )}
                                      <span className="font-bold text-sm text-zinc-100 tracking-tight">{step.title}</span>
                                    </div>
                                    <div className="pl-8 border-l border-zinc-850 space-y-2 text-zinc-400">
                                      <p className="text-xs">{step.description}</p>
                                      
                                      {step.logs && (
                                        <div className="bg-[#050508] p-3 rounded-lg border border-zinc-850 font-mono text-[10.5px] text-zinc-400 space-y-1 mt-1 leading-normal max-w-xl">
                                          {step.logs.map((log, lIdx) => (
                                            <div key={lIdx} className="flex items-center space-x-1.5">
                                              <span className="text-purple-700 font-bold">{`>`}</span>
                                              <span>{log}</span>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                      </div>
                    ))}
                  </div>

                  {/* Active Ticking Build Sequence logs */}
                  {isBuildingTask && buildSteps.length > 0 && (
                    <div className="space-y-6">
                      <div className="space-y-5">
                        {buildSteps.map((step, sIdx) => {
                          const isCurrentActive = sIdx === activeStepIdx;
                          const hasCompleted = step.completed;
                          const isFuture = sIdx > activeStepIdx;

                          return (
                            <div key={sIdx} className={`space-y-2.5 ${isFuture ? "opacity-35" : ""}`}>
                              <div className="flex items-center space-x-3 text-left">
                                {hasCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                ) : isCurrentActive ? (
                                  <div className="w-5 h-5 rounded-full border border-purple-850 text-purple-400 flex items-center justify-center shrink-0">
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 rounded-full border border-zinc-805 bg-[#0E0E10] shrink-0" />
                                )}
                                <span className="font-bold text-sm text-zinc-100 tracking-tight leading-none">{step.title}</span>
                              </div>

                              {!isFuture && (
                                <div className="pl-8 border-l border-zinc-850 space-y-2 text-zinc-400 text-left">
                                  <p className="text-xs">{step.description}</p>
                                  {step.logs && isCurrentActive && (
                                    <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-850 font-mono text-[11px] text-zinc-300 space-y-1 leading-normal max-w-xl">
                                      {step.logs.map((log: string, lIdx: number) => (
                                        <div key={lIdx} className="flex items-center space-x-1.5">
                                          <span className="text-zinc-500">{`>`}</span>
                                          <span>{log}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Floating status timer */}
                      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-3 max-w-md text-xs flex items-center justify-between font-mono">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
                          <span className="font-bold text-zinc-300">Manus is working: Orchestrating cloud blueprint...</span>
                        </div>
                        <div className="flex items-center space-x-2 text-zinc-500">
                          <span>{activeStepIdx + 1} / 4</span>
                          <span>•</span>
                          <span>{formatSeconds(elapsedSeconds)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </div>

                {/* Left panel chat submit block */}
                <div className={`p-4 border-t shrink-0 ${
                  theme === "black" ? "border-zinc-850 bg-black" : "border-[#1E202E]/60 bg-[#12131A]"
                } rounded-xl mt-3`}>
                  <div className="relative flex items-center w-full">
                    <input 
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && inputValue.trim()) {
                          handleChatSubmit(inputValue);
                        }
                      }}
                      disabled={isBuildingTask}
                      placeholder="Message Manus..."
                      className={`w-full pl-4 pr-12 py-3 text-sm rounded-lg outline-none transition-all border ${
                        theme === "black" 
                          ? "bg-[#121214] border-zinc-850 text-white placeholder-zinc-500 focus:border-zinc-700" 
                          : "bg-[#151624] border-[#222533] text-slate-100 placeholder-slate-400 focus:border-purple-900/45"
                      }`}
                    />
                    
                    <button className="absolute right-12 p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer">
                      <Paperclip className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={() => handleChatSubmit(inputValue)}
                      disabled={!inputValue.trim() || isBuildingTask}
                      className="absolute right-2.5 p-1.5 rounded-md text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
                    >
                      {isBuildingTask ? <RefreshCw className="w-4 h-4 animate-spin text-purple-400" /> : <Send className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Interactive High-Fidelity Webpage Preview (Xcelero style) */}
              {activeChat?.id === "history-4" && (
                <div className="xl:col-span-6 flex flex-col border border-[#1E202E] rounded-xl bg-[#050505] overflow-clip shadow-2xl h-[580px] lg:h-[720px] relative select-none">
                  
                  {/* Browser simulated Header wrapper */}
                  <div className="bg-[#0C0C12] border-b border-[#1A1C28] p-3 flex items-center justify-between shrink-0 text-zinc-400">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      </div>
                      <div className="h-4 w-[1px] bg-zinc-800 mx-1.5" />
                      <div className="flex items-center space-x-1 font-mono text-[10px] bg-zinc-950 rounded-sm border border-zinc-900 px-2.5 py-0.5 text-[#3B82F6]">
                        <ShieldCheck className="w-3 h-3" />
                        <span>SSL ENCRYPTED</span>
                      </div>
                    </div>

                    {/* URL simulated Input bar */}
                    <div className="flex-1 max-w-sm mx-4 bg-[#050508] border border-zinc-850 px-3 py-1 rounded text-[11px] font-mono select-all truncate text-left text-zinc-200">
                      https://protocontrol-shcggmfg.manus.space
                    </div>

                    <div className="flex items-center space-x-1 text-zinc-400">
                      <RefreshCw className="w-3.5 h-3.5 p-0.5 hover:bg-zinc-800 rounded cursor-pointer transition-colors" />
                      <SlidersHorizontal className="w-3.5 h-3.5 p-0.5 hover:bg-zinc-800 rounded" />
                    </div>
                  </div>

                  {/* HTML/Website Iframe container viewport */}
                  <div className="flex-grow overflow-y-auto bg-[#050505] relative scrollbar flex flex-col justify-between">
                    
                    {/* Embedded website Nav Header bar */}
                    <header className="border-b border-zinc-900/60 bg-[#050505] py-4 px-6 flex items-center justify-between shrink-0 font-sans">
                      <div 
                        onClick={() => setPreviewTab("route")}
                        className="flex items-center space-x-2 cursor-pointer group"
                      >
                        <div className="w-4 h-4 rounded-sm bg-[#3B82F6] flex items-center justify-center font-extrabold text-[9px] text-white">X</div>
                        <span className="font-bold text-sm text-white tracking-tight font-sans">Xcelero Labs</span>
                      </div>

                      {/* Visual Nav bar links */}
                      <nav className="hidden md:flex items-center space-x-6 text-xs text-zinc-400 font-medium font-sans">
                        <button 
                          onClick={() => setPreviewTab("route")}
                          className={`transition-colors relative hover:text-white ${previewTab === "route" ? "text-[#3B82F6] font-bold" : ""}`}
                        >
                          The Route
                          {previewTab === "route" && <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#3B82F6]" />}
                        </button>
                        <button 
                          onClick={() => setPreviewTab("cities")}
                          className={`transition-colors relative hover:text-white ${previewTab === "cities" ? "text-[#3B82F6] font-bold" : ""}`}
                        >
                          Cities
                          {previewTab === "cities" && <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#3B82F6]" />}
                        </button>
                        <button 
                          onClick={() => setPreviewTab("protocos")}
                          className={`transition-colors relative hover:text-white ${previewTab === "protocos" ? "text-[#3B82F6] font-bold" : ""}`}
                        >
                          ProtoCos
                          {previewTab === "protocos" && <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#3B82F6]" />}
                        </button>
                        <button 
                          onClick={() => setPreviewTab("league")}
                          className={`transition-colors relative hover:text-white ${previewTab === "league" ? "text-[#3B82F6] font-bold" : ""}`}
                        >
                          About the League
                          {previewTab === "league" && <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#3B82F6]" />}
                        </button>
                      </nav>

                      <div className="flex items-center space-x-3">
                        <Search className="w-4 h-4 text-zinc-500 hover:text-white cursor-pointer" />
                        <button 
                          onClick={() => setPreviewTab("league")}
                          className="px-3 py-1 bg-white text-black text-[11px] font-bold rounded-full hover:opacity-90 transition-opacity"
                        >
                          Join the Route
                        </button>
                      </div>
                    </header>

                    {/* DYNAMIC VIEWPORT SWITCHER */}
                    <div className="flex-grow p-6 lg:p-8 font-sans">
                      
                      {/* VIEW 1: THE ROUTE (Hero display exact replica of screen 2) */}
                      {previewTab === "route" && (
                        <div className="space-y-12 py-6 text-center max-w-xl mx-auto flex flex-col justify-center min-h-[350px]">
                          
                          {/* Pulsing Pill */}
                          <div className="mx-auto flex items-center justify-center space-x-1.5 rounded-full border border-[#3B82F6]/20 bg-[#3B82F6]/5 p-1 px-3 w-fit text-[#3B82F6] font-mono text-[9.5px] font-bold tracking-wider uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
                            <span>A new league of cities</span>
                          </div>

                          {/* Giant Typography headings matching screenshot */}
                          <div className="space-y-4">
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight select-none">
                              The Xcelero Route
                            </h1>
                            <p className="text-zinc-400 text-xs lg:text-sm leading-relaxed max-w-md mx-auto font-medium">
                              Seven cities. One shared protocol. A new union of innovation corridors being built from scratch — connecting talent, capital, and infrastructure across continents through curated immersion programs.
                            </p>
                          </div>

                          {/* Triggerable Action rows */}
                          <div className="flex items-center justify-center gap-3">
                            <button 
                              onClick={() => {
                                setShowPackageDeals(true);
                              }}
                              className="px-5 py-2.5 bg-[#3B82F6] text-white rounded-lg text-xs font-bold hover:bg-[#2563EB] transition-colors shadow-md shadow-blue-500/10 flex items-center space-x-1"
                            >
                              <span>Explore Package Deals</span>
                              <span>↓</span>
                            </button>
                            <button 
                              onClick={() => setPreviewTab("league")}
                              className="px-5 py-2.5 border border-zinc-800 text-zinc-300 rounded-lg text-xs font-medium hover:bg-zinc-950 transition-colors"
                            >
                              Read the Manifesto
                            </button>
                          </div>

                          {/* Horizontal divider */}
                          <div className="border-t border-zinc-900 w-full pt-8" />

                          {/* Stats Grid */}
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="space-y-1 border-r border-[#1E202E]/60">
                              <p className="text-3xl font-extrabold text-white">7</p>
                              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono">CITIES</p>
                            </div>
                            <div className="space-y-1 border-r border-[#1E202E]/60">
                              <p className="text-3xl font-extrabold text-white">4</p>
                              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono">CONTINENTS</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-3xl font-extrabold text-white">2025</p>
                              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono">INAUGURAL</p>
                            </div>
                          </div>

                          {/* Quick Package deals popup modal if clicked */}
                          <AnimatePresence>
                            {showPackageDeals && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                              >
                                <div className="bg-[#0A0A0E] border border-zinc-805 p-6 rounded-xl max-w-sm w-full space-y-4">
                                  <div className="flex justify-between items-center pb-2 border-b border-zinc-850">
                                    <h4 className="font-bold text-sm text-white flex items-center space-x-1.5">
                                      <Sparkles className="w-4 h-4 text-[#3B82F6]" />
                                      <span>Immersion Package Deals</span>
                                    </h4>
                                    <button 
                                      onClick={() => setShowPackageDeals(false)}
                                      className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-850"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <div className="space-y-3">
                                    <div className="p-3 rounded-lg border border-zinc-900 bg-zinc-950 hover:bg-[#07070F] transition-colors text-left space-y-1">
                                      <p className="text-xs font-bold text-white flex justify-between">
                                        <span>Triple Hub Explorer</span>
                                        <span className="text-[#3B82F6]">$1,200</span>
                                      </p>
                                      <p className="text-[10px] text-zinc-400 leading-normal">Lagos Corridor + Accra Hub + Kigali Gateway. Includes pass clearance and shared workspace credits.</p>
                                    </div>
                                    <div className="p-3 rounded-lg border border-zinc-900 bg-zinc-950 hover:bg-[#07070F] transition-colors text-left space-y-1">
                                      <p className="text-xs font-bold text-white flex justify-between">
                                        <span>Valley to Summit Alpha</span>
                                        <span className="text-[#3B82F6]">$2,400</span>
                                      </p>
                                      <p className="text-[10px] text-zinc-400 leading-normal">San Francisco Grid Link + Lisbon Outpost + Cape Town Venture Summit. Direct introductions and local advisor meetings.</p>
                                    </div>
                                  </div>
                                  <p className="text-[9px] text-zinc-600 leading-relaxed italic text-center font-mono">Pricing excludes flight segments. Standard visa operations managed via Kigali gateway protocols.</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                        </div>
                      )}

                      {/* VIEW 2: CITIES CORRIDORS */}
                      {previewTab === "cities" && (
                        <div className="space-y-6">
                          <header className="space-y-1.5">
                            <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono text-[#3B82F6]">Corridor Network Status</h3>
                            <p className="text-xs text-zinc-400">The decentralized innovation corridors mapping the Xcelero protocol across Common Law micro-jurisdictions.</p>
                          </header>

                          {/* Dynamic Bento representation */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[380px] overflow-y-auto pr-1 scrollbar">
                            {[
                              { id: "lagos", name: "Lagos Corridor", desc: "Quantum Corridors - focus on high frequency fintech settlements, stablecoin clearing, and Web3 smart wallets.", status: "Active Corridor" },
                              { id: "nairobi", name: "Nairobi Valley", desc: "Sustainable Grid - focus on off-grid micro-utilities, solar dynamic trade credits, and drone agricultural delivery channels.", status: "Active Corridor" },
                              { id: "capetown", name: "Cape Town Summit", desc: "Venture Corridors - focus on ocean exploration tech, developer academies, and global remote freelancer collectives.", status: "Active Corridor" },
                              { id: "kigali", name: "Kigali Gateway", desc: "Regulatory Sandbox - simplified border registries, business residency logs, and Common Law arbitration codes.", status: "Strategic Hub" },
                              { id: "accra", name: "Accra Hub", desc: "Creative Technologies - focus on AI content creators, game art assets studio, and translation modular audio networks.", status: "Active Corridor" },
                              { id: "sf", name: "San Francisco Corridor", desc: "Capital Outpost - focus on primary investment bridges, global fund deck operations, and sovereign server indexing.", status: "Terminal Bridge" },
                              { id: "lisbon", name: "Lisbon Outpost", desc: "Euro Outpost - focus on outbound legal clearing, European Union passporting proxies, and remote digital nominal support.", status: "Strategic Outpost" }
                            ].map((city) => (
                              <div 
                                key={city.id}
                                onClick={() => setSelectedCityDetail(selectedCityDetail === city.id ? null : city.id)}
                                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                                  selectedCityDetail === city.id 
                                    ? "bg-zinc-950 border-[#3B82F6] shadow-md shadow-blue-500/5 scale-[0.99]" 
                                    : "bg-zinc-900/40 border-zinc-900 hover:border-zinc-800"
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <h4 className="font-bold text-sm text-white">{city.name}</h4>
                                  <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                                    city.status === "Active Corridor" ? "bg-emerald-500/10 text-emerald-400" : "bg-[#3B82F6]/10 text-[#3B82F6]"
                                  }`}>{city.status}</span>
                                </div>
                                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                                  {city.desc}
                                </p>
                                {selectedCityDetail === city.id && (
                                  <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="mt-3 pt-3 border-t border-zinc-900 text-[10px] space-y-1 font-mono text-[#3B82F6]"
                                  >
                                    <div className="flex justify-between"><span>OPERATIONAL LATENCY:</span><span>14ms</span></div>
                                    <div className="flex justify-between"><span>MAPPED VEUTRES:</span><span>15 ventures</span></div>
                                    <div className="flex justify-between"><span>LOCAL ARBITRATION:</span><span>Protocol Case-ID #21</span></div>
                                  </motion.div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* VIEW 3: PROCTO VETURES LIST (Search, filtering, and highly-detailed popup modals) */}
                      {previewTab === "protocos" && (
                        <div className="space-y-5 flex flex-col h-full">
                          
                          <header className="space-y-1">
                            <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono text-[#3B82F6]">ProtoCos Portfolio</h3>
                            <p className="text-xs text-zinc-400">Filtering the 105+ autonomous enterprises currently built and managed under the Xcelero protocol directory.</p>
                          </header>

                          {/* Live Search and category filters */}
                          <div className="space-y-2.5 shrink-0 font-sans">
                            <div className="relative">
                              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                              <input 
                                type="text"
                                value={selectedVentureSearch}
                                onChange={(e) => setSelectedVentureSearch(e.target.value)}
                                placeholder="Search ventures by name, sector, or keywords..."
                                className="w-full bg-[#0E0E10] border border-zinc-850 px-9 py-1.5 rounded-lg text-xs outline-none focus:border-[#3B82F6] transition-colors"
                              />
                            </div>

                            {/* Horizontal Filters list */}
                            <div className="flex flex-wrap gap-1.5">
                              {["All", "AI Agents", "BioTech", "Corridors", "Fintech", "Logistics"].map((category) => (
                                <button
                                  key={category}
                                  onClick={() => setSelectedVentureCategory(category)}
                                  className={`px-3 py-1 rounded text-[10px] transition-colors uppercase font-bold tracking-wider ${
                                    selectedVentureCategory === category
                                      ? "bg-[#3B82F6] text-white"
                                      : "bg-zinc-900 border border-zinc-950 text-zinc-400 hover:bg-zinc-805"
                                  }`}
                                >
                                  {category}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Ventures Grid scrollbox */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[290px] overflow-y-auto pr-1 scrollbar select-none">
                            {filteredVentures.map((v, idx) => (
                              <div
                                key={idx}
                                onClick={() => setSelectedVentureDetail(v)}
                                className="p-4 rounded-xl border border-zinc-900 bg-zinc-950 hover:border-[#3B82F6]/60 cursor-pointer transition-all text-left space-y-2 relative group hover:bg-[#07070F]"
                              >
                                <div className="flex justify-between items-start">
                                  <h4 className="font-bold text-xs text-white group-hover:text-[#3B82F6] transition-colors">{v.name}</h4>
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 text-[#3B82F6] font-mono font-bold tracking-tight uppercase">
                                    {v.category}
                                  </span>
                                </div>
                                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                                  {v.valueProp}
                                </p>
                                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-1">
                                  <span>{v.location}</span>
                                  <span className="text-[#3B82F6] font-semibold">{v.mrr} MRR</span>
                                </div>
                              </div>
                            ))}

                            {filteredVentures.length === 0 && (
                              <div className="col-span-2 text-center py-10 text-xs text-zinc-500">
                                No innovative ventures match search terms.
                              </div>
                            )}
                          </div>

                          {/* HIGH FIDELITY VENTURE DETAIL PORTFOLIO OVERLAY/MODAL */}
                          <AnimatePresence>
                            {selectedVentureDetail && (
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/95 backdrop-blur-md z-50 p-6 flex flex-col justify-between overflow-y-auto"
                              >
                                <div className="space-y-5">
                                  {/* Modal Header */}
                                  <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                                    <button 
                                      onClick={() => setSelectedVentureDetail(null)}
                                      className="flex items-center space-x-1.5 text-xs text-[#3B82F6] font-bold hover:text-white transition-colors"
                                    >
                                      <ArrowLeft className="w-3.5 h-3.5" />
                                      <span>Back to Directory</span>
                                    </button>
                                    <span className="text-[10px] font-mono text-zinc-500">{selectedVentureDetail.location}</span>
                                  </div>

                                  {/* Title row */}
                                  <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                      <h3 className="text-xl font-bold text-white tracking-tight">{selectedVentureDetail.name}</h3>
                                      <span className="bg-[#3B82F6]/10 text-[#3B82F6] text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">{selectedVentureDetail.category}</span>
                                    </div>
                                    <p className="text-xs text-zinc-400 italic">Operating live sequence. Estimated recurring revenue: {selectedVentureDetail.mrr} /mo</p>
                                  </div>

                                  {/* Description block */}
                                  <div className="space-y-2">
                                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-zinc-500 font-mono block">Venture Value Proposition</span>
                                    <p className="text-xs text-zinc-300 leading-relaxed font-sans font-medium">
                                      {selectedVentureDetail.valueProp}
                                    </p>
                                  </div>

                                  {/* Tech stack badges */}
                                  <div className="space-y-1.5">
                                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-zinc-500 font-mono block">Developer Core Stack</span>
                                    <div className="flex flex-wrap gap-1">
                                      {selectedVentureDetail.techStack.map((stack, sIdx) => (
                                        <span key={sIdx} className="bg-zinc-900 p-1 px-2.5 text-[10px] text-zinc-400 rounded font-medium border border-zinc-950">{stack}</span>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Code Block Tab */}
                                  <div className="space-y-2">
                                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-zinc-500 font-mono block">Compiled Database Schema</span>
                                    <pre className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 font-mono text-[10px] text-zinc-300 tracking-normal scrollbar text-left overflow-x-auto whitespace-pre">
                                      {selectedVentureDetail.schema}
                                    </pre>
                                  </div>

                                  {/* Operational Sandbox Code preview */}
                                  <div className="space-y-2">
                                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-zinc-500 font-mono block">Active React Microservice</span>
                                    <pre className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 font-mono text-[10px] text-zinc-300 tracking-normal scrollbar text-left overflow-x-auto whitespace-pre">
                                      {selectedVentureDetail.code}
                                    </pre>
                                  </div>

                                </div>

                                {/* Modal Close footer */}
                                <div className="mt-8 pt-4 border-t border-zinc-900 flex justify-between items-center text-[10px] font-mono text-zinc-500 font-medium font-sans">
                                  <span>Repository: {selectedVentureDetail.repo}</span>
                                  <button 
                                    onClick={() => setSelectedVentureDetail(null)}
                                    className="px-4 py-1.5 bg-[#3B82F6] hover:bg-blue-600 transition-colors text-white font-bold rounded-md"
                                  >
                                    Close Explorer
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                        </div>
                      )}

                      {/* VIEW 4: LEAGUE MANIFESTO */}
                      {previewTab === "league" && (
                        <div className="space-y-6 max-h-[380px] overflow-y-auto pr-1 scrollbar">
                          <header className="space-y-1 cursor-pointer" onClick={() => setPreviewTab("route")}>
                            <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono text-[#3B82F6]">About the Corridor League</h3>
                            <p className="text-xs text-zinc-400">Establishing digital residency protocols and unified Common Law guidelines across international boundaries.</p>
                          </header>

                          <div className="space-y-4 text-xs text-zinc-400 leading-relaxed font-sans font-medium">
                            <p>
                              The Xcelero Corridor League is born out of a simple observation: physical proximity and geopolitical boundaries are increasingly disconnected from creative, technical, and capital alignments.
                            </p>
                            <p>
                              Rather than attempting to build localized single cities from scratch, the Corridor Union integrates preexisting hubs into a unified **Special Innovation Zone (SIZ)**. This zone is globally distributed but digitally and legally aligned under a cohesive operational protocol.
                            </p>
                            <div className="p-4 bg-zinc-905 border border-zinc-900 rounded-lg text-[#3B82F6] font-mono text-[11px] text-left space-y-1 hover:border-[#3B82F6]/40 transition-colors">
                              <p className="font-bold uppercase tracking-wide">Key Corridor Foundations:</p>
                              <p className={`mt-2 ${theme === "black" ? "text-zinc-400" : "text-zinc-300"}`}>1. **Unified Enterprise Registry**: Launch once, operationalize across 7 corridors instantly.</p>
                              <p className={`${theme === "black" ? "text-zinc-400" : "text-zinc-300"}`}>2. **Common Law Sandbox**: Direct, prompt arbitration governed by specific innovation-friendly policies.</p>
                              <p className={`${theme === "black" ? "text-zinc-400" : "text-zinc-300"}`}>3. **Port 3000 Autonomous Nodes**: Automatic cloud scaling with continuous deployment backups.</p>
                            </div>
                            <p className="pt-2">
                              By joining the Route, freelancers, software authors, and biotechnology researchers gain immediate access to physical workspaces, regulatory clearance, and peer-to-peer liquidity networks without traditional borders.
                            </p>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Bottom Status bars matching precise styling details from the screen screenshot */}
                    <div className="p-4 border-t border-zinc-900/40 bg-[#050505] flex items-center justify-between shrink-0 font-mono text-[10.5px]">
                      
                      {/* Left: Yellow warning capsule resembling the bottom panel exact style */}
                      <div className="bg-amber-950/20 border border-amber-500/20 px-2 py-0.5 rounded text-amber-500 flex items-center space-x-1.5">
                        <AlertTriangle className="w-3 h-3 text-amber-500 animate-pulse" />
                        <span>Connected Corridors Sandbox Mode</span>
                      </div>

                      {/* Right: Made with Manus badge */}
                      <div className="bg-zinc-950 border border-zinc-900 text-zinc-400 px-2 py-0.5 rounded text-[10px] font-semibold hover:border-[#3B82F6]/40 transition-colors cursor-help" title="Orchestrated autonomously by Manus v1.6 Lite">
                        <span>Made with Manus</span>
                      </div>

                    </div>

                  </div>

                </div>
              )}

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
