import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, Users, ClipboardList, Rocket, ArrowRight, ArrowLeft, 
  CheckCircle2, RefreshCw, Cpu, BrainCircuit, Play, Sparkles, Terminal,
  Lock, Mail, Star, HelpCircle, Laptop, ShieldCheck, Heart, User, MessageSquare
} from "lucide-react";
import { PolsiaCompany } from "../types";

interface OnboardingProps {
  onAddCompany: (company: PolsiaCompany) => void;
  setTab: (tab: "homepage" | "dashboard" | "manus" | "onboarding") => void;
}

export default function OnboardingFlow({ onAddCompany, setTab }: OnboardingProps) {
  // Navigation states
  const [step, setStep] = useState<"signin" | "signup" | "wizard">(() => {
    const auth = localStorage.getItem("polsia_authenticated");
    return auth === "true" ? "wizard" : "signin";
  });
  const [activeTab, setActiveTab] = useState<"company" | "agent" | "task" | "launch">("company");

  // Sign-in / Sign-up states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Company states
  const [companyName, setCompanyName] = useState("Acme Corp");
  const [useAIOrchestration, setUseAIOrchestration] = useState(true);
  const [businessIdea, setBusinessIdea] = useState("AI-powered customer roasted coffee subscription in San Francisco");
  const [mission, setMission] = useState("Empower coffee lovers with fresh, automated roasts designed around their lifestyle schedules.");
  const [isGeneratingCompany, setIsGeneratingCompany] = useState(false);
  const [customCompanyData, setCustomCompanyData] = useState<PolsiaCompany | null>(null);

  // Agent states
  const [agents, setAgents] = useState([
    { id: "ceo", name: "CEO", role: "Codex (local)", desc: "Coordinates system logs, plans roadmap pipelines, and updates financials.", enabled: true, engine: "Gemini 3.5 Flash", customize: false },
    { id: "dev", name: "Lead Engineer", role: "Developer", desc: "Builds TypeScript React clients, schemas databases, and pushes commits.", enabled: true, engine: "Gemini 3.5 Flash", customize: false },
    { id: "sales", name: "Growth Specialist", role: "Outreach & Ads", desc: "Monitors target leads conversion lists and allocates campaigns budget.", enabled: true, engine: "Gemini 1.5 Pro", customize: false },
    { id: "support", name: "Support Rep", role: "Customer Support", desc: "Addresses customer ticket queue simulations and maps FAQ matrices.", enabled: true, engine: "Gemini 3.5 Flash", customize: false }
  ]);

  // Task states
  const [taskMode, setTaskMode] = useState<"manual" | "ai">("ai");
  const [taskTitle, setTaskTitle] = useState("Hire your first engineer and create a hiring plan");
  const [taskDescription, setTaskDescription] = useState(
    "You are the CEO. You set the direction for the company.\n\n- hire a founding engineer\n- write a hiring plan\n- break the roadmap into concrete tasks and start delegating work"
  );
  
  // Gemini AI task generator states
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const [aiGeneratedSuccess, setAiGeneratedSuccess] = useState(false);

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsSigningIn(true);
    setTimeout(() => {
      const usersRaw = localStorage.getItem("polsia_registered_users");
      const users = usersRaw ? JSON.parse(usersRaw) : {};
      
      const exists = Object.keys(users).length > 0;
      if (exists) {
        if (!users[email]) {
          setIsSigningIn(false);
          setAuthError("No account found with this email. Please register by clicking 'Create one' below.");
          return;
        }
        if (users[email] !== password) {
          setIsSigningIn(false);
          setAuthError("Incorrect password. Please verify your credentials and try again.");
          return;
        }
      } else {
        // If no users registered yet, auto-register this email to make testing seamless
        users[email] = password;
        localStorage.setItem("polsia_registered_users", JSON.stringify(users));
      }

      localStorage.setItem("polsia_authenticated", "true");
      localStorage.setItem("polsia_user_email", email);
      setIsSigningIn(false);
      setStep("wizard");
    }, 850);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (password !== confirmPassword) {
      setAuthError("Passwords do not match. Please re-type your confirm password card.");
      return;
    }

    setIsSigningUp(true);
    setTimeout(() => {
      const usersRaw = localStorage.getItem("polsia_registered_users");
      const users = usersRaw ? JSON.parse(usersRaw) : {};

      if (users[email]) {
        setIsSigningUp(false);
        setAuthError("This email is already registered. Please sign in instead.");
        return;
      }

      users[email] = password;
      localStorage.setItem("polsia_registered_users", JSON.stringify(users));

      // Persist authenticated status so they do not have to log in every time
      localStorage.setItem("polsia_authenticated", "true");
      localStorage.setItem("polsia_user_email", email);
      
      setIsSigningUp(false);
      setStep("wizard");
    }, 850);
  };

  // Live trigger to generate whole company details using `/api/operate` with Gemini
  const handleAIScaffoldCompany = async () => {
    if (!businessIdea.trim()) return;
    setIsGeneratingCompany(true);
    try {
      const response = await fetch("/api/operate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessIdea })
      });
      const data = await response.json();
      if (data.company) {
        setCustomCompanyData(data.company);
        setCompanyName(data.company.name);
        setMission(data.company.tagline || data.company.planner?.valueProp || "Successfully scaffolded autonomous pipeline.");
      }
    } catch (err) {
      console.error("AI scaffolding error:", err);
    } finally {
      setIsGeneratingCompany(false);
    }
  };

  // Live trigger to generate task listing utilizing `/api/chat` with Gemini
  const handleAIGenerateTasks = async () => {
    setIsGeneratingTasks(true);
    setAiGeneratedSuccess(false);

    try {
      const prompt = `Generate a structured starter task for a company named "${companyName}" with mission "${mission}". 
      Respond with exactly a JSON object having "title" and "description" keys. Keep description formatted with bullet points exactly like:
      "You are the CEO. You set the direction for the company.
      
      - first bullet point
      - second bullet point
      - third bullet point"
      Return ONLY valid JSON.`;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt })
      });
      const data = await response.json();
      
      if (data.response) {
        // Try to parse JSON from the response text
        const text = data.response;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.title) setTaskTitle(parsed.title);
          if (parsed.description) setTaskDescription(parsed.description);
        } else {
          // Fallback parser if no strict json
          const lines = text.split("\n").filter((l: string) => l.trim().length > 0);
          if (lines.length > 0) {
            setTaskTitle(lines[0].replace(/[#*"-]/g, "").trim());
            setTaskDescription(text);
          }
        }
        setAiGeneratedSuccess(true);
      }
    } catch (e) {
      console.error("Failed to generate task via Gemini:", e);
      // Fallback
      setTaskTitle(`Launch ${companyName} Core Alpha & Pilot Testing`);
      setTaskDescription(`Set direction and initialize deployment.\n\n- Launch web production portal\n- Build first automated pipeline telemetry\n- Connect outreach queue to convert first leads`);
      setAiGeneratedSuccess(true);
    } finally {
      setIsGeneratingTasks(false);
    }
  };

  const finalizeLaunch = () => {
    // Scaffold new company model
    const companyId = "polsia-" + Math.random().toString(36).substring(2, 9);
    
    // Choose fallback properties if no AI custom scaffold is loaded
    const finalCompany: PolsiaCompany = customCompanyData || {
      id: companyId,
      name: companyName,
      tagline: mission || "Expanding horizons with smart automation.",
      businessIdea: businessIdea || "Direct client sandbox service.",
      createdAt: new Date().toISOString(),
      status: "operating",
      planner: {
        valueProp: mission,
        roadmap: [
          { phase: "Phase 1", title: "Initialize Sandbox", description: "Spin up server blade environment", status: "completed" },
          { phase: "Phase 2", title: "Configure Workers", description: "Deploy automated worker nodes", status: "completed" },
          { phase: "Phase 3", title: "Action Starter Task", description: taskTitle, status: "in-progress" },
          { phase: "Phase 4", title: "Public Launch Campaign", description: "Run ads and target prospect lists", status: "pending" }
        ]
      },
      developer: {
        techStack: ["React 19", "Vite", "TypeScript", "Tailwind CSS"],
        schema: "CREATE TABLE tenants (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(100),\n  active BOOLEAN NOT NULL\n);",
        code: "// Main Entry\nimport React from 'react';\nexport function Widget() {\n  return <div>Operated Widget</div>;\n}",
        repoName: `polsia-${companyName.toLowerCase().replace(/\s+/g, "-")}`
      },
      outreach: {
        emailSubject: `Connecting from ${companyName}`,
        emailBody: `Hi {{contactName}},\n\nI noticed you are operating in this domain and wanted to showcase our automated solutions for ${companyName}.\n\nBest,\nPolsia Bot`,
        leads: [
          { companyName: "Sutter Tech Partners", contactName: "Alice Miller", role: "VP Strategy", estimatedContractValue: "$12,000", status: "leads" },
          { companyName: "Cascade Labs", contactName: "Bob Vance", role: "CTO", estimatedContractValue: "$24,000", status: "leads" }
        ]
      },
      ads: {
        audienceProfile: "Modern tech enterprises seeking rapid cloud prototyping",
        campaigns: [
          { platform: "LinkedIn", headline: `No-code automatic deployments with ${companyName}`, dailyBudget: 100, clicks: 0, conversions: 0, status: "active" }
        ]
      },
      support: {
        faqs: [
          { question: `What is ${companyName}?`, answer: `${companyName} is an automated workflow system driven by Polsia workspace nodes.` }
        ],
        tickets: []
      },
      financials: {
        mrr: 0,
        revenue: 0,
        cac: 120,
        ltv: 1500,
        margin: 85,
        monthlyHistory: [{ month: "May", revenue: 0, mrr: 0 }],
        ledger: []
      },
      logs: [
        { timestamp: new Date().toLocaleTimeString(), agent: "Planner", text: `Initialized ${companyName} config directory.`, level: "success" },
        { timestamp: new Date().toLocaleTimeString(), agent: "Developer", text: `Scaffolded starter task: "${taskTitle}"`, level: "info" }
      ]
    };

    onAddCompany(finalCompany);
    setTab("dashboard");
  };

  // AESTHETIC RETRO-FUTURISTIC SERVER SVG/CSS WIREFRAME FOR RIGHT PANEL
  const RightBackgroundDecoration = (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none p-12">
      <div className="w-full h-full max-w-lg flex flex-col justify-between items-center opacity-70">
        
        {/* Top Floating Grid Pattern */}
        <div className="w-full space-y-6">
          <div className="flex justify-between items-center text-zinc-800 font-mono text-[9px] border-b border-zinc-900 pb-2">
            <span>SYS_NODE_LOC: [EP-WEST2]</span>
            <span>CHASSIS TYPE: ATX4000</span>
          </div>

          {/* Dotted Grid Layout representing server rack units */}
          <div className="grid grid-cols-2 gap-4 w-full">
            {[1, 2, 3, 4].map((chassisNum) => (
              <div 
                key={chassisNum} 
                className="bg-zinc-950/40 border border-zinc-900 p-3 rounded-lg flex flex-col space-y-2 relative"
              >
                {/* Floating LED light */}
                <div className="absolute top-1.5 right-1.5 flex space-x-1">
                  <span className="w-1 h-1 bg-purple-500 rounded-full animate-pulse" />
                  <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                </div>
                
                <span className="text-[8px] font-mono text-zinc-650">SLOT_0{chassisNum} // STABLE</span>

                {/* Internal Dotted Grid Area */}
                <div className="grid grid-cols-6 gap-0.5 max-w-[120px]">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1 h-1 rounded-sm ${i % 3 === 0 ? "bg-purple-900/60" : "bg-zinc-900"}`} 
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Large Concentric Dotted Circle (Visual Highlight) */}
        <div className="relative w-72 h-72 flex items-center justify-center opacity-30 select-none">
          <svg className="w-full h-full text-zinc-900 animate-spin-slow" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.25" strokeDasharray="1,4" fill="none" />
            <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" fill="none" />
            <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="0.1" fill="none" />
          </svg>
          <div className="absolute font-mono text-[9px] text-zinc-700 uppercase tracking-widest text-center">
            Polsia Workspace<br />
            <span className="text-purple-900 font-semibold">Active Matrix</span>
          </div>
        </div>

        {/* Bottom Status Blocks */}
        <div className="w-full space-y-3 pt-6 border-t border-zinc-900">
          <div className="flex items-center justify-between text-[8px] font-mono text-zinc-650">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ea88] block animate-ping" />
              <span>LOGSTREAM: ENCRYPTED HTTPS</span>
            </span>
            <span>BUILD VER: v6.12A</span>
          </div>
          <div className="h-1 w-full bg-zinc-950 rounded overflow-hidden">
            <div className="h-full bg-purple-950 w-2/3 animate-pulse" />
          </div>
        </div>

      </div>
    </div>
  );

  // VIEW A: SIGN IN SCREEN & SIGN UP SCREEN
  if (step === "signin" || step === "signup") {
    const isSignIn = step === "signin";

    return (
      <div className="bg-black min-h-screen text-zinc-100 flex font-sans antialiased">
        <div className="w-full grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Form Block */}
          <div className="md:col-span-6 flex flex-col justify-between p-8 sm:p-12 md:p-16 text-left">
            
            {/* Header / Logo */}
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-purple-400 fill-current" viewBox="0 0 100 100">
                <polygon points="50,15 90,85 10,85" />
              </svg>
              <span className="text-xs font-bold text-zinc-400 font-mono tracking-widest uppercase">
                Polsia
              </span>
            </div>

            {/* Central Form Wrapper */}
            <div className="max-w-md w-full mx-auto space-y-8 py-10">
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  {isSignIn ? "Sign in to Polsia" : "Create Polsia Account"}
                </h1>
                <p className="text-xs text-zinc-400 font-sans tracking-wide leading-relaxed">
                  {isSignIn 
                    ? "Use your email and password to access this instance." 
                    : "Register to persist your cloud workspace sessions."}
                </p>
              </div>

              {authError && (
                <div role="alert" className="p-3 bg-red-950/40 border border-red-900 text-red-200 text-xs rounded-lg font-sans">
                  <span className="font-semibold">Error:</span> {authError}
                </div>
              )}

              {isSignIn ? (
                <form onSubmit={handleSignInSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#888888] font-mono block">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-600" />
                      <input 
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#0d0d0f] border border-zinc-900 rounded-lg pl-10 pr-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-750 placeholder-zinc-700 focus:ring-1 focus:ring-zinc-750 font-mono transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#888888] font-mono block">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-600" />
                      <input 
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#0d0d0f] border border-zinc-900 rounded-lg pl-10 pr-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-750 placeholder-zinc-700 focus:ring-1 focus:ring-zinc-750 font-mono transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSigningIn}
                    className="w-full bg-white hover:bg-zinc-200 text-black text-xs font-bold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isSigningIn ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying Instance Access...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignUpSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#888888] font-mono block">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-600" />
                      <input 
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#0d0d0f] border border-zinc-900 rounded-lg pl-10 pr-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-750 placeholder-zinc-700 focus:ring-1 focus:ring-zinc-750 font-mono transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#888888] font-mono block">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-600" />
                      <input 
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#0d0d0f] border border-zinc-900 rounded-lg pl-10 pr-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-750 placeholder-zinc-700 focus:ring-1 focus:ring-zinc-750 font-mono transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#888888] font-mono block">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-600" />
                      <input 
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-[#0d0d0f] border border-zinc-900 rounded-lg pl-10 pr-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-750 placeholder-zinc-700 focus:ring-1 focus:ring-zinc-750 font-mono transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSigningUp}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isSigningUp ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Provisioning Account Securely...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="text-center pt-2">
                {isSignIn ? (
                  <span className="text-[11px] text-zinc-400">
                    Need an account?{" "}
                    <button 
                      type="button"
                      onClick={() => {
                        setStep("signup");
                        setAuthError("");
                      }}
                      className="text-purple-400 font-semibold underline hover:text-purple-300 ml-1 bg-transparent border-none p-0 cursor-pointer focus:outline-none"
                    >
                      Create one
                    </button>
                  </span>
                ) : (
                  <span className="text-[11px] text-zinc-400">
                    Already have an account?{" "}
                    <button 
                      type="button"
                      onClick={() => {
                        setStep("signin");
                        setAuthError("");
                      }}
                      className="text-purple-400 font-semibold underline hover:text-purple-300 ml-1 bg-transparent border-none p-0 cursor-pointer focus:outline-none"
                    >
                      Sign In
                    </button>
                  </span>
                )}
              </div>
            </div>

            {/* Footer Sign labels */}
            <div className="text-[10px] text-zinc-650 font-mono">
              SECURE SECRETS SANDBOX // POLS_TLS_ACTIVE
            </div>

          </div>

          {/* Right Geometric Pattern Column */}
          <div className="hidden md:col-span-6 bg-[#040405] border-l border-zinc-900 overflow-hidden relative md:flex items-center justify-center">
            {RightBackgroundDecoration}
          </div>

        </div>
      </div>
    );
  }

  // WIZARD LAYOUT
  return (
    <div className="bg-black min-h-screen text-zinc-100 flex font-sans antialiased text-left justify-center">
      <div className="w-full max-w-2xl flex flex-col justify-between p-6 sm:p-10 md:p-14">
        
        {/* Center-aligned Interactive Wizard Container */}
        <div className="flex flex-col justify-between flex-grow">
          
          {/* Top Panel Actions: Header or navigation */}
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-purple-400 fill-current" viewBox="0 0 100 100">
                <polygon points="50,15 90,85 10,85" />
              </svg>
              <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Polsia Workspace Onboarding
              </span>
            </div>

            {/* Close Button / Cancel */}
            <button
              onClick={() => setTab("homepage")}
              className="text-zinc-500 hover:text-white font-mono text-xs transition-colors"
            >
              Cancel ×
            </button>
          </div>

          {/* Multi-step Header wizard steps (IMPROBABLE DESIGN INSPIRED BY THE SCREENSHOT) */}
          <div className="my-6">
            <div className="flex items-center space-x-6 sm:space-x-8 text-zinc-500 text-xs font-mono font-bold leading-none border-b border-zinc-900 pb-3">
              
              {/* Tab 1: Company */}
              <button
                onClick={() => setActiveTab("company")}
                className={`flex items-center space-x-1.5 transition-colors pb-3 border-b-2 -mb-3.5 focus:outline-none ${
                  activeTab === "company" 
                    ? "text-white border-white" 
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Company</span>
              </button>

              {/* Tab 2: Agent */}
              <button
                onClick={() => setActiveTab("agent")}
                className={`flex items-center space-x-1.5 transition-colors pb-3 border-b-2 -mb-3.5 focus:outline-none ${
                  activeTab === "agent" 
                    ? "text-white border-white" 
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Agent</span>
              </button>

              {/* Tab 3: Task */}
              <button
                onClick={() => setActiveTab("task")}
                className={`flex items-center space-x-1.5 transition-colors pb-3 border-b-2 -mb-3.5 focus:outline-none ${
                  activeTab === "task" 
                    ? "text-white border-white" 
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Task</span>
              </button>

              {/* Tab 4: Launch */}
              <button
                onClick={() => setActiveTab("launch")}
                className={`flex items-center space-x-1.5 transition-colors pb-3 border-b-2 -mb-3.5 focus:outline-none ${
                  activeTab === "launch" 
                    ? "text-white border-white" 
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>Launch</span>
              </button>
            </div>
          </div>

          {/* Active Content Body Panel */}
          <div className="flex-grow flex flex-col justify-center max-w-xl w-full mx-auto py-8">
            <AnimatePresence mode="wait">
              
              {/* STEP 2: COMPANY */}
              {activeTab === "company" && (
                <motion.div
                  key="company-step"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="space-y-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-zinc-400" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        Name your company
                      </h2>
                      <p className="text-xs text-zinc-500 leading-normal">
                        This is the organization your agents will work for and grow 24/7.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="bg-zinc-950 border border-zinc-900/60 p-4 rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Let Gemini build idea details
                        </span>
                        <p className="text-[11px] text-zinc-500">Autonomous planner scaffolds brand positions and roadmaps.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUseAIOrchestration(!useAIOrchestration)}
                        className={`w-10 h-5 rounded-full p-0.5 bg-zinc-800 transition-colors relative cursor-pointer flex items-center`}
                        style={{ backgroundColor: useAIOrchestration ? "#a855f7" : "" }}
                      >
                        <div 
                          className="w-4 h-4 bg-white rounded-full transition-all shadow-sm"
                          style={{ marginLeft: useAIOrchestration ? "1.25rem" : "0" }}
                        />
                      </button>
                    </div>

                    {useAIOrchestration ? (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-widest text-[#888888] font-mono">
                            Describe Business Idea or Let polsia pick
                          </label>
                          <textarea
                            rows={2}
                            value={businessIdea}
                            onChange={(e) => setBusinessIdea(e.target.value)}
                            placeholder="e.g. AI-powered custom roasted coffee subscription with fresh schedules"
                            className="w-full bg-[#0d0d0f] border border-zinc-900 rounded-lg px-4 py-3 text-xs text-zinc-100 focus:outline-none focus:border-zinc-750 focus:ring-1 focus:ring-zinc-750 font-sans leading-relaxed"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleAIScaffoldCompany}
                          disabled={isGeneratingCompany || !businessIdea.trim()}
                          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 border border-zinc-800 text-zinc-300 hover:text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                        >
                          {isGeneratingCompany ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                              <span>Gemini Scaffolding Pipeline...</span>
                            </>
                          ) : (
                            <>
                              <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
                              <span>Generate scaffold with Gemini</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : null}

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-[#888888] font-mono">
                          Company Name
                        </label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Acme Corp"
                          className="w-full bg-[#0d0d0f] border border-zinc-900 rounded-lg px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-750 focus:ring-1 focus:ring-zinc-750 font-mono transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-[#888888] font-mono">
                          Mission / Goal (optional)
                        </label>
                        <textarea
                          rows={2}
                          value={mission}
                          onChange={(e) => setMission(e.target.value)}
                          placeholder="What is this company trying to achieve?"
                          className="w-full bg-[#0d0d0f] border border-zinc-900 rounded-lg px-4 py-3 text-xs text-zinc-100 focus:outline-none focus:border-zinc-750 focus:ring-1 focus:ring-zinc-750 font-sans leading-relaxed transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab("agent")}
                      className="bg-zinc-100 hover:bg-zinc-200 text-black text-xs font-bold px-5 py-2.5 rounded-lg flex items-center space-x-1.5 self-end transition-colors cursor-pointer shadow-md"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: AGENTS */}
              {activeTab === "agent" && (
                <motion.div
                  key="agent-step"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="space-y-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                      <Cpu className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        Assemble your Workers
                      </h2>
                      <p className="text-xs text-zinc-500 leading-normal">
                        Select and configure the agents representing your autonomous workforce.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 max-h-[340px] overflow-y-auto pr-1 scrollbar">
                    {agents.map((ag) => (
                      <div 
                        key={ag.id} 
                        onClick={() => {
                          // Toggle active state
                          if (ag.id !== "ceo") {
                            setAgents(prev => prev.map(a => a.id === ag.id ? { ...a, enabled: !a.enabled } : a));
                          }
                        }}
                        className={`p-4 border rounded-xl flex items-start justify-between cursor-pointer transition-all ${
                          ag.enabled 
                            ? "bg-zinc-950/80 border-[#1f1f23] hover:border-zinc-700" 
                            : "bg-black/60 border-zinc-950 opacity-40 hover:opacity-60"
                        }`}
                      >
                        <div className="flex items-start space-x-3.5 text-left">
                          <input 
                            type="checkbox"
                            checked={ag.enabled}
                            disabled={ag.id === "ceo"}
                            onChange={() => {}}
                            className="mt-1 accent-purple-500 bg-black border-zinc-800 rounded focus:ring-0"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-white">{ag.name}</span>
                              <span className="text-[9px] font-mono text-[#8a8a8a] bg-zinc-905 border border-zinc-850 px-1.5 py-0.5 rounded uppercase leading-none">{ag.role}</span>
                            </div>
                            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">{ag.desc}</p>
                            
                            {/* LLM Engine customizable block slider */}
                            {ag.enabled && (
                              <div className="flex items-center space-x-2 pt-1 font-mono text-[9px] text-zinc-500">
                                <span>LLM Engine:</span>
                                <select 
                                  value={ag.engine}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setAgents(prev => prev.map(a => a.id === ag.id ? { ...a, engine: val } : a));
                                  }}
                                  className="bg-zinc-900 border border-zinc-800 text-[8px] text-zinc-300 rounded px-1.5 py-0.5 font-mono focus:outline-none"
                                >
                                  <option value="Gemini 3.5 Flash">Gemini 3.5 Flash (Default)</option>
                                  <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (Reasoning)</option>
                                  <option value="Local Sandbox Engine">Sandbox Native LLM</option>
                                </select>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-4 border-t border-zinc-900/60">
                    <button
                      type="button"
                      onClick={() => setActiveTab("company")}
                      className="px-4 py-2.5 bg-transparent border border-zinc-850 hover:bg-zinc-950 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("task")}
                      className="bg-zinc-100 hover:bg-zinc-200 text-black text-xs font-bold px-5 py-2.5 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer shadow-md"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: TASKS */}
              {activeTab === "task" && (
                <motion.div
                  key="task-step"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="space-y-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                      <ClipboardList className="w-5 h-5 text-teal-400" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        Give it something to do
                      </h2>
                      <p className="text-xs text-zinc-500 leading-normal">
                        Give your agents a starter task to activate their pipelines. Create it manually or automate it with AI.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    
                    {/* Toggle Selector for Manual / AI Generation */}
                    <div className="flex border border-zinc-900 p-0.5 rounded-lg bg-zinc-950 max-w-sm mx-auto">
                      <button
                        type="button"
                        onClick={() => setTaskMode("ai")}
                        className={`flex-1 py-1.5 text-[11px] font-bold font-mono rounded-md transition-colors ${
                          taskMode === "ai" ? "bg-zinc-850 text-white" : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        ⚡ Gemini Task Planner
                      </button>
                      <button
                        type="button"
                        onClick={() => setTaskMode("manual")}
                        className={`flex-1 py-1.5 text-[11px] font-bold font-mono rounded-md transition-colors ${
                          taskMode === "manual" ? "bg-zinc-850 text-white" : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        ✎ Manual Input
                      </button>
                    </div>

                    {taskMode === "ai" ? (
                      <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-zinc-400 font-mono tracking-wider uppercase">
                            Autonomous Task Scaffolder
                          </span>
                          {aiGeneratedSuccess && (
                            <span className="text-[10px] font-mono text-[#00ea88] flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Generated
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                          Polsia will construct an initial task title and instructions optimized specifically for {companyName}'s goals using real-time Gemini orchestration.
                        </p>
                        <button
                          type="button"
                          onClick={handleAIGenerateTasks}
                          disabled={isGeneratingTasks}
                          className="w-full bg-[#1e1a2f] hover:bg-[#251f3b] border border-purple-900/40 text-purple-200 text-xs font-semibold py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                        >
                          {isGeneratingTasks ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Structuring with Gemini...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                              <span>Plan Tasks with Gemini</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : null}

                    {/* Form Input fields showing planned task details */}
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-[#888888] font-mono">
                          Task Title
                        </label>
                        <input
                          type="text"
                          required
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                          placeholder="e.g. Hire your first engineer and create a hiring plan"
                          className="w-full bg-[#0d0d0f] border border-zinc-900 rounded-lg px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-zinc-750 focus:ring-1 focus:ring-zinc-750 font-sans"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-[#888888] font-mono">
                          Description (optional)
                        </label>
                        <textarea
                          rows={4}
                          value={taskDescription}
                          onChange={(e) => setTaskDescription(e.target.value)}
                          placeholder="What details encompass this operational checklist?"
                          className="w-full bg-[#0d0d0f] border border-zinc-900 rounded-lg px-4 py-3 text-xs text-zinc-100 focus:outline-none focus:border-zinc-750 focus:ring-1 focus:ring-zinc-750 font-mono leading-relaxed transition-colors whitespace-pre-wrap"
                        />
                      </div>
                    </div>

                  </div>

                  <div className="flex justify-between pt-4 border-t border-zinc-900/60">
                    <button
                      type="button"
                      onClick={() => setActiveTab("agent")}
                      className="px-4 py-2.5 bg-transparent border border-zinc-850 hover:bg-zinc-950 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("launch")}
                      className="bg-zinc-100 hover:bg-zinc-200 text-black text-xs font-bold px-5 py-2.5 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer shadow-md"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 5: LAUNCH */}
              {activeTab === "launch" && (
                <motion.div
                  key="launch-step"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="space-y-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                      <Rocket className="w-5 h-5 text-[#00ea88]" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        Ready to launch
                      </h2>
                      <p className="text-xs text-zinc-500 leading-normal">
                        Everything is set up. Launching now will create the starter task, wake the agents, and open the issue.
                      </p>
                    </div>
                  </div>

                  {/* Summary Checklist Container styled closely matching Screenshot 4 */}
                  <div className="border border-zinc-900 p-4 rounded-xl bg-zinc-950/60 divide-y divide-zinc-900">
                    
                    {/* Item 1: Company */}
                    <div className="flex items-center justify-between py-3.5 first:pt-0">
                      <div className="flex items-center space-x-3.5">
                        <div className="p-1 bg-zinc-900 border border-zinc-850 rounded text-zinc-400">
                          <Building2 className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-bold text-white block leading-tight">{companyName}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">Company</span>
                        </div>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>

                    {/* Item 2: Active Core Worker Agents */}
                    <div className="flex items-center justify-between py-3.5">
                      <div className="flex items-center space-x-3.5">
                        <div className="p-1 bg-zinc-900 border border-zinc-850 rounded text-purple-400">
                          <Cpu className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-bold text-white block leading-tight">
                            {agents.filter(a => a.enabled).map(a => a.name).join(", ")}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">Autonomous Agents Active</span>
                        </div>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>

                    {/* Item 3: Starter Task */}
                    <div className="flex items-center justify-between py-3.5 last:pb-0">
                      <div className="flex items-center space-x-3.5 max-w-[80%]">
                        <div className="p-1 bg-zinc-900 border border-zinc-850 rounded text-teal-400 shrink-0">
                          <ClipboardList className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-left truncate">
                          <span className="text-xs font-bold text-white block leading-tight truncate">{taskTitle}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">Initial Starter Task</span>
                        </div>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 hover:scale-110 transition-transform" />
                    </div>

                  </div>

                  <div className="flex justify-between pt-4 border-t border-zinc-900/60">
                    <button
                      type="button"
                      onClick={() => setActiveTab("task")}
                      className="px-4 py-2.5 bg-transparent border border-zinc-850 hover:bg-zinc-950 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={finalizeLaunch}
                      className="bg-white hover:bg-zinc-200 text-black text-xs font-bold px-6 py-2.5 rounded-lg flex items-center space-x-2 transition-colors cursor-pointer shadow-lg shadow-white/5 font-sans"
                    >
                      <span>Create & Open Issue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Footer branding */}
          <div className="text-[9px] text-zinc-650 font-mono border-t border-zinc-900 pt-4 flex items-center justify-between">
            <span>POLSIA // END DIRECTION ENTRUSTED</span>
            <span>PRO SECTOR CODE COMPRESSED</span>
          </div>

        </div>
      </div>
    </div>
  );
}
