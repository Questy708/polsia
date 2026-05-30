import React, { useState } from "react";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import DashboardSidebar from "./components/DashboardSidebar";
import CompanyCard from "./components/CompanyCard";
import CompanyDetail from "./components/CompanyDetail";
import AskAIDrawer from "./components/AskAIDrawer";
import ManusAI from "./components/ManusAI";
import OnboardingFlow from "./components/OnboardingFlow";
import { initialCompanies } from "./initialData";
import { PolsiaCompany } from "./types";
import { 
  Building, Plus, Search, Grid, List, Compass, Target, 
  HelpCircle, Terminal, CodeXml, FileSpreadsheet, Activity, RefreshCw, Play,
  Bell, Info, ChevronDown, ChevronUp, Eye, ShieldAlert, Zap, Layers, AlertCircle, 
  ArrowUpRight, Globe, SlidersHorizontal, Sliders, CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [currentTab, setTab] = useState<"homepage" | "dashboard" | "manus" | "onboarding">("homepage");
  const [companies, setCompanies] = useState<PolsiaCompany[]>(initialCompanies);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(initialCompanies[0]?.id || null);
  const [searchFilter, setSearchFilter] = useState("");
  const [activeModule, setActiveModule] = useState<string>("issues");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  
  // Custom states for toast notifications
  const [appToasts, setAppToasts] = useState<{ id: string; message: string; type: "success" | "info" | "warning" }[]>([]);

  const triggerAppToast = (message: string, type: "success" | "info" | "warning" = "success") => {
    const id = Date.now().toString();
    setAppToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove toast after 4 seconds
    setTimeout(() => {
      setAppToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };
  
  // Custom states for Vercel replica dashboard features
  const [isExpandedUsage, setIsExpandedUsage] = useState(false);
  const [proTierUpgraded, setProTierUpgraded] = useState(false);
  const [showUnlockToast, setShowUnlockToast] = useState(false);
  
  // Custom quick modal to prompt automated startup generation
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickInput, setQuickInput] = useState("");
  const [isQuickBuilding, setIsQuickBuilding] = useState(false);

  // Ask AI Panel 
  const [isAskAIOpen, setIsAskAIOpen] = useState(false);

  // Retrieve current active selected company
  const activeCompany = companies.find(c => c.id === selectedCompanyId) || null;

  // Filter companies list based on search bar text
  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.businessIdea.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.tagline.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Add newly generated company to catalog
  const handleAddNewCompany = (newCompany: PolsiaCompany) => {
    setCompanies(prev => [newCompany, ...prev]);
    setSelectedCompanyId(newCompany.id);
    setActiveModule("issues");
  };

  // Update company metrics or logs in state
  const handleUpdateCompany = (updated: PolsiaCompany) => {
    setCompanies(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  // Handle Quick Add modal submission
  const handleQuickAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;

    setIsQuickBuilding(true);
    try {
      const response = await fetch("/api/operate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessIdea: quickInput })
      });
      const data = await response.json();
      if (data.company) {
        handleAddNewCompany(data.company);
        setShowQuickAdd(false);
        setQuickInput("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsQuickBuilding(false);
    }
  };

  return (
    <div className="bg-[#0A0A0A] text-zinc-100 min-h-screen flex flex-col font-sans antialiased selection:bg-purple-500/30 selection:text-white">
      
      {/* Polsia Navigation Bar (Only for Homepage Marketing Site) */}
      {currentTab === "homepage" && (
        <Header 
          currentTab={currentTab} 
          setTab={setTab} 
          selectedCompanyId={selectedCompanyId}
          setSelectedCompanyId={setSelectedCompanyId}
          onAskAI={() => setTab("manus")}
        />
      )}

      <div className="flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          
          {/* VIEW 1: HOME MARKETING HOMEPAGE */}
          {currentTab === "homepage" && (
            <motion.div
              key="homepage-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-grow flex flex-col"
            >
              <LandingPage 
                onAddCompany={handleAddNewCompany} 
                setTab={setTab}
              />
            </motion.div>
          )}

          {/* VIEW: ONBOARDING FLOW */}
          {currentTab === "onboarding" && (
            <motion.div
              key="onboarding-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-grow flex flex-col"
            >
              <OnboardingFlow 
                onAddCompany={handleAddNewCompany} 
                setTab={setTab}
              />
            </motion.div>
          )}

          {/* VIEW 2: OPERATIONS AGENT DASHBOARD */}
          {currentTab === "dashboard" && (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-grow flex flex-col lg:flex-row h-full"
            >
              {/* Sidebar Panel */}
              <DashboardSidebar 
                activeModule={activeModule}
                setActiveModule={(mod) => {
                  setActiveModule(mod);
                }}
                searchFilter={searchFilter}
                setSearchFilter={setSearchFilter}
                onAddNewClick={() => setShowQuickAdd(true)}
                selectedCompany={activeCompany}
                onClearCompany={() => {
                  setSelectedCompanyId(null);
                  setActiveModule("projects");
                }}
              />

              {/* Central Operations Workspace */}
              <div className="flex-grow flex flex-col bg-[#000000]">
                
                {activeCompany ? (
                  /* SUB-VIEW A: Detailed Company Analytics */
                  <CompanyDetail 
                    key={activeCompany.id}
                    company={activeCompany}
                    onBack={() => {
                      setSelectedCompanyId(null);
                      setActiveModule("projects");
                    }}
                    onUpdateCompany={handleUpdateCompany}
                    activeSidebarTab={activeModule}
                    setActiveSidebarTab={setActiveModule}
                    onTriggerAppToast={triggerAppToast}
                  />
                ) : (
                  /* SUB-VIEW B: List of active companies */
                  <div className="p-4 md:p-8 space-y-8 max-w-7xl w-full mx-auto text-left flex-grow">
                    
                    {/* Floating Toast Notification for Upgrades */}
                    <AnimatePresence>
                      {showUnlockToast && (
                        <motion.div
                          initial={{ opacity: 0, y: -20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.95 }}
                          className="fixed top-16 right-4 z-50 bg-[#121214] border border-purple-500/40 text-white rounded-lg p-4 shadow-2xl flex items-start space-x-3.5 max-w-sm"
                        >
                          <div className="p-1 rounded bg-purple-500/10 text-purple-400">
                            <Zap className="w-5 h-5 animate-pulse" />
                          </div>
                          <div className="text-xs">
                            <p className="font-bold text-white">Upgrade Accomplished Successfully</p>
                            <p className="text-zinc-400 mt-1 leading-normal">
                              Polsia Cloud Enterprise credentials unlocked. Quota limits and anomalies alert routing have been updated to infinite Pro capacity.
                            </p>
                          </div>
                          <button 
                            onClick={() => setShowUnlockToast(false)}
                            className="text-zinc-500 hover:text-white font-mono text-sm leading-none"
                          >
                            ×
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Dashboard Catalog Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Enterprise Overview</h2>
                        <p className="text-xs text-zinc-400 mt-1">Audit active microservices, monitor real-time accounting, and deploy autonomous developers.</p>
                      </div>
                      
                      <button
                        onClick={() => setShowQuickAdd(true)}
                        className="bg-zinc-900 hover:bg-zinc-850 hover:text-white text-zinc-300 text-xs font-semibold px-4 py-2 border border-zinc-800 rounded-lg flex items-center justify-center space-x-1.5 self-start sm:self-center transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-zinc-400" />
                        <span>Build SaaS Instance</span>
                      </button>
                    </div>

                    {/* Vercel Exact Top Replica Query & Search Action Bar */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#121214] border border-[#1F2021] p-2.5 rounded-lg w-full">
                      
                      {/* Search Projects input field */}
                      <div className="relative flex-grow w-full">
                        <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={searchFilter}
                          onChange={(e) => setSearchFilter(e.target.value)}
                          placeholder="Search Projects..."
                          className="w-full bg-[#0E0E10] border border-zinc-850 rounded-md py-1.5 pl-9 pr-8 text-xs text-white placeholder-zinc-500 outline-none focus:border-zinc-750 transition-colors"
                        />
                        {searchFilter && (
                          <button
                            onClick={() => setSearchFilter("")}
                            className="absolute right-2 top-2 text-zinc-500 hover:text-white text-xs font-mono"
                          >
                            ×
                          </button>
                        )}
                      </div>

                      {/* Controls and Dropper button links */}
                      <div className="flex items-center space-x-2.5 self-end sm:self-center shrink-0 w-full sm:w-auto justify-end">
                        
                        {/* Interactive Sliders Filter icon */}
                        <button 
                          className="p-1.5 bg-transparent border border-zinc-850 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
                          title="Filter Configurations"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                        </button>

                        {/* View alignment togglers */}
                        <div className="flex items-center space-x-1 bg-zinc-950/60 border border-zinc-850 p-0.5 rounded-md shrink-0">
                          <button 
                            onClick={() => setViewMode("list")}
                            className={`p-1 rounded transition-all cursor-pointer ${viewMode === "list" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-white"}`}
                            title="List view"
                          >
                            <List className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => setViewMode("grid")}
                            className={`p-1 rounded transition-all cursor-pointer ${viewMode === "grid" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-white"}`}
                            title="Grid view"
                          >
                            <Grid className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Vercel replica "Add New... ∨" button */}
                        <div className="relative shrink-0">
                          <button
                            onClick={() => setShowQuickAdd(true)}
                            className="bg-white hover:bg-zinc-200 text-black text-xs font-bold px-4 py-2 rounded-md flex items-center justify-center space-x-1.5 transition-all text-left cursor-pointer shadow-md"
                          >
                            <span>Add New...</span>
                            <ChevronDown className="w-3 h-3 text-zinc-650" />
                          </button>
                        </div>

                      </div>

                    </div>

                    {/* GRID SPLIT LAYOUT: 4 (Left card blocks) vs 8 (Right projects catalog) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* LEFT COLUMN: Usage, Alerts, Recent Previews */}
                      <div className="lg:col-span-4 space-y-7">
                        
                        {/* 1. USAGE SECTION */}
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase font-mono block">Usage</span>
                          <div className="bg-[#121214] border border-[#1F2021] rounded-lg overflow-hidden flex flex-col shadow-lg transition-all hover:border-zinc-800">
                            
                            {/* Card Header block */}
                            <div className="p-4 border-b border-zinc-850 flex justify-between items-center bg-[#161619]/40">
                              <span className="text-xs font-bold text-white">Last 30 days</span>
                              <button 
                                onClick={() => {
                                  setProTierUpgraded(true);
                                  setShowUnlockToast(true);
                                }}
                                className={`text-[10px] font-bold tracking-wide px-2.5 py-1 rounded transition-all uppercase ${
                                  proTierUpgraded 
                                    ? "bg-purple-900/30 border border-purple-800 text-purple-305" 
                                    : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:text-white cursor-pointer"
                                }`}
                              >
                                {proTierUpgraded ? "Pro Upgraded" : "Upgrade"}
                              </button>
                            </div>

                            {/* Card content list: Quota progress indicators */}
                            <div className="p-4 space-y-4 text-xs font-sans text-left">
                              
                              {/* Edge Requests */}
                              <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-zinc-400">
                                  <span className="flex items-center gap-1.5 hover:text-zinc-200 cursor-help" title="Edge Request Volume">
                                    Edge Requests <Info className="w-3 h-3 text-zinc-650" />
                                  </span>
                                  <span className="font-mono text-zinc-300">
                                    {companies.length * 8} / <span className="text-zinc-550 font-semibold">{proTierUpgraded ? "∞" : "1M"}</span>
                                  </span>
                                </div>
                                <div className="h-1 bg-[#1A1A1E] rounded-full overflow-hidden relative">
                                  <div 
                                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                                    style={{ width: proTierUpgraded ? "0.2%" : `${Math.max(1.2, (companies.length * 8) / 10000)}%` }}
                                  />
                                </div>
                              </div>

                              {/* Fast Data Transfer */}
                              <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-zinc-400">
                                  <span className="flex items-center gap-1.5 hover:text-zinc-200 cursor-help" title="Asset deployment size transfer bandwidth">
                                    Fast Data Transfer <Info className="w-3 h-3 text-zinc-650" />
                                  </span>
                                  <span className="font-mono text-zinc-300">
                                    17.4 MB / <span className="text-zinc-550 font-semibold">{proTierUpgraded ? "∞" : "100 GB"}</span>
                                  </span>
                                </div>
                                <div className="h-1 bg-[#1A1A1E] rounded-full overflow-hidden relative">
                                  <div 
                                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                                    style={{ width: proTierUpgraded ? "0.1%" : "0.5%" }}
                                  />
                                </div>
                              </div>

                              {/* Fast Origin Transfer */}
                              <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-zinc-400">
                                  <span className="flex items-center gap-1.5 hover:text-zinc-200 cursor-help" title="Hosting content transfers">
                                    Fast Origin Transfer <Info className="w-3 h-3 text-zinc-650" />
                                  </span>
                                  <span className="font-mono text-zinc-350">
                                    0 / <span className="text-zinc-550 font-semibold">{proTierUpgraded ? "∞" : "10 GB"}</span>
                                  </span>
                                </div>
                                <div className="h-1 bg-[#1A1A1E] rounded-full overflow-hidden relative">
                                  <div className="h-full bg-purple-500 rounded-full w-0" />
                                </div>
                              </div>

                              {/* Edge Request CPU Duration */}
                              <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-zinc-400">
                                  <span className="flex items-center gap-1.5 hover:text-zinc-200 cursor-help" title="SaaS runtime execution quota time duration">
                                    Edge Request CPU Duration <Info className="w-3 h-3 text-zinc-650" />
                                  </span>
                                  <span className="font-mono text-zinc-350">
                                    0 / <span className="text-zinc-550 font-semibold">{proTierUpgraded ? "∞" : "1h"}</span>
                                  </span>
                                </div>
                                <div className="h-1 bg-[#1A1A1E] rounded-full overflow-hidden relative">
                                  <div className="h-full bg-purple-500 rounded-full w-0" />
                                </div>
                              </div>

                              {/* Collapsible section of extra details */}
                              <AnimatePresence>
                                {isExpandedUsage && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="pt-2 space-y-4 border-t border-zinc-850/60 overflow-hidden"
                                  >
                                    <div className="space-y-1.5">
                                      <div className="flex justify-between items-center text-zinc-400">
                                        <span className="flex items-center gap-1.5">Serverless Functions <Info className="w-3 h-3 text-zinc-650" /></span>
                                        <span className="font-mono">0 GB-hrs / {proTierUpgraded ? "∞" : "100 GB-hrs"}</span>
                                      </div>
                                      <div className="h-1 bg-[#1A1A1E] rounded-full" />
                                    </div>

                                    <div className="space-y-1.5">
                                      <div className="flex justify-between items-center text-zinc-400">
                                        <span className="flex items-center gap-1.5">Active Sandbox Databases <Info className="w-3 h-3 text-zinc-650" /></span>
                                        <span className="font-mono">{companies.length} / {proTierUpgraded ? "∞" : "5"}</span>
                                      </div>
                                      <div className="h-1 bg-[#1A1A1E] rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-purple-500 rounded-full" 
                                          style={{ width: `${(companies.length / 5) * 100}%` }}
                                        />
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                            </div>

                            {/* Center Down Arrow / Chevron at the bottom of the card block */}
                            <button
                              onClick={() => setIsExpandedUsage(!isExpandedUsage)}
                              className="w-full border-t border-zinc-850 hover:bg-zinc-900/40 py-2 flex items-center justify-center text-zinc-500 hover:text-white transition-all text-[11px] font-mono gap-1 cursor-pointer"
                            >
                              <span>{isExpandedUsage ? "Collapse Details" : "View More Details"}</span>
                              {isExpandedUsage ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>

                          </div>
                        </div>

                        {/* 2. ALERTS SECTION */}
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase font-mono block">Alerts</span>
                          <div className="bg-[#121214] border border-[#1F2021] rounded-lg p-5 flex flex-col items-center justify-center text-center space-y-4 shadow-lg hover:border-zinc-800 transition-all">
                            
                            <div className="w-12 h-12 rounded-full border border-zinc-800 bg-[#0E0E10] flex items-center justify-center text-zinc-400 relative">
                              <Bell className="w-5 h-5 text-zinc-450 animate-pulse" />
                              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-purple-500 rounded-full animate-ping" />
                            </div>

                            <div className="space-y-1.5 max-w-sm">
                              <h4 className="text-xs font-bold text-white tracking-tight">Get alerted for anomalies</h4>
                              <p className="text-[11px] text-zinc-400 leading-normal">
                                Automatically monitor your cloud deployment instances for anomalies and receive SMS / Email telemetry notifications.
                              </p>
                            </div>

                            <button
                              onClick={() => {
                                setProTierUpgraded(true);
                                setShowUnlockToast(true);
                              }}
                              className={`w-full text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer ${
                                proTierUpgraded
                                  ? "bg-purple-950/40 text-purple-300 border border-purple-800/40 pointer-events-none"
                                  : "bg-[#0E0E10] border border-zinc-800 hover:border-zinc-700 text-white hover:bg-zinc-900"
                              }`}
                            >
                              {proTierUpgraded ? "✓ Alerts Active on Pro" : "Upgrade to Pro"}
                            </button>

                          </div>
                        </div>

                        {/* 3. RECENT PREVIEWS SECTION */}
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase font-mono block">Recent Previews</span>
                          <div className="bg-[#121214] border border-[#1F2021] rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-3.5 shadow-lg min-h-[140px] hover:border-zinc-800 transition-all">
                            
                            <div className="w-9 h-9 rounded-lg border border-zinc-850 bg-[#0E0E10] flex items-center justify-center">
                              {/* Simple visual screen design inside */}
                              <svg className="w-4 h-4 text-zinc-600 fill-current" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="10" />
                                <circle cx="50" cy="50" r="10" />
                              </svg>
                            </div>

                            <p className="text-[11px] text-[#888888] leading-normal max-w-xs font-sans">
                              Preview deployments that you have recently visited or created will appear here.
                            </p>

                          </div>
                        </div>

                      </div>

                      {/* RIGHT COLUMN: Active SaaS list from directory */}
                      <div className="lg:col-span-8 space-y-3">
                        
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-bold tracking-wider text-zinc-500 uppercase font-mono block">Projects</span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {filteredCompanies.length} operated item{filteredCompanies.length !== 1 ? 's' : ''} shown
                          </span>
                        </div>

                        {/* Catalog Grid / List rendering depending on selection in toggle */}
                        <AnimatePresence mode="popLayout">
                          {filteredCompanies.length > 0 ? (
                            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-3.5"}>
                              {filteredCompanies.map((comp) => (
                                <motion.div
                                  key={comp.id}
                                  layout
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <CompanyCard 
                                    company={comp} 
                                    onClick={() => {
                                      setSelectedCompanyId(comp.id);
                                      setActiveModule("overview");
                                    }}
                                    viewMode={viewMode}
                                  />
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="py-16 text-center border border-dashed border-zinc-800 rounded-xl bg-black"
                            >
                              <Building className="w-8 h-8 text-zinc-700 mx-auto mb-3 opacity-40 animate-pulse" />
                              <p className="text-xs font-semibold text-white">No active SaaS enterprises found</p>
                              <p className="text-[11px] text-zinc-500 mt-1 max-w-xs mx-auto leading-relaxed">
                                Feel free to search again with another term, or accelerate an automated startup business to launch the smart planner agent.
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </div>

                    </div>

                  </div>
                )}

              </div>
            </motion.div>
          )}

          {/* VIEW 3: MANUS AI OPERATOR WORKSPACE */}
          {currentTab === "manus" && (
            <motion.div
              key="manus-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-grow flex flex-col h-full"
            >
              <ManusAI 
                onAddCompany={handleAddNewCompany}
                setTab={setTab}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* QUICK ADD MODAL BOX */}
      <AnimatePresence>
        {showQuickAdd && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#121214] border border-zinc-800 rounded-xl p-6 max-w-lg w-full text-left space-y-4 shadow-2xl relative"
            >
              <div>
                <h3 className="text-base font-bold text-white">Accelerate Autonomous Business</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-normal">
                  Polsia will orchestrate the planning, front-end scaffolding, marketing list, and financial forecasts for your business.
                </p>
              </div>

              <form onSubmit={handleQuickAddSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">Business Idea</label>
                  <input
                    type="text"
                    value={quickInput}
                    onChange={(e) => setQuickInput(e.target.value)}
                    placeholder="e.g. SF speciality coffee bean delivery sub"
                    disabled={isQuickBuilding}
                    className="w-full bg-[#0D0D0F] border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-purple-500/50"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowQuickAdd(false);
                      setQuickInput("");
                    }}
                    disabled={isQuickBuilding}
                    className="px-3.5 py-1.5 bg-transparent hover:bg-zinc-900 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isQuickBuilding || !quickInput.trim()}
                    className="bg-white hover:bg-zinc-200 text-black text-xs font-bold px-4 py-1.5 rounded-lg flex items-center space-x-1.5 disabled:opacity-40"
                  >
                    {isQuickBuilding ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>SaaS building...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-black" />
                        <span>Operate Startup</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AskAIDrawer isOpen={isAskAIOpen} onClose={() => setIsAskAIOpen(false)} />

      {/* Toast Notification Container in bottom right */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {appToasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="pointer-events-auto w-full bg-[#121214] border border-zinc-800 rounded-lg p-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-start space-x-3"
            >
              <div className={`p-1.5 rounded-md shrink-0 ${
                toast.type === "success" 
                  ? "bg-emerald-500/10 text-emerald-400" 
                  : toast.type === "warning"
                  ? "bg-amber-500/10 text-amber-400"
                  : "bg-blue-500/10 text-blue-400"
              }`}>
                {toast.type === "success" && <CheckCircle2 className="w-4 h-4" />}
                {toast.type === "warning" && <AlertCircle className="w-4 h-4" />}
                {toast.type === "info" && <Info className="w-4 h-4" />}
              </div>
              <div className="flex-grow text-xs text-left">
                <p className="font-semibold text-white">Team Event Alert</p>
                <p className="text-zinc-400 mt-1 leading-relaxed">{toast.message}</p>
              </div>
              <button 
                onClick={() => setAppToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-zinc-600 hover:text-zinc-400 font-mono text-sm leading-none shrink-0"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
