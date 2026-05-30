import React, { useState, useRef } from "react";
import { 
  Play, Cpu, Sparkles, PlusCircle, ArrowRight, CheckCircle2, 
  RefreshCw, Layout, Layers, Lightbulb, CodeXml, Terminal, 
  FileSpreadsheet, Users, Target, HelpCircle, Shield, Building2, Globe
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PolsiaCompany } from "../types";

interface LandingProps {
  onAddCompany: (company: PolsiaCompany) => void;
  setTab: (tab: "homepage" | "dashboard" | "manus" | "onboarding") => void;
}

export default function LandingPage({ onAddCompany, setTab }: LandingProps) {
  return (
    <div className="bg-[#000000] text-[#FAFAFA] antialiased overflow-hidden min-h-screen font-sans selection:bg-purple-500/30 selection:text-white">

      {/* 1. HERO & PRISM CONTAINER IN A VERCEL-GRID PREVIEW STRUCTURE */}
      <section id="hero-section" className="relative pt-12 pb-20 w-full max-w-6xl mx-auto px-4 md:px-8 border-x border-zinc-900">
        
        {/* Outer Crosshair Marks on borders */}
        <span className="absolute top-0 left-[-5px] text-[10px] text-zinc-700 font-mono pointer-events-none select-none">+</span>
        <span className="absolute top-0 right-[-5px] text-[10px] text-zinc-700 font-mono pointer-events-none select-none">+</span>
        <span className="absolute bottom-0 left-[-5px] text-[10px] text-zinc-700 font-mono pointer-events-none select-none">+</span>
        <span className="absolute bottom-0 right-[-5px] text-[10px] text-zinc-700 font-mono pointer-events-none select-none">+</span>

        {/* Dynamic Vercel grid lines inside bounds */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111113_1px,transparent_1px),linear-gradient(to_bottom,#111113_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-70 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12">
          
          {/* Headline and Brand context */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-white">
              Build and deploy <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400">
                on the AI Cloud.
              </span>
            </h1>

            <p className="text-zinc-400 text-sm sm:text-base md:text-[17px] max-w-2xl mx-auto leading-relaxed font-sans">
              Polsia provides the autonomous developer tools and cloud sandbox infrastructure to build, scale, and secure a faster, more intelligent enterprise—while you sleep.
            </p>
          </div>

          {/* Action pills (Matches Vercel exactly) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button 
              onClick={() => setTab("onboarding")}
              className="w-full sm:w-auto px-8 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-white/5 font-sans"
            >
              <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
              <span>Get Started</span>
            </button>
          </div>

          {/* RAINBOW SPOTLIGHT BACKDROP & 3D PRISM GEOMETRIC PYRAMID */}
          <div className="relative flex justify-center items-center h-[260px] md:h-[300px] w-full mt-4">
            
            {/* Rainbow flare mask */}
            <div className="absolute w-[450px] md:w-[600px] h-[220px] bg-gradient-to-r from-blue-600 via-teal-400 via-yellow-400 via-pink-600 to-purple-600 opacity-60 filter blur-[90px] rounded-full mr-2 mix-blend-screen -z-10 animate-pulse-glow" />

            <div className="relative z-10 w-64 h-64 flex items-center justify-center">
              {/* Solid 3D Triangular Pyramid Prism mimicking Vercel's central artwork */}
              <svg className="w-56 h-56 transform translate-y-3" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Under prism floor highlight and vector wires */}
                <ellipse cx="50" cy="80" rx="36" ry="7" className="fill-black/40 stroke-zinc-800/20" strokeWidth="0.5" />
                <line x1="14" y1="80" x2="50" y2="80" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                <line x1="86" y1="80" x2="50" y2="80" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                
                {/* Back reflection line */}
                <line x1="50" y1="16" x2="50" y2="80" stroke="url(#prismLineGrad)" strokeWidth="0.75" strokeDasharray="1 1" />

                {/* Left Shaded Face */}
                <polygon 
                  points="50,16 50,80 14,80" 
                  fill="url(#prismLeftFace)" 
                  stroke="rgba(255,255,255,0.4)" 
                  strokeWidth="0.5"
                />

                {/* Right Shaded Face */}
                <polygon 
                  points="50,16 86,80 50,80" 
                  fill="url(#prismRightFace)" 
                  stroke="rgba(255,255,255,0.7)" 
                  strokeWidth="0.5"
                />

                {/* Specular high-brightness highlighting point at top node */}
                <circle cx="50" cy="16" r="1.5" className="fill-white" />
                <circle cx="50" cy="16" r="5" className="fill-white/10" />

                <defs>
                  {/* Left Facet Gradient: Rich Metallic Dark */}
                  <linearGradient id="prismLeftFace" x1="50" y1="16" x2="20" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1E1E22" />
                    <stop offset="0.7" stopColor="#0B0B0C" />
                    <stop offset="1" stopColor="#020202" />
                  </linearGradient>

                  {/* Right Facet Gradient: Specular high reflecting light */}
                  <linearGradient id="prismRightFace" x1="50" y1="16" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3E3F46" />
                    <stop offset="0.3" stopColor="#1C1D21" />
                    <stop offset="0.8" stopColor="#0C0C0D" />
                    <stop offset="1" stopColor="#050505" />
                  </linearGradient>

                  {/* Verticle center ray grad */}
                  <linearGradient id="prismLineGrad" x1="50" y1="16" x2="50" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ffffff" stopOpacity="0.8" />
                    <stop offset="0.5" stopColor="#8b5cf6" stopOpacity="0.3" />
                    <stop offset="1" stopColor="#06b6d4" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
          </div>

        </div>
      </section>

      {/* 3. SUB-HERO SLIDER BAR */}
      <section id="features-section" className="relative py-12 w-full max-w-6xl mx-auto px-4 md:px-8 border-x border-t border-zinc-900 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="text-xl md:text-2xl font-bold tracking-tight text-white leading-normal font-sans">
            Develop with your favorite tools &gt;_ 
          </p>
          <p className="text-xl md:text-2xl font-bold tracking-tight text-white leading-normal font-sans">
            Launch globally, instantly <span className="inline-block hover:animate-bounce">🌐</span> Keep pushing <span className="inline-block hover:rotate-12 transition-transform">🚀</span>
          </p>
        </div>
      </section>

      {/* 4. ENTERPRISE & SECURITY ALIEN SLAT GRID */}
      <section className="relative py-12 w-full max-w-6xl mx-auto px-4 md:px-8 border-x border-t border-zinc-900 bg-zinc-950/15">
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base font-medium text-zinc-400 text-center font-sans">
          <span>Scale your</span>
          <div className="bg-zinc-900 text-white border border-zinc-800 rounded-full px-3 py-1 flex items-center gap-1.5 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Enterprise</span>
          </div>
          <span>without compromising</span>
          <div className="bg-zinc-900 text-white border border-zinc-800 rounded-full px-3 py-1 flex items-center gap-1.5 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Security</span>
          </div>
        </div>
      </section>

      {/* 5. READY TO DEPLOY SECTIONS */}
      <section id="ready-to-deploy" className="relative w-full max-w-6xl mx-auto px-4 md:px-8 border-x border-t border-zinc-900 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0">
        
        {/* Left Card: Fast Deploy CTA */}
        <div className="md:pr-12 md:border-r border-zinc-900 flex flex-col justify-between space-y-8 text-left">
          <div className="space-y-3">
            <h3 className="text-xl md:text-2xl font-bold text-white font-sans tracking-tight">
              Ready to deploy? <span className="text-zinc-500">Start building with a free account.</span>
            </h3>
            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-sans">
              Speak to an expert for your <span className="text-purple-400">Pro</span> or <span className="text-[#a855f7]">Enterprise</span> needs. Our agents configure plans, draft code, direct cold leads, and launch ad bids.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-sans">
            <button 
              onClick={() => setTab("onboarding")}
              className="px-6 py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-all cursor-pointer"
            >
              Get Started
            </button>
            <button 
              onClick={() => setTab("onboarding")}
              className="px-6 py-2 rounded-lg bg-transparent border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              Contact Sales
            </button>
          </div>
        </div>

        {/* Right Card: Enterprise CTA */}
        <div className="md:pl-12 flex flex-col justify-between space-y-8 text-left">
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-[#a855f7] uppercase font-mono">
              Enterprise Suite
            </h4>
            <h3 className="text-xl font-bold text-white tracking-tight leading-tight">
              Explore Polsia Enterprise <span className="text-zinc-500">with an interactive product tour, trial, or a personalized demo.</span>
            </h3>
          </div>

          <div>
            <button 
              onClick={() => {
                setTab("onboarding");
              }}
              className="px-6 py-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 self-start"
            >
              <span>Explore Enterprise</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
            </button>
          </div>
        </div>

      </section>

      {/* 6. MAJESTIC MULTI-COLUMN FOOTER */}
      <footer id="footer" className="relative border-x border-t border-zinc-900 bg-[#020202] w-full max-w-6xl mx-auto py-16 px-4 md:px-8 font-sans text-left">
        
        {/* Foot Grids row 1: Columns */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 pb-12 border-b border-zinc-900">
          
          <div className="space-y-4">
            <h5 className="text-[11px] font-bold text-white tracking-wider uppercase font-mono">Get Started</h5>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li><button onClick={() => setTab("onboarding")} className="hover:text-white cursor-pointer hover:underline text-left">Templates</button></li>
              <li><button onClick={() => setTab("onboarding")} className="hover:text-white cursor-pointer hover:underline text-left">Supported frameworks</button></li>
              <li><button onClick={() => setTab("onboarding")} className="hover:text-white cursor-pointer hover:underline text-left">Marketplace</button></li>
              <li><button onClick={() => setTab("onboarding")} className="hover:text-white cursor-pointer hover:underline text-left">Domains</button></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="text-[11px] font-bold text-white tracking-wider uppercase font-mono">Build</h5>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li><a href="#" className="hover:text-white hover:underline">Next.js on Vercel</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Turborepo</a></li>
              <li><a href="#" className="hover:text-white hover:underline">v0</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="text-[11px] font-bold text-white tracking-wider uppercase font-mono">Scale</h5>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li><a href="#" className="hover:text-white hover:underline">Content delivery network</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Fluid compute</a></li>
              <li><a href="#" className="hover:text-white hover:underline">CI/CD</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Observability</a></li>
              <li className="flex items-center gap-1.5">
                <a href="#" className="hover:text-white hover:underline">AI Gateway</a>
                <span className="text-[8px] bg-purple-900/40 border border-purple-800 text-purple-300 font-bold px-1 rounded">NEW</span>
              </li>
              <li className="flex items-center gap-1.5">
                <a href="#" className="hover:text-white hover:underline">Vercel Agent</a>
                <span className="text-[8px] bg-purple-900/40 border border-purple-800 text-purple-300 font-bold px-1 rounded">NEW</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="text-[11px] font-bold text-white tracking-wider uppercase font-mono">Secure</h5>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li><a href="#" className="hover:text-white hover:underline">Platform security</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Web Application Firewall</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Bot management</a></li>
              <li><a href="#" className="hover:text-white hover:underline">BotD</a></li>
              <li className="flex items-center gap-1.5">
                <a href="#" className="hover:text-white hover:underline">Sandbox</a>
                <span className="text-[8px] bg-purple-900/40 border border-purple-800 text-purple-300 font-bold px-1 rounded">NEW</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="text-[11px] font-bold text-white tracking-wider uppercase font-mono">Resources</h5>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li><a href="#" className="hover:text-white hover:underline">Pricing</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Customers</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Enterprise</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Articles</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Startups</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Solution partners</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="text-[11px] font-bold text-white tracking-wider uppercase font-mono">Learn</h5>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li><a href="#" className="hover:text-white hover:underline">Docs</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Blog</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Changelog</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Knowledge Base</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Academy</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Community</a></li>
            </ul>
          </div>

        </div>

        {/* Supplementary Links map row 2 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12 text-xs text-zinc-450 border-b border-zinc-90 w-full">
          
          <div className="space-y-3.5">
            <h6 className="text-[10px] font-bold text-zinc-500 uppercase font-mono tracking-wider">Frameworks</h6>
            <div className="flex flex-wrap gap-2 text-zinc-400">
              <span className="hover:text-white cursor-pointer">Next.js</span>
              <span className="text-zinc-800">|</span>
              <span className="hover:text-white cursor-pointer">Nuxt</span>
              <span className="text-zinc-800">|</span>
              <span className="hover:text-white cursor-pointer">Svelte</span>
              <span className="text-zinc-800">|</span>
              <span className="hover:text-white cursor-pointer">Nitro</span>
              <span className="text-zinc-800">|</span>
              <span className="hover:text-white cursor-pointer">Turbo</span>
            </div>
          </div>

          <div className="space-y-3.5">
            <h6 className="text-[10px] font-bold text-zinc-500 uppercase font-mono tracking-wider">SDKs</h6>
            <div className="flex flex-wrap gap-2 text-zinc-400 items-center">
              <span className="hover:text-white cursor-pointer">AI SDK</span>
              <span className="text-zinc-800">|</span>
              <span className="hover:text-white cursor-pointer flex items-center gap-1">
                Workflow SDK <span className="text-[8px] text-zinc-500">NEW</span>
              </span>
              <span className="text-zinc-800">|</span>
              <span className="hover:text-white cursor-pointer">Flags SDK</span>
            </div>
          </div>

          <div className="space-y-3.5">
            <h6 className="text-[10px] font-bold text-zinc-500 uppercase font-mono tracking-wider">Use Cases</h6>
            <ul className="space-y-1.5 text-zinc-400">
              <li><a href="#" className="hover:text-white">Composable commerce</a></li>
              <li><a href="#" className="hover:text-white">Marketing sites</a></li>
              <li><a href="#" className="hover:text-white">Platform engineers</a></li>
            </ul>
          </div>

          <div className="space-y-3.5">
            <h6 className="text-[10px] font-bold text-zinc-500 uppercase font-mono tracking-wider">Company</h6>
            <ul className="space-y-1.5 text-zinc-400">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Help</a></li>
              <li><a href="#" className="hover:text-white">Press</a></li>
            </ul>
          </div>

          <div className="space-y-3.5">
            <h6 className="text-[10px] font-bold text-zinc-500 uppercase font-mono tracking-wider">Community</h6>
            <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-zinc-400">
              <span className="hover:text-white cursor-pointer">GitHub</span>
              <span className="hover:text-white cursor-pointer">LinkedIn</span>
              <span className="hover:text-white cursor-pointer">X</span>
              <span className="hover:text-white cursor-pointer">YouTube</span>
            </div>
          </div>

        </div>

        {/* Absolute Bottom Status Bar Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono gap-4 w-full">
          <div className="flex items-center space-x-2 text-zinc-400">
            <span className="w-2.5 h-2.5 bg-[#00ea88] rounded-full animate-pulse-glow" />
            <span className="font-bold text-white tracking-widest">● ALL SYSTEMS OPERATIONAL.</span>
          </div>

          <div className="flex items-center space-x-2.5 text-zinc-650">
            <span>© {new Date().getFullYear()} Polsia Cloud, Inc.</span>
            <span className="text-zinc-800">|</span>
            <span className="hover:text-white cursor-pointer">Terms</span>
            <span className="hover:text-white cursor-pointer">Privacy</span>
          </div>
        </div>

      </footer>

    </div>
  );
}
