import React, { useState } from "react";
import { Terminal, Shield, Cpu, Layout, Layers, User, ChevronDown, Sparkles, SunMoon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface HeaderProps {
  currentTab: "homepage" | "dashboard" | "manus" | "onboarding";
  setTab: (tab: "homepage" | "dashboard" | "manus" | "onboarding") => void;
  selectedCompanyId: string | null;
  setSelectedCompanyId: (id: string | null) => void;
  onAskAI?: () => void;
}

export default function Header({ currentTab, setTab, selectedCompanyId, setSelectedCompanyId, onAskAI }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-zinc-900 bg-black text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          
          {/* Left Block: Sleek Triangle Logo & Brand Name */}
          <div className="flex items-center space-x-6">
            <div 
              onClick={() => {
                setTab("homepage");
                setSelectedCompanyId(null);
              }}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              {/* Premium geometric Vercel solid triangle logo branded for Polsia */}
              <svg className="w-4 h-4 text-white fill-current transition-transform group-hover:scale-105" viewBox="0 0 100 100">
                <polygon points="50,15 90,85 10,85" />
              </svg>
              <span className="font-bold tracking-tight text-[14px] text-white font-sans">
                Polsia
              </span>
            </div>

            {/* Middle Section: Center Navigation items (Exact layout from screenshot) */}
            <div className="hidden lg:flex items-center space-x-5 text-zinc-400 text-[13px] font-sans">
              <button 
                onClick={() => {
                  setTab("homepage");
                  setSelectedCompanyId(null);
                  document.getElementById("hero-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                Products <ChevronDown className="w-3 h-3 text-zinc-600" />
              </button>
              <button 
                onClick={() => {
                  setTab("homepage");
                  setSelectedCompanyId(null);
                  document.getElementById("ready-to-deploy")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                Resources <ChevronDown className="w-3 h-3 text-zinc-600" />
              </button>
              <button 
                onClick={() => {
                  setTab("homepage");
                  setSelectedCompanyId(null);
                  document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                Solutions <ChevronDown className="w-3 h-3 text-zinc-600" />
              </button>
              <button 
                onClick={() => {
                  setTab("homepage");
                  setSelectedCompanyId(null);
                  document.getElementById("ready-to-deploy")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Enterprise
              </button>
              <button 
                onClick={() => {
                  setTab("homepage");
                  setSelectedCompanyId(null);
                  document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Pricing
              </button>
            </div>
          </div>

          {/* Right Block: Ask AI Pill, Active Dashboard Pill, & Multi-gradient Circle Avatar */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-1.5 flex items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
              title={`Switch to ${theme === 'black' ? 'slate' : 'black'} theme`}
            >
              <SunMoon className="w-4 h-4" />
            </button>
            {/* Outlined "Ask AI" button */}
            <button 
              onClick={() => {
                setTab("manus");
                if (onAskAI) onAskAI();
              }}
              className={`border rounded-full px-3.5 py-1 text-xs transition-all tracking-tight cursor-pointer ${
                currentTab === "manus"
                  ? "bg-purple-900/30 border-purple-500/50 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.15)] font-bold"
                  : "border-zinc-800 hover:border-zinc-700 bg-transparent text-zinc-300 hover:text-white"
              }`}
            >
              Ask AI
            </button>

            {/* Solid Active "Get Started" button from the screenshot */}
            <button
              onClick={() => {
                setTab("dashboard");
                if (!selectedCompanyId) {
                  setSelectedCompanyId("prj_dPl4wtp8DUwPLaFwKZmX4bLbjd0Q");
                }
              }}
              className="border border-zinc-800 hover:border-zinc-700 bg-[#0F0F11] rounded-full px-4 py-1 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              Dashboard
            </button>

            {/* Solid Active "Get Started" button from the screenshot */}
            <button
              onClick={() => setTab("onboarding")}
              className={`rounded-full px-4 py-1 flex items-center justify-center space-x-1 text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                currentTab === "onboarding"
                  ? "bg-white text-black hover:bg-zinc-200"
                  : "bg-white text-black hover:bg-zinc-200"
              }`}
            >
              <span>Get Started</span>
            </button>

            {/* Premium, multicolored Grid layout vector circular avatar imitating Vercel profile */}
            <div className="w-[22px] h-[22px] rounded-full overflow-hidden border border-zinc-800 relative cursor-pointer flex-shrink-0">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Visual striping and multi-gradient exact pattern */}
                <rect width="100" height="100" fill="url(#avatarGradient)" />
                <line x1="15" y1="0" x2="15" y2="100" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="4" />
                <line x1="45" y1="0" x2="45" y2="100" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="4" />
                <line x1="75" y1="0" x2="75" y2="100" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="4" />
                <defs>
                  <linearGradient id="avatarGradient" x1="0" y1="0" x2="100" y2="100">
                    <stop stopColor="#3b82f6" />
                    <stop offset="0.5" stopColor="#a855f7" />
                    <stop offset="1" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
