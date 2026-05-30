import React from "react";
import {
  Search,
  Edit,
  LayoutDashboard,
  Inbox,
  CheckCircle,
  Repeat,
  Target,
  Folder,
  Bot,
  Users,
  Wrench,
  DollarSign,
  Activity,
  Settings,
  Book,
  ChevronDown,
  Sun,
  Hexagon
} from "lucide-react";

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  searchFilter: string;
  setSearchFilter: (filter: string) => void;
  onAddNewClick: () => void;
  selectedCompany: any | null;
  onClearCompany: () => void;
}

export default function DashboardSidebar({
  activeModule,
  setActiveModule,
  onClearCompany,
  selectedCompany
}: SidebarProps) {
  
  return (
    <div className="w-64 flex-shrink-0 bg-[#0A0A0A] border-r border-zinc-900 text-zinc-400 h-screen flex flex-col justify-between select-none">
      
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {/* Top Company Header component */}
        <div 
          className="flex items-center justify-between mb-6 px-2 text-zinc-100 cursor-pointer"
          onClick={onClearCompany}
        >
          <span className="font-semibold text-sm">Tech Co</span>
          <Search className="w-4 h-4 text-zinc-500 hover:text-zinc-300" />
        </div>

        {/* New Issue Button */}
        <button className="w-full flex items-center space-x-2 px-2 py-1.5 mb-6 text-sm text-zinc-300 hover:text-white transition-colors">
          <Edit className="w-4 h-4" />
          <span>New Issue</span>
        </button>

        {/* Main top links */}
        <div className="space-y-1 mb-8">
          <button 
            onClick={() => setActiveModule("dashboard")}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors ${activeModule === "dashboard" ? "bg-zinc-900 text-zinc-100" : "text-zinc-400 hover:text-zinc-300"}`}
          >
            <div className="flex items-center space-x-2">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[10px] text-blue-500">4 live</span>
            </div>
          </button>
          
          <button 
            onClick={() => setActiveModule("inbox")}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors ${activeModule === "inbox" ? "bg-zinc-900 text-zinc-100" : "text-zinc-400 hover:text-zinc-300"}`}
          >
            <div className="flex items-center space-x-2">
              <Inbox className="w-4 h-4" />
              <span>Inbox</span>
            </div>
            <span className="h-5 w-5 bg-white text-black text-[10px] font-bold rounded-full flex items-center justify-center">2</span>
          </button>
        </div>

        {/* WORK Section */}
        <div className="mb-8">
          <div className="px-2 mb-2 text-[10px] uppercase font-bold tracking-wider text-zinc-500">WORK</div>
          <div className="space-y-1">
            <button 
              onClick={() => setActiveModule("issues")}
              className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-sm transition-colors ${activeModule === "issues" ? "bg-zinc-900 text-zinc-100" : "text-zinc-400 hover:text-zinc-300"}`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Issues</span>
            </button>
            <button 
              onClick={() => setActiveModule("routines")}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors ${activeModule === "routines" ? "bg-zinc-900 text-zinc-100" : "text-zinc-400 hover:text-zinc-300"}`}
            >
              <div className="flex items-center space-x-2">
                <Repeat className="w-4 h-4" />
                <span>Routines</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-orange-900/30 text-orange-400 font-medium">Beta</span>
            </button>
            <button 
              onClick={() => setActiveModule("goals")}
              className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-sm transition-colors ${activeModule === "goals" ? "bg-zinc-900 text-zinc-100" : "text-zinc-400 hover:text-zinc-300"}`}
            >
              <Target className="w-4 h-4" />
              <span>Goals</span>
            </button>
          </div>
        </div>

        {/* PROJECTS Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between px-2 mb-2 group">
            <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">PROJECTS</div>
            <span className="text-zinc-500 cursor-pointer hover:text-zinc-300">+</span>
          </div>
          <div className="space-y-1">
            <button 
              onClick={() => setActiveModule("onboarding_project")}
              className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-sm transition-colors ${activeModule === "onboarding_project" ? "bg-zinc-900 text-zinc-100" : "text-zinc-400 hover:text-zinc-300"}`}
            >
              <span className="w-3 h-3 rounded-full bg-blue-600 border-2 border-[#121212]" />
              <span>Onboarding</span>
            </button>
          </div>
        </div>

        {/* AGENTS Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between px-2 mb-2 group">
            <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">AGENTS</div>
            <span className="text-zinc-[650] text-[9.5px] font-mono">
              {(() => {
                if (!selectedCompany) return "0 / 7";
                const stored = localStorage.getItem(`company_agents_${selectedCompany.id}`);
                const list = stored ? JSON.parse(stored) : [];
                const liveCount = list.filter((a: any) => a.status === 'live').length;
                return `${liveCount} / 7`;
              })()}
            </span>
          </div>
          <div className="space-y-1">
            {(() => {
              if (!selectedCompany) return null;
              const stored = localStorage.getItem(`company_agents_${selectedCompany.id}`);
              const list = stored ? JSON.parse(stored) : [
                { id: "agent_ceo", name: "CEO", initials: "CE", status: "live" },
                { id: "agent_cto", name: "CTO", initials: "CT", status: "unprovisioned" },
                { id: "agent_finance", name: "VP of Finance", initials: "FI", status: "unprovisioned" },
                { id: "agent_cmo", name: "CMO", initials: "CM", status: "unprovisioned" },
                { id: "agent_support", name: "Customer Support", initials: "CS", status: "unprovisioned" },
                { id: "agent_sales", name: "VP of Sales", initials: "VS", status: "unprovisioned" },
                { id: "agent_social", name: "Social Media Manager", initials: "SM", status: "unprovisioned" }
              ];

              return list.map((agent: any) => {
                const isActive = activeModule === agent.id;
                const isLive = agent.status === "live";
                const isProvisioning = agent.status === "provisioning";

                return (
                  <button 
                    key={agent.id}
                    onClick={() => setActiveModule(agent.id)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors text-left ${
                      isActive 
                        ? "bg-zinc-900 text-zinc-100 font-medium" 
                        : "text-zinc-400 hover:text-zinc-300"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Bot className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-[#2DD4BF]" : "text-zinc-500"
                      }`} />
                      <span className="truncate max-w-[130px]">{agent.name}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isLive 
                          ? "bg-[#2DD4BF] shadow-[0_0_6px_rgba(45,212,191,0.8)]" 
                          : isProvisioning
                          ? "bg-amber-500 animate-pulse"
                          : "bg-zinc-800"
                      }`} />
                      <span className="text-[10px] text-zinc-550 lowercase font-mono">
                        {isLive ? "live" : isProvisioning ? "prov" : "off"}
                      </span>
                    </div>
                  </button>
                );
              });
            })()}
          </div>
        </div>

        {/* COMPANY Section */}
        <div className="mb-8">
          <div className="px-2 mb-2 text-[10px] uppercase font-bold tracking-wider text-zinc-500">COMPANY</div>
          <div className="space-y-1">
            <button className="w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
              <Users className="w-4 h-4" />
              <span>Org</span>
            </button>
            <button className="w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
              <Hexagon className="w-4 h-4" />
              <span>Skills</span>
            </button>
            <button className="w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
              <DollarSign className="w-4 h-4" />
              <span>Costs</span>
            </button>
            <button className="w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
              <Activity className="w-4 h-4" />
              <span>Activity</span>
            </button>
            <button className="w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>

      </div>

      {/* Footer Settings / Docs */}
      <div className="p-4 border-t border-zinc-900 flex items-center justify-between text-zinc-500">
        <button className="flex items-center space-x-2 hover:text-white transition-colors">
          <Book className="w-4 h-4" />
          <span className="text-xs">Documentation</span>
          <ChevronDown className="w-3 h-3" />
        </button>
        <div className="flex items-center space-x-3">
          <Settings className="w-4 h-4 hover:text-white cursor-pointer" />
          <Sun className="w-4 h-4 hover:text-white cursor-pointer" />
        </div>
      </div>

    </div>
  );
}
