import React, { useState, useEffect } from "react";
import { PolsiaCompany } from "../types";
import { 
  GitBranch, ExternalLink, Calendar, CheckCircle2, TrendingUp, Cpu, 
  MoreHorizontal, Github, StickyNote, X, Plus, ArrowUp, ArrowDown, 
  RefreshCw, GitCommit 
} from "lucide-react";

interface CardProps {
  company: PolsiaCompany;
  onClick: () => void;
  viewMode?: "grid" | "list";
}

export default function CompanyCard({ company, onClick, viewMode = "list" }: CardProps) {
  // Notes local state loaded from localStorage
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState("");

  // Deterministic count of commits
  const aheadCommits = (company.name.length % 3) + 1;
  const behindCommits = (company.name.length % 2) + 1;

  // Git status state loaded from localStorage, defaulting deterministically
  const [gitStatus, setGitStatus] = useState<"ahead" | "behind" | "synced" | "syncing">(() => {
    const saved = localStorage.getItem(`polsia_git_status_${company.id}`);
    if (saved) return saved as any;
    
    // Deterministic default
    const rem = company.name.length % 3;
    if (rem === 1) return "ahead";
    if (rem === 2) return "behind";
    return "synced";
  });

  // Load notes from localStorage on mount/id change
  useEffect(() => {
    const savedNotes = localStorage.getItem(`polsia_notes_${company.id}`);
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error("Failed to parse saved notes", e);
      }
    } else {
      setNotes([]);
    }

    const savedStatus = localStorage.getItem(`polsia_git_status_${company.id}`);
    if (savedStatus) {
      setGitStatus(savedStatus as any);
    } else {
      const rem = company.name.length % 3;
      if (rem === 1) setGitStatus("ahead");
      else if (rem === 2) setGitStatus("behind");
      else setGitStatus("synced");
    }
  }, [company.id, company.name.length]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!newNote.trim()) return;
    const updatedNotes = [...notes, newNote.trim()];
    setNotes(updatedNotes);
    localStorage.setItem(`polsia_notes_${company.id}`, JSON.stringify(updatedNotes));
    setNewNote("");
  };

  const handleDeleteNote = (indexToDelete: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedNotes = notes.filter((_, idx) => idx !== indexToDelete);
    setNotes(updatedNotes);
    localStorage.setItem(`polsia_notes_${company.id}`, JSON.stringify(updatedNotes));
  };

  const handleGitSync = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (gitStatus === "syncing") return;
    setGitStatus("syncing");
    setTimeout(() => {
      setGitStatus("synced");
      localStorage.setItem(`polsia_git_status_${company.id}`, "synced");
    }, 1200);
  };

  // Simple calculation of completed steps
  const totalRoadmapStages = company.planner.roadmap.length;
  const completedRoadmapStages = company.planner.roadmap.filter(r => r.status === "completed").length;
  const completionPercentage = Math.round((completedRoadmapStages / totalRoadmapStages) * 105);
  const constrainedPercentage = Math.min(100, completionPercentage || 40);

  // Parse neat dynamic date matching "May 19" or creation date
  const formatDate = (dateString: string) => {
    if (!dateString) return "May 19";
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch (e) {
      return "May 19";
    }
  };

  const projectDate = formatDate(company.createdAt);

  const getGitStatusDetails = () => {
    switch (gitStatus) {
      case "ahead":
        return {
          icon: <ArrowUp className="w-3 h-3 text-amber-400 shrink-0" />,
          text: `Ahead by ${aheadCommits} commits`,
          bg: "bg-amber-950/20 text-amber-400 border-amber-900/30",
          actionLabel: "Push",
          action: handleGitSync
        };
      case "behind":
        return {
          icon: <ArrowDown className="w-3 h-3 text-rose-400 shrink-0" />,
          text: `Behind by ${behindCommits} commits`,
          bg: "bg-rose-950/20 text-rose-400 border-rose-900/30",
          actionLabel: "Pull",
          action: handleGitSync
        };
      case "syncing":
        return {
          icon: <RefreshCw className="w-3 h-3 text-blue-400 animate-spin shrink-0" />,
          text: "Syncing with origin...",
          bg: "bg-blue-950/20 text-blue-400 border-blue-900/30",
          actionLabel: "working",
          action: () => {}
        };
      case "synced":
      default:
        return {
          icon: <GitCommit className="w-3 h-3 text-[#00EA88] shrink-0" />,
          text: "Synced with remote",
          bg: "bg-emerald-950/20 text-[#00EA88] border-emerald-900/30",
          actionLabel: "Refresh",
          action: handleGitSync
        };
    }
  };

  const gitDetails = getGitStatusDetails();
  
  const gitWidget = (
    <div 
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded border text-[11px] font-mono leading-none ${gitDetails.bg}`}
    >
      {gitDetails.icon}
      <span>{gitDetails.text}</span>
      {gitStatus === "syncing" && (
        <span className="ml-1 flex h-1.5 w-1.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
        </span>
      )}
      <button
        id={`git-sync-btn-${company.id}`}
        onClick={gitDetails.action}
        disabled={gitStatus === "syncing"}
        className="ml-1 text-[9px] px-1 py-0.5 bg-black/40 hover:bg-black/80 rounded border border-zinc-800 text-zinc-400 hover:text-white transition-all capitalize"
      >
        {gitStatus === "syncing" ? "..." : gitStatus === "synced" ? "Refresh" : gitDetails.actionLabel}
      </button>
    </div>
  );

  const notesWidget = (
    <div 
      onClick={(e) => e.stopPropagation()}
      className="mt-4 pt-3.5 border-t border-zinc-800/40 flex flex-col space-y-2.5 cursor-default"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono flex items-center space-x-1.5">
          <StickyNote className="w-3.5 h-3.5 text-purple-400" />
          <span>Local Annotations ({notes.length})</span>
        </span>
      </div>

      {notes.length > 0 ? (
        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto scrollbar pr-1">
          {notes.map((note, index) => (
            <div 
              key={index} 
              className="group/note flex items-center bg-zinc-950/60 hover:bg-zinc-950 border border-zinc-805/40 text-[11px] text-zinc-300 px-2.5 py-1 rounded max-w-full transition-colors"
            >
              <span className="truncate max-w-[220px] font-sans selection:bg-purple-900/40">{note}</span>
              <button 
                type="button"
                id={`note-delete-btn-${company.id}-${index}`}
                onClick={(e) => handleDeleteNote(index, e)}
                className="ml-1.5 text-zinc-550 hover:text-rose-455 transition-colors pointer-events-auto"
                title="Delete note"
              >
                <X className="w-3 h-3 hover:scale-110 active:scale-95 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <span className="text-[10px] text-zinc-600 font-mono italic">No notes added yet for project reference.</span>
      )}

      <form 
        id={`note-form-${company.id}`}
        onSubmit={handleAddNote} 
        className="flex space-x-2 mt-1"
      >
        <input 
          id={`note-input-${company.id}`}
          type="text"
          placeholder="Type annotation/reference note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 bg-zinc-950 border border-zinc-850 h-7 text-[11px] px-2.5 rounded-md font-sans text-zinc-300 focus:border-purple-900 focus:outline-none placeholder-zinc-600"
        />
        <button 
          type="submit"
          disabled={!newNote.trim()}
          onClick={(e) => e.stopPropagation()}
          className="bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 border border-zinc-800 text-zinc-400 hover:text-white h-7 w-7 flex items-center justify-center rounded-md transition-colors shrink-0"
          title="Add Annotation"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );

  if (viewMode === "list") {
    // HIGH-FIDELITY REPLICA OF THE BLUEPRINT HORIZONTAL LIST ROW
    return (
      <div 
        onClick={onClick}
        className="bg-[#0D0D0F] border border-[#1F2021] hover:border-zinc-700/80 rounded-lg p-5 flex flex-col transition-all hover:bg-[#121214] cursor-pointer group text-left relative"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          {/* Left Side: Vercel Logo Triangle and Identity */}
          <div className="flex items-center space-x-4 min-w-0 sm:w-1/3">
            {/* Visual Vercel Triangle logo */}
            <div className="w-8 h-8 rounded-md bg-zinc-900/60 border border-zinc-800/80 group-hover:border-zinc-700 flex items-center justify-center shrink-0 transition-colors">
              <svg className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white fill-current transition-colors" viewBox="0 0 100 100">
                <polygon points="51,15 91,85 11,85" />
              </svg>
            </div>
            <div className="truncate text-left leading-normal">
              <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-purple-400 transition-colors flex items-center gap-1">
                <span>{company.name.toLowerCase()}</span>
              </h3>
              <a 
                href={`https://${company.name.toLowerCase()}.vercel.app`}
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[11px] text-[#888888] hover:text-zinc-350 block mt-0.5"
              >
                {company.name.toLowerCase()}.vercel.app
              </a>
            </div>
          </div>

          {/* Center: Connect status or Branch Deploy Status */}
          <div className="flex flex-col items-start gap-1 sm:w-1/3 text-left">
            {company.developer.repoName ? (
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-white font-medium flex items-center gap-1">
                  Add files via upload
                </span>
                <div className="flex items-center space-x-2 text-[11px] text-[#888888]">
                  <Github className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="truncate max-w-[140px] font-mono">abramswalker-{company.name.toLowerCase()}</span>
                  <span className="text-[10px] text-zinc-650 font-mono">/ {company.developer.repoName}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <span className="text-xs text-[#3B82F6] hover:underline font-semibold flex items-center gap-1">
                  Connect Git Repository
                </span>
              </div>
            )}
            <div className="mt-1">
              {gitWidget}
            </div>
          </div>

          {/* Right Section: Modified Date/Time Status */}
          <div className="flex items-center justify-between sm:justify-end gap-5 sm:w-1/3">
            <span className="text-xs text-[#888888] font-mono whitespace-nowrap">
              {projectDate} {company.developer.repoName ? "on main" : ""}
            </span>

            <div className="flex items-center space-x-3.5 shrink-0">
              {/* Status indicator check tick circle */}
              <div className="w-5 h-5 rounded-full border border-zinc-850 bg-zinc-900/10 flex items-center justify-center text-[#00EA88]">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-600 group-hover:text-emerald-500 transition-colors" />
              </div>

              {/* Ellipsis deployment action details button */}
              <button 
                className="p-1 text-zinc-550 hover:text-white hover:bg-zinc-900 rounded transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Notes annotations row */}
        {notesWidget}
      </div>
    );
  }

  // DEFAULT/GRID VIEW WITH ADVANCED SAAS TELEMETRY DIALS
  return (
    <div 
      onClick={onClick}
      className="bg-[#121214] border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 hover:bg-zinc-900/30 transition-all cursor-pointer group text-left relative overflow-hidden"
    >
      {/* Top Background Radial highlight */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Company Identity */}
        <div className="flex items-center space-x-4 min-w-0 md:w-1/3">
          <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white text-sm shrink-0 uppercase group-hover:border-purple-500/50 transition-colors">
            {company.name.charAt(0)}
          </div>
          <div className="truncate text-left">
            <h3 className="font-semibold text-white tracking-tight group-hover:text-purple-400 transition-colors text-sm md:text-base">
              {company.name}
            </h3>
            <span className="text-xs text-zinc-400 truncate block mt-0.5 max-w-[240px]">
              {company.tagline}
            </span>
          </div>
        </div>

        {/* Live URL & Repo Connection */}
        <div className="flex flex-col space-y-1.5 md:w-1/4">
          <a 
            href={`https://${company.name.toLowerCase()}.polsia.app`}
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center space-x-1.5 text-xs text-zinc-300 hover:text-purple-400 transition-colors py-0.5"
          >
            <span className="truncate">{company.name.toLowerCase()}.polsia.app</span>
            <ExternalLink className="w-3 h-3 text-zinc-500 shrink-0" />
          </a>
          <div className="flex items-center space-x-2 text-zinc-500 text-[11px] font-mono">
            <GitBranch className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="truncate text-zinc-400 max-w-[150px]">{company.developer.repoName || "unconnected"}</span>
            <span className="text-[10px] text-zinc-650 bg-zinc-900 border border-zinc-800/80 px-1 py-0.5 rounded leading-none">
              main
            </span>
          </div>
          <div className="mt-1">
            {gitWidget}
          </div>
        </div>

        {/* Operational Status & Metrics */}
        <div className="flex items-center space-x-8 md:w-1/4">
          <div>
            <span className="text-[10px] font-medium text-zinc-500 block uppercase tracking-wider mb-1">
              MRR Goal Status
            </span>
            <div className="flex items-center space-x-2 leading-none">
              <TrendingUp className="w-3.5 h-3.5 text-[#00ea88] shrink-0" />
              <span className="text-xs font-bold text-white tabular-nums">${company.financials.mrr.toLocaleString()}</span>
              <span className="text-[10px] text-zinc-500">MRR</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-medium text-zinc-500 block uppercase tracking-wider mb-1">
              Active Agents
            </span>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-[#aa82fb] flex items-center space-x-1">
                <Cpu className="w-3.5 h-3.5 mr-0.5 text-purple-400 animate-pulse" />
                <span>6 Operating</span>
              </span>
            </div>
          </div>
        </div>

        {/* Pipeline Gauge Percentage */}
        <div className="flex items-center justify-between md:justify-end space-x-4 md:w-1/6">
          <div className="text-right">
            <span className="text-[10px] font-medium text-zinc-500 block uppercase tracking-wider mb-0.5">
              Setup Pipeline
            </span>
            <span className="text-xs font-bold font-mono text-zinc-100">{constrainedPercentage}% Completed</span>
          </div>
          
          <div className="relative w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center shrink-0">
            <svg className="w-8 h-8 transform -rotate-90 block">
              <circle
                cx="16"
                cy="16"
                r="13"
                className="stroke-zinc-800 fill-none"
                strokeWidth="2.5"
              />
              <circle
                cx="16"
                cy="16"
                r="13"
                className="stroke-purple-500 fill-none"
                strokeWidth="2.5"
                strokeDasharray="81.68"
                strokeDashoffset={81.68 - (81.68 * constrainedPercentage) / 100}
              />
            </svg>
            <span className="absolute text-[9px] font-bold font-mono text-white text-center">
              {completedRoadmapStages}/{totalRoadmapStages}
            </span>
          </div>
        </div>

      </div>

      {/* Notes annotations row */}
      {notesWidget}
    </div>
  );
}
