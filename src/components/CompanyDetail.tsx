import React, { useState, useEffect, useRef } from "react";
import { PolsiaCompany, LogEvent, SupportTicketExchange, BusinessRoadmapItem, FAQItem, TargetLead, AdCampaign } from "../types";
import { 
  DollarSign, TrendingUp, Users, Target, Shield, HelpCircle, 
  Terminal, CodeXml, FileSpreadsheet, Globe, CheckCircle, 
  Hourglass, AlertCircle, ArrowLeft, RefreshCw, Send, PlayCircle, 
  Eye, CheckCircle2, ExternalLink, Github, History, MoveUpRight, 
  ChevronDown, ChevronUp, ChevronRight, MoreHorizontal, HelpCircle as HelpIcon,
  Plus, Search, Info, SlidersHorizontal, ArrowUpRight, Ban, Cpu, Zap, Sparkles, Sliders, ToggleLeft, Activity, Server, KeyRound, Workflow, Trash2, CheckCircle as CheckIcon, Bot, User,
  FileText, Check, Lock, Settings
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface Agent {
  id: string;
  name: string;
  subName: string;
  initials: string;
  role: string;
  status: 'live' | 'provisioning' | 'unprovisioned';
  activityLabel: string;
  healthIndicator: 'healthy' | 'warning' | 'critical' | 'inactive';
  executedCommands: number;
  lastCommand: string;
  agentLogs: string[];
  instructions?: string;
  skills?: string[];
  llmAdapter?: string;
  budget?: number;
  monthlySpend?: number;
  temperature?: number;
  memorySize?: number;
}

interface DetailProps {
  key?: any;
  company: PolsiaCompany;
  onBack: () => void;
  onUpdateCompany: (updated: PolsiaCompany) => void;
  activeSidebarTab?: string;
  setActiveSidebarTab?: (tab: string) => void;
  onTriggerAppToast?: (message: string, type?: "success" | "info" | "warning") => void;
}

export default function CompanyDetail({ 
  company, 
  onBack, 
  onUpdateCompany, 
  activeSidebarTab = "overview", 
  setActiveSidebarTab,
  onTriggerAppToast
}: DetailProps) {

  // Map incoming sidebar tabs to active detail representation
  let activeTab = activeSidebarTab || "overview";

  const getAgentHeartbeatChecks = (agentId: string) => {
    const timeNow = new Date().toLocaleTimeString();
    const timePrev1 = new Date(Date.now() - 60000).toLocaleTimeString();
    const timePrev2 = new Date(Date.now() - 120000).toLocaleTimeString();
    const timePrev3 = new Date(Date.now() - 180000).toLocaleTimeString();

    const checkData: Record<string, Array<{ timestamp: string; component: string; detail: string; status: "SUCCESS" | "WARNING" }>> = {
      agent_ceo: [
        { timestamp: timeNow, component: "CEO_ORCHESTRATOR_RUN", detail: "Checked CMO balance, CTO repo hashes, CFO allocations", status: "SUCCESS" },
        { timestamp: timePrev1, component: "SOUL_ALIGNMENT_CHECK", detail: "Validated company objectives alignment against SOUL.md system standards", status: "SUCCESS" },
        { timestamp: timePrev2, component: "HEARTBEAT_CRON_PULSE", detail: "Ping of sub-agents: CTO, CMO, Finance returned 200 OK", status: "SUCCESS" },
        { timestamp: timePrev3, component: "BUDGET_THRESHOLD_MONITOR", detail: "Current monthly spend $1,205 checked against max $5,000 rules constraint", status: "SUCCESS" }
      ],
      agent_cto: [
        { timestamp: timeNow, component: "PORT_3000_INGRESS", detail: "Checked reverse proxy stream handler on Port 3000 -> HTTP 200", status: "SUCCESS" },
        { timestamp: timePrev1, component: "SANDBOX_INTEGRITY_CHECK", detail: "Verified SQLite / Postgres DB schema integrity and sandbox read/writes", status: "SUCCESS" },
        { timestamp: timePrev2, component: "LINT_COMPILER_TRACE", detail: "Validated TypeScript type safety controls on app compiler", status: "SUCCESS" },
        { timestamp: timePrev3, component: "CONTINUOUS_DEPLOY_DAEMON", detail: "Active HMR state idle. Production bundles optimized correctly", status: "SUCCESS" }
      ],
      agent_finance: [
        { timestamp: timeNow, component: "STRIPE_API_CHECKS", detail: "Checked Stripe billing webhook registration signature", status: "SUCCESS" },
        { timestamp: timePrev1, component: "RUNWAY_LEDGER_SYNC", detail: "Synced auto-ledger items containing positive cash MRR ticks with storage", status: "SUCCESS" },
        { timestamp: timePrev2, component: "BUDGET_FAILSAFE_SCANNER", detail: "Verified billing limits. Current CPU and instance costs under threshold limits", status: "SUCCESS" }
      ],
      agent_cmo: [
        { timestamp: timeNow, component: "GOOGLE_ADS_TELEMETRY", detail: "Checked active campaign conversion metrics and clicks indexes", status: "SUCCESS" },
        { timestamp: timePrev1, component: "SEO_META_VALIDATOR", detail: "Parsed main index index.html routing tags for crawlers, all green", status: "SUCCESS" },
        { timestamp: timePrev2, component: "HEARTBEAT_CAMPAIGN_SCAN", detail: "Evaluated target budget allocations in marketing engine", status: "SUCCESS" }
      ],
      agent_support: [
        { timestamp: timeNow, component: "VECTOR_INTEGRITY_INDEX", detail: "Assessed knowledge-base vector store indexes for document embeddings", status: "SUCCESS" },
        { timestamp: timePrev1, component: "CUSTOMER_TICKET_STALL_DAEMON", detail: "Scan complete. No tickets older than 5 mins in queue", status: "SUCCESS" },
        { timestamp: timePrev2, component: "SENTIMENT_ALGO_CHECK", detail: "Loaded sentiment score parser micro-weights", status: "SUCCESS" }
      ],
      agent_sales: [
        { timestamp: timeNow, component: "HUBSPOT_WEBHOOK_PING", detail: "Piped target conversion state to local state store registers", status: "SUCCESS" },
        { timestamp: timePrev1, component: "SEQUENCE_DELAY_AUDIT", detail: "Calibrated custom thread delay rules for cold emails", status: "SUCCESS" },
        { timestamp: timePrev2, component: "SALES_CRON_TRIGGER", detail: "Scan complete. Telemetry active. 0 unassigned CRM leads", status: "SUCCESS" }
      ],
      agent_social: [
        { timestamp: timeNow, component: "TWITTER_API_WEBHOOK", detail: "Fetched calendar schedule threads. Auth tokens verified", status: "SUCCESS" },
        { timestamp: timePrev1, component: "GIT_LOG_HEARTBEAT", detail: "Analyzed git commit diff patches. Custom changelog generated", status: "SUCCESS" },
        { timestamp: timePrev2, component: "SOCIAL_CRON_MONITOR", detail: "Evaluated scheduler thread execution memory usage -> 4.8MB footprint", status: "SUCCESS" }
      ]
    };

    return checkData[agentId] || [
      { timestamp: timeNow, component: "RUNTIME_DAEMON_CHECK", detail: "System alive, runbook operational", status: "SUCCESS" },
      { timestamp: timePrev1, component: "HEARTBEAT_PULSE_MONITOR", detail: "Uptime and socket checked", status: "SUCCESS" }
    ];
  };

  // Dynamic autonomous agents states
  const [agents, setAgents] = useState<Agent[]>(() => {
    const AGENT_DEFAULTS: Record<string, Partial<Agent>> = {
      agent_ceo: {
        instructions: "# SYSTEM RUNBOOK: CEO / VISION CONTROLLER\n- Act as the vision controller and direct orchestrator.\n- Delegating submodules is your core strategy; use 'paperclip-create-agent' commands if direct reports are missing.\n- Check tasks roadmap items daily.\n- Maintain target budget threshold: max $5,000/month.",
        skills: ["Roadmap Builder", "Strategic Planner", "Board Coordinator", "PR Dispatcher"],
        llmAdapter: "models/gemini-2.5-pro",
        budget: 5000,
        monthlySpend: 1205,
        temperature: 0.70,
        memorySize: 8192
      },
      agent_cto: {
        instructions: "# SYSTEM RUNBOOK: CTO (SHIPPING CODE)\n- Autonomously design database schemas and write production typescript models inside sandbox.\n- Prioritize continuous integration, error checks, and telemetry updates.\n- Prevent server port conflicts; always listen on PORT 3000.",
        skills: ["TypeScript Transpiler", "GitHub PR Pusher", "PostgreSQL Architect", "Telemetry Ingress Analyzer"],
        llmAdapter: "models/gemini-2.5-pro",
        budget: 8000,
        monthlySpend: 3200,
        temperature: 0.20,
        memorySize: 16384
      },
      agent_finance: {
        instructions: "# SYSTEM RUNBOOK: VP FINANCE\n- Maintain balance sheets, invoices, and run calculations over monthly server budgets.\n- Alert team on cost-overrun dangers (if server billing > $1,200).\n- Review payment gateways like Stripe API triggers.",
        skills: ["Ledger Synthesizer", "Stripe Fee Audit", "Excel Sheets Sync", "Runway Projection Calculator"],
        llmAdapter: "models/gemini-2.5-flash",
        budget: 2000,
        monthlySpend: 150,
        temperature: 0.00,
        memorySize: 4096
      },
      agent_cmo: {
        instructions: "# SYSTEM RUNBOOK: CMO (MARKETING & TRAFFIC)\n- Manage outbound Google and LinkedIn campaign coordinates.\n- Target CTR > 2.8% and keep Cost-Per-Acquisition below $18.00.\n- Refresh meta tag keywords and run monthly audits.",
        skills: ["Ad Campaign Builder", "CTR Target Audit", "SEO Meta Optimizers", "Content Copywriter Helper"],
        llmAdapter: "models/gemini-2.5-flash",
        budget: 4000,
        monthlySpend: 1560,
        temperature: 0.85,
        memorySize: 8192
      },
      agent_support: {
        instructions: "# SYSTEM RUNBOOK: CUSTOMER SUPPORT\n- Directly ingest customer tickets. Match against company knowledge vectors.\n- Never guess instructions or API credentials.\n- Escalation rules: pass to human supervisor if sentiment is extreme warning.",
        skills: ["Vector Search Retriever", "FAQ Auto-responder", "Escalation Dispatcher", "Sentiment Decryption Controller"],
        llmAdapter: "models/gemini-2.5-flash",
        budget: 1500,
        monthlySpend: 430,
        temperature: 0.10,
        memorySize: 8192
      },
      agent_sales: {
        instructions: "# SYSTEM RUNBOOK: VP SALES\n- Review target lead sequence. Automate custom sequence follow-ups.\n- Convert trial accounts to premium contracts.\n- Coordinate with Support Agent on integration onboarding feedback.",
        skills: ["Sequence Automation Dispatcher", "HubSpot Lead Synchronizer", "Contract Draft Builder", "Outbound Email Dispatch"],
        llmAdapter: "models/gemini-2.5-pro",
        budget: 3000,
        monthlySpend: 850,
        temperature: 0.50,
        memorySize: 16384
      },
      agent_social: {
        instructions: "# SYSTEM RUNBOOK: SOCIAL MEDIA ENGAGEMENT\n- Formulate high-quality feature announcements based on CTO git logs.\n- Schedule post triggers directly to X (Twitter) and LinkedIn APIs.\n- Optimize tags and coordinate hashtags dynamically.",
        skills: ["Git Changelog Parser", "Thread Layout Generator", "Dynamic Calendar Scheduler", "Engagement Analyzer Graph"],
        llmAdapter: "models/gemini-2.5-flash",
        budget: 1000,
        monthlySpend: 290,
        temperature: 0.90,
        memorySize: 4096
      }
    };

    const storedStr = localStorage.getItem(`company_agents_${company.id}`);
    if (storedStr) {
      const parsed: Agent[] = JSON.parse(storedStr);
      // Migrate / fill missing defaults
      return parsed.map(a => ({
        ...a,
        instructions: a.instructions || AGENT_DEFAULTS[a.id]?.instructions || "",
        skills: a.skills || AGENT_DEFAULTS[a.id]?.skills || [],
        llmAdapter: a.llmAdapter || AGENT_DEFAULTS[a.id]?.llmAdapter || "models/gemini-2.5-flash",
        budget: a.budget !== undefined ? a.budget : (AGENT_DEFAULTS[a.id]?.budget || 1000),
        monthlySpend: a.monthlySpend !== undefined ? a.monthlySpend : (AGENT_DEFAULTS[a.id]?.monthlySpend || 0),
        temperature: a.temperature !== undefined ? a.temperature : (AGENT_DEFAULTS[a.id]?.temperature || 0.70),
        memorySize: a.memorySize !== undefined ? a.memorySize : (AGENT_DEFAULTS[a.id]?.memorySize || 4096)
      }));
    }

    return [
      {
        id: "agent_ceo",
        name: "CEO",
        subName: "CEO / Planner",
        initials: "CE",
        role: "Plan your roadmap, delegating tasks and reviewing PRs.",
        status: "live",
        activityLabel: "Live - Idle",
        healthIndicator: "healthy",
        executedCommands: 3,
        lastCommand: "paperclip-create-agent cto",
        agentLogs: [
          "[CEO Agent] • INIT • model: gemini-3.5-flash",
          "[CEO Agent] Loaded runbooks: HEARTBEAT.md, SOUL.md, TOOLS.md.",
          "[CEO Agent] Analyzing company goals... Active roadmap generated.",
          "[CEO Agent] Executing command: paperclip-create-agent --role cto",
          "[CEO Agent] Success! CTO direct report created and awaiting provisioning."
        ],
        ...AGENT_DEFAULTS.agent_ceo
      },
      {
        id: "agent_cto",
        name: "CTO",
        subName: "CTO (Shipping Code)",
        initials: "CT",
        role: "Writes high-quality code, configures databases, and deploys containers.",
        status: "unprovisioned",
        activityLabel: "Awaiting Provisioning",
        healthIndicator: "inactive",
        executedCommands: 0,
        lastCommand: "",
        agentLogs: [],
        ...AGENT_DEFAULTS.agent_cto
      },
      {
        id: "agent_finance",
        name: "VP of Finance",
        subName: "VP of Finance",
        initials: "FI",
        role: "Trims costs, compiles ledgers, and handles investor questions.",
        status: "unprovisioned",
        activityLabel: "Awaiting Provisioning",
        healthIndicator: "inactive",
        executedCommands: 0,
        lastCommand: "",
        agentLogs: [],
        ...AGENT_DEFAULTS.agent_finance
      },
      {
        id: "agent_cmo",
        name: "CMO",
        subName: "CMO (Running Ads)",
        initials: "CM",
        role: "Sets up LinkedIn & Google ad campaigns, tracking CPA and CTR.",
        status: "unprovisioned",
        activityLabel: "Awaiting Provisioning",
        healthIndicator: "inactive",
        executedCommands: 0,
        lastCommand: "",
        agentLogs: [],
        ...AGENT_DEFAULTS.agent_cmo
      },
      {
        id: "agent_support",
        name: "Customer Support",
        subName: "Customer Support",
        initials: "CS",
        role: "Automatically resolves user tickets using knowledge vectors.",
        status: "unprovisioned",
        activityLabel: "Awaiting Provisioning",
        healthIndicator: "inactive",
        executedCommands: 0,
        lastCommand: "",
        agentLogs: [],
        ...AGENT_DEFAULTS.agent_support
      },
      {
        id: "agent_sales",
        name: "VP of Sales",
        subName: "VP of Sales",
        initials: "VS",
        role: "Enters contact sequences to convert inbound leads to enterprise contracts.",
        status: "unprovisioned",
        activityLabel: "Awaiting Provisioning",
        healthIndicator: "inactive",
        executedCommands: 0,
        lastCommand: "",
        agentLogs: [],
        ...AGENT_DEFAULTS.agent_sales
      },
      {
        id: "agent_social",
        name: "Social Media Manager",
        subName: "Social Media Manager",
        initials: "SM",
        role: "Optimizes engagement, writes feature announcements, and schedules posts.",
        status: "unprovisioned",
        activityLabel: "Awaiting Provisioning",
        healthIndicator: "inactive",
        executedCommands: 0,
        lastCommand: "",
        agentLogs: [],
        ...AGENT_DEFAULTS.agent_social
      }
    ];
  });

  // Track dynamic saving and propagate changes to render sibling sidebar updates in real-time
  useEffect(() => {
    localStorage.setItem(`company_agents_${company.id}`, JSON.stringify(agents));
    onUpdateCompany({ ...company });
  }, [agents, company.id]);

  // Modal and custom states for simulator interactions
  const [activeAgentSubTab, setActiveAgentSubTab] = useState<"dashboard" | "instructions" | "skills" | "config" | "runs" | "budget">("instructions");
  
  // High fidelity Instructions files states
  const [selectedInstructionsFile, setSelectedInstructionsFile] = useState<string>("AGENTS.md");
  const [instructionsFiles, setInstructionsFiles] = useState<Record<string, { content: string; tag?: string; size: string }>>({
    "AGENTS.md": {
      tag: "ENTRY",
      size: "1.2KB",
      content: `You are the CEO. Your job is to lead the company, not to do individual contributor work. You own strategy, prioritization, and cross-departmental coordination.

Your home directory is $AGENT_HOME. Everything personal to you -- life, memory, knowledge -- lives there. Other agents may have their own folders and you may adopt them when necessary.

Company-wide artifacts (plans, shared docs) live in the project root, outside your personal directory.

Delegation (critical)
You MUST delegate work rather than doing it yourself. When a task is assigned to you:
1. Triage it -- read the task, understand what's being asked, and determine which department owns it.
2. Delegate it -- create a subtask with parentId set to the current task, assign it to the right direct report, and include context about what needs to happen. Use these routing rules:`
    },
    "HEARTBEAT.md": {
      size: "3005B",
      content: `# Heartbeat Directives
Interval: 120s

On every heartbeat run, you must check the status of all subordinate agents: CTO, CMO, FINANCE.
1. Fetch recent action runs and telemetry statuses.
2. Check for stalled tickets or unresolved blocker system logs.
3. Balance budget burn constraints and throttle models if threshold exceeded.`
    },
    "SOUL.md": {
      size: "2590B",
      content: `# Agent Soul Profile
Model: gpt-5.3-codex
Core Archetype: Coordinator / Delegator
Tone: Professional, direct, analytical, focused on outcomes.
Values: Speed of execution, efficiency, resource allocation, and budget optimization.`
    },
    "TOOLS.md": {
      size: "86B",
      content: `# Registered Internal Code Tools
- Paperclip core daemon: /bin/paperclip
- Codex adapter agent generator: /bin/paperclip-create-agent
- Para Memory Vector Index: /bin/para-memory-files`
    }
  });

  // State to sync the text box with the selected instruction file
  const [fileEditingContent, setFileEditingContent] = useState<string>("");

  useEffect(() => {
    if (instructionsFiles[selectedInstructionsFile]) {
      setFileEditingContent(instructionsFiles[selectedInstructionsFile].content);
    }
  }, [selectedInstructionsFile, instructionsFiles]);

  // High fidelity Configuration States
  const [configBypassSandbox, setConfigBypassSandbox] = useState(true);
  const [configEnableSearch, setConfigEnableSearch] = useState(false);
  const [configReportsTo, setConfigReportsTo] = useState("Choose manager...");
  const [configCapabilities, setConfigCapabilities] = useState("");
  const [configTitle, setConfigTitle] = useState("");

  // Runs List high fidelity selected item
  const [selectedRunId, setSelectedRunId] = useState<string>("8a6ac81e");

  // Budget configuration state
  const [budgetUsdVal, setBudgetUsdVal] = useState("0.00");
  const [budgetIsSet, setBudgetIsSet] = useState(false);

  const updateAgentField = (agentId: string, field: keyof Agent, value: any) => {
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        return { ...a, [field]: value };
      }
      return a;
    }));
  };

  const [editingInstructions, setEditingInstructions] = useState("");
  const [newSkillInput, setNewSkillInput] = useState("");

  // Sync editing instructions when active tab shifts
  useEffect(() => {
    if (activeTab.startsWith("agent_")) {
      const cur = agents.find(a => a.id === activeTab);
      if (cur) {
        setEditingInstructions(cur.instructions || "");
        if (cur.name) {
          // pre-populate name-specific things
          setConfigTitle(cur.role || "");
          setConfigCapabilities(`Describe what this ${cur.name} agent can do autonomously inside the company environment.`);
        }
      }
    }
  }, [activeTab]);

  const [activeProvisioningAgent, setActiveProvisioningAgent] = useState<Agent | null>(null);
  const [isProvisioningInModal, setIsProvisioningInModal] = useState(false);
  const [provisioningStep, setProvisioningStep] = useState(0);

  const [showAssignModal, setShowAssignModal] = useState<Agent | null>(null);
  const [selectedTaskToAssign, setSelectedTaskToAssign] = useState<string>("");
  const [customTaskInput, setCustomTaskInput] = useState<string>("");

  const handleStartProvisioning = (agent: Agent) => {
    // Transition to 'provisioning'
    setAgents(prevAgents => prevAgents.map(a => {
      if (a.id === agent.id) {
        const timestamp = new Date().toLocaleTimeString();
        return {
          ...a,
          status: "provisioning",
          activityLabel: "Provisioning...",
          healthIndicator: "warning",
          agentLogs: [
            `[${timestamp}] ⚡ INITIALIZING AUTOMATED PROVISIONING HUB`,
            `[${timestamp}] Downloading agent model weights & runbooks...`,
            `[${timestamp}] Binding sandbox namespaces...`
          ]
        };
      }
      return a;
    }));

    onTriggerAppToast?.(`Initiated automated setup for ${agent.name} Agent.`, "info");
    setActiveProvisioningAgent(agent);
    setIsProvisioningInModal(true);
    setProvisioningStep(0);

    const stepsTimer = setInterval(() => {
      setProvisioningStep(prev => {
        if (prev >= 3) {
          clearInterval(stepsTimer);
          return 4;
        }
        return prev + 1;
      });
    }, 800);

    setTimeout(() => {
      setAgents(prevAgents => prevAgents.map(a => {
        if (a.id === agent.id) {
          const timestamp = new Date().toLocaleTimeString();
          return {
            ...a,
            status: "live",
            activityLabel: "Live - Idle",
            healthIndicator: "healthy",
            agentLogs: [
              ...a.agentLogs,
              `[${timestamp}] Spawning clean sandbox Docker node G-600 on port 3000...`,
              `[${timestamp}] Handshook with main branch parameters.`,
              `[${timestamp}] Setup credentials for Gemini-3.5-flash LLM model.`,
              `[${timestamp}] ✅ AGENT NODE ONLINE AND READY.`
            ]
          };
        }
        return a;
      }));
      onTriggerAppToast?.(`${agent.name} Agent successfully provisioned and live!`, "success");
      setIsProvisioningInModal(false);
      setActiveProvisioningAgent(null);
    }, 3500);
  };

  const [activeTaskRunningAgent, setActiveTaskRunningAgent] = useState<string | null>(null);
  const [activeHeartbeatRunningAgent, setActiveHeartbeatRunningAgent] = useState<string | null>(null);

  const handleAssignTask = async (taskTitle: string) => {
    if (!taskTitle || !showAssignModal) return;
    const targetAgentId = showAssignModal.id;
    const targetAgentName = showAssignModal.name;

    // Set agent state log
    setAgents(prevAgents => prevAgents.map(a => {
      if (a.id === targetAgentId) {
        const timestamp = new Date().toLocaleTimeString();
        return {
          ...a,
          activityLabel: `Executing Task...`,
          executedCommands: a.executedCommands + 1,
          lastCommand: `run-task "${taskTitle.substring(0, 15)}..."`,
          agentLogs: [
            ...a.agentLogs,
            `[${timestamp}] 🚀 RECEIVED BOARD DIRECTIVE: ${taskTitle}`,
            `[${timestamp}] Spawning sandboxed environment and checking workspace schema...`,
            `[${timestamp}] Initializing task constraints using Gemini-3.5-flash...`
          ]
        };
      }
      return a;
    }));

    onTriggerAppToast?.(`Assigned task "${taskTitle}" to ${targetAgentName} Agent.`, "info");
    setShowAssignModal(null);
    setActiveTaskRunningAgent(targetAgentId);

    try {
      const runbooksInfo = Object.entries(instructionsFiles)
        .map(([name, data]: [string, any]) => `=== FILE: ${name} ===\n${data.content}`)
        .join("\n\n");

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `
[AUTONOMOUS TASK DELEGATOR ORCHESTRATOR]
You are Polsia's autonomous ${targetAgentName} Agent core. The company is called "${company.name}" (Tagline: "${company.tagline}"), business idea: "${company.businessIdea}".

Active Runbooks Configured:
${runbooksInfo}

The board has delegated a custom task directive to you:
Task: "${taskTitle}"

Since we are a real autonomous system co-founder, execute this task and respond in a valid JSON envelope representation. Make it rich, contextual, and realistic. 
If the user's task expects database schemas, write postgres SQL code. If it expects beautiful landing styles/components, write real JSX code. If it expects mail sequences, write professional templates. Ensure you generate real metrics, logs, or values based strictly on the business idea.

Provide response ONLY in this clean JSON structure (do not add extra conversational intro/outro text):
{
  "logs": [
    "Log trace step 1 (e.g. '[CTO] Initialized local Git repository')",
    "Log trace step 2 (e.g. '[CTO] Prepared postgres migration index')"
  ],
  "activityLabel": "Active - deployed optimized schema",
  "developerCode": "If you are CTO and the task asks to prepare, build, or deploy React code, supply the complete gorgeous JSX landing page layout code here (styled using Tailwind CSS classes directly), otherwise set false",
  "developerSchema": "If you are CTO and they ask for postgres schemas or SQL databases, return the SQL CREATE TABLE schemas, otherwise set false",
  "emailSubject": "If writing cold email outreach, set subject here, otherwise set false",
  "emailBody": "If writing outreach templates, set the full body email mockup with {{companyName}} and {{contactName}} here, otherwise set false",
  "additionalLeads": [
    { "companyName": "Alpha Solutions", "contactName": "Michael Scott", "role": "Regional Director", "estimatedContractValue": "$1,900/mo", "status": "leads" }
  ], // optionally provide 1-2 leads here for outreach/sales tasks, otherwise empty array
  "adsCampaigns": [
    { "platform": "Google", "headline": "Creative ad headline here", "dailyBudget": 35, "clicks": 210, "conversions": 15, "status": "active" }
  ], // optionally provide 1 campaign for CMO, otherwise empty array
  "financialsMRRUptick": 0, // optionally provide positive numeric values for finished tasks
  "summary": "Triumph summary of what you autonomously achieved and deployed"
}
`
        })
      });

      const data = await response.json();
      let parsed: any = {};
      try {
        let text = data.response || "{}";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          text = jsonMatch[0];
        }
        parsed = JSON.parse(text);
      } catch (err) {
        // Safe robust parser backup
        parsed = {
          logs: [
            `Analysed task rules in instructions configuration.`,
            `Applied active code patches to Edge sandbox cluster.`
          ],
          activityLabel: "Live - Idle",
          summary: `Successfully completed: "${taskTitle}" within sandbox Port 3000.`
        };
        if (targetAgentId === "agent_cto") {
          parsed.developerCode = `// Autobuilt Component for: ${taskTitle}\nexport default function Sandbox() {\n  return (\n    <div className="p-8 bg-zinc-950 text-white rounded-xl border border-zinc-805">\n      <h3 className="font-bold text-lg">${company.name} Autopilot Dashboard</h3>\n      <p className="text-zinc-400 text-sm mt-2">Dynamic state compilation online.</p>\n    </div>\n  );\n}`;
        }
      }

      const timestamp = new Date().toLocaleTimeString();
      const newLogs = parsed.logs || [];

      // Update Agent Logs directly in local client list
      setAgents(prevAgents => prevAgents.map(a => {
        if (a.id === targetAgentId) {
          return {
            ...a,
            activityLabel: parsed.activityLabel || "Live - Idle",
            agentLogs: [
              ...a.agentLogs,
              ...newLogs.map((l: string) => `[${timestamp}] ${l}`),
              `[${timestamp}] ✅ DIRECTIVE MET: ${parsed.summary || "Completed task successfully."}`
            ]
          };
        }
        return a;
      }));

      // Update Company core values based on LLM output
      const updatedCompany = { ...company };

      if (parsed.developerCode && parsed.developerCode !== "false" && parsed.developerCode !== "") {
        if (!updatedCompany.developer) updatedCompany.developer = {} as any;
        updatedCompany.developer.code = parsed.developerCode;
      }
      if (parsed.developerSchema && parsed.developerSchema !== "false" && parsed.developerSchema !== "") {
        if (!updatedCompany.developer) updatedCompany.developer = {} as any;
        updatedCompany.developer.schema = parsed.developerSchema;
      }
      if (parsed.emailSubject && parsed.emailSubject !== "false" && parsed.emailSubject !== "") {
        if (!updatedCompany.outreach) updatedCompany.outreach = {} as any;
        updatedCompany.outreach.emailSubject = parsed.emailSubject;
      }
      if (parsed.emailBody && parsed.emailBody !== "false" && parsed.emailBody !== "") {
        if (!updatedCompany.outreach) updatedCompany.outreach = {} as any;
        updatedCompany.outreach.emailBody = parsed.emailBody;
      }
      if (parsed.additionalLeads && parsed.additionalLeads.length > 0) {
        if (!updatedCompany.outreach) updatedCompany.outreach = {} as any;
        updatedCompany.outreach.leads = [...parsed.additionalLeads, ...(updatedCompany.outreach.leads || [])];
      }
      if (parsed.adsCampaigns && parsed.adsCampaigns.length > 0) {
        if (!updatedCompany.ads) updatedCompany.ads = {} as any;
        updatedCompany.ads.campaigns = [...parsed.adsCampaigns, ...(updatedCompany.ads.campaigns || [])];
      }

      // Add financial ledger items
      if (parsed.financialsMRRUptick && typeof parsed.financialsMRRUptick === "number" && parsed.financialsMRRUptick > 0) {
        const valueInc = parsed.financialsMRRUptick;
        if (!updatedCompany.financials) updatedCompany.financials = {} as any;
        updatedCompany.financials.mrr += valueInc;
        updatedCompany.financials.revenue += valueInc * 1.5;
        updatedCompany.financials.ledger = [
          {
            date: "Just Now",
            description: `Auto-earnings: completed task ${taskTitle}`,
            type: "income",
            amount: valueInc
          },
          ...(updatedCompany.financials.ledger || [])
        ];
      }

      // Sync and scroll telemetries
      const addedTelemetryLogs = [
        ...consoleLogs,
        ...newLogs.map((l: string) => ({
          timestamp,
          agent: targetAgentName as any,
          text: l,
          level: "success" as const
        })),
        {
          timestamp,
          agent: targetAgentName as any,
          text: `✅ AUTONOMOUS OPERATE: Completed directive "${taskTitle}" cleanly. Persistent state saved.`,
          level: "success" as const
        }
      ];
      setConsoleLogs(addedTelemetryLogs);
      updatedCompany.logs = addedTelemetryLogs;

      onUpdateCompany(updatedCompany);
      onTriggerAppToast?.(parsed.summary || `Task finished by ${targetAgentName}!`, "success");

    } catch (error) {
      console.error("Agent task assign fetch failed:", error);
      // fallback
      const timestamp = new Date().toLocaleTimeString();
      setAgents(prevAgents => prevAgents.map(a => {
        if (a.id === targetAgentId) {
          return {
            ...a,
            activityLabel: "Live - Idle",
            agentLogs: [
              ...a.agentLogs,
              `[${timestamp}] ⚙️ RETRY: Synced local offline container caches.`,
              `[${timestamp}] ✅ SUCCESS: Executed offline simulation for task "${taskTitle}".`
            ]
          };
        }
        return a;
      }));
    } finally {
      setActiveTaskRunningAgent(null);
    }
  };

  const handleRunHeartbeat = async (agent: Agent) => {
    if (activeHeartbeatRunningAgent) return;
    const targetId = agent.id;
    const targetName = agent.name;

    setActiveHeartbeatRunningAgent(targetId);
    onTriggerAppToast?.(`Running heartbeat trace on ${targetName} sandbox...`, "info");

    setAgents(prevAgents => prevAgents.map(a => {
      if (a.id === targetId) {
        const timestamp = new Date().toLocaleTimeString();
        return {
          ...a,
          activityLabel: "Running Heartbeat Checks",
          agentLogs: [
            ...a.agentLogs,
            `[${timestamp}] ⚙️ HEARTBEAT INITIATED: Evaluating active runbook directives...`
          ]
        };
      }
      return a;
    }));

    try {
      const heartbeatDirectives = instructionsFiles["HEARTBEAT.md"]?.content || "";
      const soulProfile = instructionsFiles["SOUL.md"]?.content || "";

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `
[AUTONOMOUS SYSTEM HEARTBEAT GENERATOR]
Run a live heartbeat operations check for ${targetName} Agent inside company "${company.name}" (Business: "${company.businessIdea}").
They have these runbook instruction files:
=== HEARTBEAT DIRECTIVES ===
${heartbeatDirectives}

=== SOUL PROFILE ===
${soulProfile}

Analyze the configured directives and execute a true simulated heartbeat operations check.
Provide the response ONLY in this strict JSON shape:
{
  "logs": [
    "Log trace entry 1 (e.g. '[CTO] Analyzed active container instances on port 3000 to prevent stalled sockets')",
    "Log trace entry 2 (e.g. '[CTO] Compiled local file caches and ensured zero blocker memory threads')"
  ],
  "activityLabel": "Active - heartbeat Met",
  "revenueDelta": 120, // simulated cash inflow or budget outflow in this check cycle, if applicable (set 0 if no revenue change)
  "outcomeText": "Short status results (e.g. Verified health check 200 OK on Port 3000)"
}
`
        })
      });

      const data = await response.json();
      let parsed: any = {};
      try {
        let text = data.response || "{}";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          text = jsonMatch[0];
        }
        parsed = JSON.parse(text);
      } catch (err) {
        parsed = {
          logs: [
            `Scanned sandbox processes against HEARTBEAT.md directives, all green.`,
            `Checked telemetry servers. Port 3000 running at optimal 100% uptime.`
          ],
          activityLabel: "Live - Idle",
          revenueDelta: 0,
          outcomeText: "Heartbeat completed and logged successfully."
        };
      }

      const timestamp = new Date().toLocaleTimeString();
      const newLogs = parsed.logs || [];

      // Update agent checks
      setAgents(prevAgents => prevAgents.map(a => {
        if (a.id === targetId) {
          return {
            ...a,
            activityLabel: parsed.activityLabel || "Live - Idle",
            agentLogs: [
              ...a.agentLogs,
              ...newLogs.map((l: string) => `[${timestamp}] ${l}`),
              `[${timestamp}] ✅ HEARTBEAT TRACE OK: ${parsed.outcomeText || "Finished checks."}`
            ]
          };
        }
        return a;
      }));

      // Update financials
      const updatedCompanyData = { ...company };
      if (parsed.revenueDelta && parsed.revenueDelta > 0) {
        const delta = parsed.revenueDelta;
        if (!updatedCompanyData.financials) updatedCompanyData.financials = {} as any;
        updatedCompanyData.financials.revenue += delta;
        updatedCompanyData.financials.ledger = [
          {
            date: "Just Now",
            description: `Auto-earnings: heartbeat lead intake premium`,
            type: "income",
            amount: delta
          },
          ...(updatedCompanyData.financials.ledger || [])
        ];
      }

      // Add to main terminal
      const addedLogs = [
        ...consoleLogs,
        ...newLogs.map((l: string) => ({
          timestamp,
          agent: targetName as any,
          text: l,
          level: "info" as const
        })),
        {
          timestamp,
          agent: targetName as any,
          text: `❤️ HEARTBEAT DIRECTIVES COMPLETE: Clean operational pass for ${targetName}`,
          level: "success" as const
        }
      ];
      setConsoleLogs(addedLogs);
      updatedCompanyData.logs = addedLogs;

      onUpdateCompany(updatedCompanyData);
      onTriggerAppToast?.(parsed.outcomeText || "Heartbeat checked successfully!", "success");

    } catch (e) {
      const timestamp = new Date().toLocaleTimeString();
      setAgents(prevAgents => prevAgents.map(a => {
        if (a.id === targetId) {
          return {
            ...a,
            activityLabel: "Live - Idle",
            agentLogs: [
              ...a.agentLogs,
              `[${timestamp}] [HEARTBEAT] Loaded HEARTBEAT.md directives...`,
              `[${timestamp}] ✅ HEARTBEAT COMPLETE: Local checks synced successfully.`
            ]
          };
        }
        return a;
      }));
    } finally {
      setActiveHeartbeatRunningAgent(null);
    }
  };

  // Real-time terminal streaming state (simulated live backend events)
  const [consoleLogs, setConsoleLogs] = useState<LogEvent[]>(company.logs || []);
  const [isSimulating, setIsSimulating] = useState(true);

  // Custom support chat state
  const [supportInput, setSupportInput] = useState("");
  const [supportTickets, setSupportTickets] = useState<SupportTicketExchange[]>(company.support.tickets || []);
  const [isSupportThinking, setIsSupportThinking] = useState(false);

  // Custom settings / environment variables editing state
  const [envVars, setEnvVars] = useState([
    { key: "GEMINI_API_KEY", value: "AIzaSyD6..." },
    { key: "PORT", value: "3000" },
    { key: "DATABASE_URL", value: "postgresql://polsia_dev:********@ep-cool-glade-525982.us-east-2.aws.neon.tech/polsia" },
    { key: "NODE_ENV", value: "production" }
  ]);
  const [newEnvKey, setNewEnvKey] = useState("");
  const [newEnvVal, setNewEnvVal] = useState("");

  // Domain state
  const [domainsList, setDomainsList] = useState([
    { name: `${company.name.toLowerCase()}.vercel.app`, status: "Valid Configuration", type: "System" },
    { name: `www.${company.name.toLowerCase()}.com`, status: "Pending Nameserver Update", type: "Custom" }
  ]);
  const [newDomainInput, setNewDomainInput] = useState("");

  // Feature Flags list state (interactive click)
  const [featureFlags, setFeatureFlags] = useState([
    { key: "ENABLE_AI_RECOMMENDATIONS", enabled: true, desc: "Activates LLM auto-bidding routines inside outreach vectors" },
    { key: "BETA_PRICING_FLOW", enabled: false, desc: "Drives 20% discount trial modules across direct marketing checkout URLs" },
    { key: "STRICT_SSL_CACHING", enabled: true, desc: "Forces strict edge decryption parameter handshakes" }
  ]);

  // Production checklist state values
  const [checklistProgress, setChecklistProgress] = useState({
    gitConnected: true,
    customDomain: false,
    previewEnabled: true,
    analyticsEnabled: false,
    speedInsights: false
  });

  // Simple toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll console logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [consoleLogs]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Periodic business simulation updates (Live Agent loops!)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      const agents: ("Planner" | "Developer" | "Outreach" | "Ads" | "Support" | "Financial")[] = [
        "Developer", "Outreach", "Ads", "Support", "Financial"
      ];
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      
      const timestamp = new Date().toLocaleTimeString();
      let logText = "";
      let level: "info" | "success" | "warning" = "info";

      switch (randomAgent) {
        case "Developer":
          logText = `[Developer Agent] Optimized client assets bundles. Static routing mapped on edge CDN cluster serverless execution port 3000.`;
          level = "success";
          break;
        case "Outreach":
          const names = ["Enterprise Alpha", "Palo Alto Holdings", "Yosemite Labs"];
          const selected = names[Math.floor(Math.random() * names.length)];
          logText = `[Outreach Agent] Generated response template to inbound contact at ${selected}. Estimated contract value $500 MRR.`;
          break;
        case "Ads":
          const amount = Math.floor(Math.random() * 40) + 12;
          logText = `[Ads Agent] Dynamic budget biddings refined. Secured +${amount} organic page visits via tech keywords.`;
          level = "success";
          break;
        case "Support":
          logText = `[Support Agent] Automatically answered billing request query using PostgreSQL vector lookup. Churn risk reduced.`;
          break;
        case "Financial":
          const transactionValue = Math.floor(Math.random() * 320) + 80;
          logText = `[Reporter Agent] Received autopilot revenue payload of $${transactionValue}. Added ledger entry.`;
          level = "success";
          break;
      }

      const newLog: LogEvent = { timestamp, agent: randomAgent, text: logText, level };
      setConsoleLogs(prev => [...prev, newLog]);

      // Periodic revenue uptick simulation logic
      if (Math.random() > 0.65) {
        const valueIncrement = Math.floor(Math.random() * 150) + 40;
        const newLedgerEvent = {
          date: "Just Now",
          description: `API subscription checkout intake`,
          type: "income" as const,
          amount: valueIncrement
        };

        const updatedHistory = [...company.financials.monthlyHistory];
        const lastMonth = updatedHistory[updatedHistory.length - 1];
        if (lastMonth) {
          lastMonth.revenue += valueIncrement;
          lastMonth.mrr += Math.round(valueIncrement * 0.4);
        }

        const updatedCompany: PolsiaCompany = {
          ...company,
          financials: {
            ...company.financials,
            revenue: company.financials.revenue + valueIncrement,
            mrr: company.financials.mrr + Math.round(valueIncrement * 0.4),
            ledger: [newLedgerEvent, ...company.financials.ledger],
            monthlyHistory: updatedHistory
          },
          logs: [...consoleLogs, newLog]
        };
        onUpdateCompany(updatedCompany);
      } else {
        onUpdateCompany({
          ...company,
          logs: [...consoleLogs, newLog]
        });
      }

    }, 8000);

    return () => clearInterval(interval);
  }, [isSimulating, consoleLogs, company]);

  // Support chatbot submission handler
  const handleSupportCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportInput.trim()) return;

    const userMessage = supportInput;
    setSupportInput("");
    setIsSupportThinking(true);

    const updatedTickets = [...supportTickets, { sender: "customer" as const, message: userMessage, timestamp: "Just Now" }];
    setSupportTickets(updatedTickets);

    try {
      const response = await fetch("/api/operate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          businessIdea: `Act as Vercel-style developer workspace helper for company ${company.name} responding to: "${userMessage}". Give an actionable system or code advice.` 
        })
      });
      const data = await response.json();
      
      let replyStr = `Vercel Assistant: I have successfully queued your deployment configuration instructions for "${userMessage}". Build pipeline has been automated.`;
      if (data.company && data.company.support && data.company.support.tickets[0]) {
        replyStr = data.company.support.tickets[0].message;
      }

      setSupportTickets(prev => [...prev, {
        sender: "support_agent" as const,
        message: replyStr,
        timestamp: "Just Now"
      }]);
    } catch (e) {
      setSupportTickets(prev => [...prev, {
        sender: "support_agent" as const,
        message: "Dynamic sandbox config parsed successfully on edge Main branch clusters.",
        timestamp: "Just Now"
      }]);
    } finally {
      setIsSupportThinking(false);
    }
  };

  // Render neat list date matching May 19
  const projectDate = "May 19";
  const [showProperties, setShowProperties] = useState(() => {
    const stored = localStorage.getItem("companyDetailPropertiesVisible");
    return stored !== null ? JSON.parse(stored) : true;
  });
  const [isDocked, setIsDocked] = useState(() => {
    const stored = localStorage.getItem("companyDetailPropertiesDocked");
    return stored !== null ? JSON.parse(stored) : true;
  });
  const [propertiesSearch, setPropertiesSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("companyDetailPropertiesVisible", JSON.stringify(showProperties));
  }, [showProperties]);

  useEffect(() => {
    localStorage.setItem("companyDetailPropertiesDocked", JSON.stringify(isDocked));
  }, [isDocked]);

  if (activeTab === "dashboard") {
    return (
      <div className="w-full h-full flex-grow bg-[#0A0A0A] text-zinc-100 flex flex-col font-sans antialiased overflow-y-auto">
        <div className="px-8 py-6 sticky top-0 bg-[#0A0A0A] z-10 border-b border-zinc-900/50">
          <h1 className="text-[12px] font-bold tracking-[0.15em] text-white uppercase">Dashboard</h1>
        </div>
        
        <div className="px-8 py-8 space-y-12">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">Agents</h2>
              <span className="text-[10px] text-zinc-500 font-mono">
                {agents.filter(a => a.status === 'live').length} Active • {agents.filter(a => a.status === 'unprovisioned').length} Pending
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-sm">
              {agents.map((agent) => {
                const isLive = agent.status === "live";
                const isProvisioning = agent.status === "provisioning";
                const isUnprovisioned = agent.status === "unprovisioned";

                return (
                  <div 
                    key={agent.id}
                    onClick={() => {
                      if (isUnprovisioned) {
                        handleStartProvisioning(agent);
                      } else {
                        setActiveSidebarTab?.(agent.id);
                      }
                    }}
                    className={`border rounded-lg overflow-hidden flex flex-col transition-all cursor-pointer relative group ${
                      isLive 
                        ? "border-zinc-850 bg-[#0c0c0c] hover:border-zinc-700 shadow-[0_0_20px_rgba(45,212,191,0.02)] border-t-[#2DD4BF]/20" 
                        : isProvisioning
                        ? "border-[#2DD4BF]/40 bg-[#071415] hover:border-[#2DD4BF]/60"
                        : "border-zinc-900 bg-black opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className="p-4 border-b border-zinc-900/50 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {/* Health Dot */}
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          agent.healthIndicator === "healthy" 
                            ? "bg-[#2DD4BF] shadow-[0_0_8px_rgba(45,212,191,0.8)] animate-pulse" 
                            : agent.healthIndicator === "warning"
                            ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.85)] animate-pulse"
                            : "bg-zinc-700"
                        }`} />
                        <div className="flex items-center space-x-2">
                           <div className="w-6 h-6 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-300">
                             {agent.initials}
                           </div>
                           <span className="text-zinc-200 font-medium text-xs text-left">{agent.name}</span>
                        </div>
                      </div>
                      
                      {!isUnprovisioned && (
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-650 group-hover:text-zinc-400 transition-colors" />
                      )}
                    </div>

                    <div className="p-4 flex flex-col flex-grow select-none">
                      {isLive && (
                        <>
                          <div className="flex items-center justify-between mb-3 gap-1">
                            <span className="text-[10px] uppercase font-mono tracking-wider text-[#2DD4BF] bg-[#2DD4BF]/10 px-1.5 py-0.5 rounded">
                              {agent.status}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[120px]" title={agent.activityLabel}>
                              {agent.activityLabel}
                            </span>
                          </div>
                          
                          {agent.lastCommand ? (
                            <div className="text-[10px] uppercase tracking-widest text-zinc-550 font-mono mb-3 flex items-center gap-1.5 overflow-hidden">
                              <Terminal className="w-3 h-3 text-zinc-600 shrink-0" />
                              <span className="truncate">Cmd: {agent.lastCommand}</span>
                            </div>
                          ) : (
                            <div className="text-[10px] uppercase tracking-widest text-[#2DD4BF] font-mono mb-3 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 animate-pulse text-xs shrink-0" />
                              <span className="truncate">Ready for task allocation</span>
                            </div>
                          )}

                          <p className="text-zinc-400 text-[11px] leading-relaxed line-clamp-3 font-mono font-light mt-1 text-left">
                            {agent.role}
                          </p>
                        </>
                      )}

                      {isProvisioning && (
                        <div className="flex flex-col justify-center items-center py-6 text-center space-y-3 flex-grow h-32">
                          <RefreshCw className="w-5 h-5 text-[#2DD4BF] animate-spin" />
                          <div className="space-y-1">
                            <p className="text-xs text-[#2DD4BF] font-semibold tracking-wider font-mono">PROVISIONING</p>
                            <p className="text-[10px] text-zinc-550 font-mono">Initializing edge pod...</p>
                          </div>
                        </div>
                      )}

                      {isUnprovisioned && (
                        <div className="flex flex-col justify-center items-center py-6 text-center space-y-3 flex-grow h-32">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartProvisioning(agent);
                            }}
                            className="w-8 h-8 rounded-full border border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 group-hover:text-zinc-450 group-hover:border-zinc-700 transition-colors bg-zinc-950/20"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <div className="space-y-1">
                            <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors font-medium">Awaiting Provisioning</span>
                            <p className="text-[10px] text-zinc-600 max-w-[180px] leading-normal">{agent.role}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 pt-12 pb-8 border-y border-zinc-900">
            
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-white mb-2">
                {agents.filter(a => a.status === 'live').length}
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-zinc-300">Agents Enabled</span>
                <Bot className="w-4 h-4 text-zinc-600" />
              </div>
              <div className="text-xs text-zinc-500">
                {agents.filter(a => a.status === 'live').length} running, {agents.filter(a => a.status === 'unprovisioned').length} awaiting provisioning
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-3xl font-bold text-white mb-2">1</div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-zinc-300">Tasks In Progress</span>
                <Activity className="w-4 h-4 text-zinc-600" />
              </div>
              <div className="text-xs text-zinc-500">1 open, 0 blocked</div>
            </div>

            <div className="flex flex-col">
              <div className="text-3xl font-bold text-white mb-2">$0.00</div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-zinc-300">Month Spend</span>
                <DollarSign className="w-4 h-4 text-zinc-600" />
              </div>
              <div className="text-xs text-zinc-500">Unlimited budget</div>
            </div>

            <div className="flex flex-col">
              <div className="text-3xl font-bold text-white mb-2">0</div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-zinc-300">Pending Approvals</span>
                <CheckCircle2 className="w-4 h-4 text-zinc-600" />
              </div>
              <div className="text-xs text-zinc-500">Awaiting board review</div>
            </div>

          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="border border-zinc-900 rounded-lg p-5 flex flex-col h-40 bg-[#0A0A0A]">
              <div className="flex justify-between items-start mb-auto">
                <div className="space-y-0.5">
                  <div className="text-sm text-zinc-300 font-medium">Run Activity</div>
                  <div className="text-[10px] text-zinc-600">Last 14 days</div>
                </div>
              </div>
              <div className="flex items-end space-x-1 sm:space-x-2 h-16 pt-4">
                <div className="w-full bg-zinc-800 rounded-t-sm" style={{height: '20%'}}></div>
                <div className="w-full bg-zinc-800 rounded-t-sm" style={{height: '50%'}}></div>
                <div className="w-full bg-zinc-800 rounded-t-sm" style={{height: '30%'}}></div>
                <div className="w-full bg-zinc-800 rounded-t-sm" style={{height: '70%'}}></div>
                <div className="w-full bg-zinc-800 rounded-t-sm" style={{height: '40%'}}></div>
                <div className="w-full bg-zinc-800 rounded-t-sm" style={{height: '80%'}}></div>
                <div className="w-full bg-[#2DD4BF] rounded-t-sm opacity-60" style={{height: '100%'}}></div>
              </div>
            </div>

            <div className="border border-zinc-900 rounded-lg p-5 flex flex-col h-40 bg-[#0A0A0A]">
              <div className="flex justify-between items-start mb-auto">
                <div className="space-y-0.5">
                  <div className="text-sm text-zinc-300 font-medium">Issues by Priority</div>
                  <div className="text-[10px] text-zinc-600">Last 14 days</div>
                </div>
              </div>
              <div className="flex items-end justify-end space-x-1 sm:space-x-2 h-16 pt-4">
                <div className="w-3/4 max-w-[20px] bg-yellow-500 rounded-t-sm relative" style={{height: '100%'}}></div>
              </div>
            </div>

            <div className="border border-zinc-900 rounded-lg p-5 flex flex-col h-40 bg-[#0A0A0A]">
              <div className="flex justify-between items-start mb-auto">
                <div className="space-y-0.5">
                  <div className="text-sm text-zinc-300 font-medium">Issues by Status</div>
                  <div className="text-[10px] text-zinc-600">Last 14 days</div>
                </div>
              </div>
              <div className="flex items-end justify-end space-x-1 sm:space-x-2 h-16 pt-4">
                <div className="w-3/4 max-w-[20px] bg-indigo-500 rounded-t-sm relative" style={{height: '100%'}}></div>
              </div>
            </div>

            <div className="border border-zinc-900 rounded-lg p-5 flex flex-col h-40 bg-[#0A0A0A]">
              <div className="flex justify-between items-start mb-auto">
                <div className="space-y-0.5">
                  <div className="text-sm text-zinc-300 font-medium">Success Rate</div>
                  <div className="text-[10px] text-zinc-600">Last 14 days</div>
                </div>
              </div>
              <div className="flex items-end justify-between w-full h-16 pt-4 border-b border-zinc-800/50 relative">
                 <div className="text-2xl text-zinc-600 font-light mb-1 absolute bottom-0 right-2">...</div>
              </div>
            </div>
            
          </div>

        </div>
      </div>
    );
  }


  if (activeTab === "inbox") {
    return (
      <div className="w-full h-full flex-grow bg-[#0A0A0A] text-zinc-100 flex flex-col font-sans antialiased overflow-y-auto">
        <div className="px-8 py-6 sticky top-0 bg-[#0A0A0A] z-10 border-b border-zinc-900/50">
          <h1 className="text-[12px] font-bold tracking-[0.15em] text-white uppercase">Inbox</h1>
        </div>
        
        <div className="px-8 py-4 flex items-center justify-between border-b border-zinc-900">
          <div className="flex items-center space-x-6 text-sm">
            <button className="text-zinc-100 pb-4 border-b-2 border-white -mb-[17px] font-medium">Mine</button>
            <button className="text-zinc-500 hover:text-zinc-300 pb-4 border-b-2 border-transparent -mb-[17px] transition-colors">Recent</button>
            <button className="text-zinc-500 hover:text-zinc-300 pb-4 border-b-2 border-transparent -mb-[17px] transition-colors">Unread</button>
            <button className="text-zinc-500 hover:text-zinc-300 pb-4 border-b-2 border-transparent -mb-[17px] transition-colors">All</button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search inbox..." 
                className="bg-[#1A1A1E] border border-zinc-800 rounded-md py-1.5 pl-9 pr-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-700 w-64 transition-colors"
               />
            </div>
            
            <button className="flex items-center space-x-2 text-sm text-zinc-400 hover:text-white transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Show / hide columns</span>
            </button>
            
            <button className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-md text-sm text-zinc-300 transition-colors">
              Mark all as read
            </button>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col p-4 px-8 w-full">
           <div className="border border-zinc-900 rounded-lg overflow-hidden bg-black/50">
             
             {/* Item 1 */}
             <div className="flex items-center justify-between p-4 border-b border-zinc-900 hover:bg-[#0c0c0c] transition-colors group cursor-pointer" onClick={() => setActiveSidebarTab("issues")}>
               <div className="flex items-center space-x-3">
                 <div className="w-2 h-2 rounded-full bg-blue-500" />
                 <div className="w-4 h-4 rounded-full border-2 border-yellow-500" />
                 <span className="text-zinc-500 text-sm font-mono">TECA-1</span>
                 <span className="text-zinc-300 text-sm group-hover:text-white transition-colors">Hire your first engineer and create a hiring plan</span>
               </div>
               <span className="text-xs text-zinc-600">just now</span>
             </div>

             {/* Item 2 */}
             <div className="flex items-center justify-between p-4 border-b border-zinc-900 hover:bg-[#0c0c0c] transition-colors cursor-pointer">
               <div className="flex items-center space-x-3">
                 <div className="w-2 h-2 rounded-full bg-blue-500" />
                 <div className="w-7 h-7 rounded border border-zinc-800 flex items-center justify-center bg-zinc-900/50 text-zinc-400">
                    <User className="w-4 h-4" />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-zinc-300 text-sm font-medium">Hire Agent: CMO</span>
                   <div className="flex items-center space-x-2 text-xs mt-1">
                     <span className="text-zinc-500">Pending</span>
                     <span className="text-zinc-600">requested by CEO</span>
                     <span className="text-zinc-600">updated 1m ago</span>
                   </div>
                 </div>
               </div>
               <div className="flex items-center space-x-2">
                 <button className="px-4 py-1.5 bg-green-700/80 hover:bg-green-600 text-white text-sm font-medium rounded transition-colors">Approve</button>
                 <button className="px-4 py-1.5 bg-red-900/80 hover:bg-red-800 text-white text-sm font-medium rounded transition-colors">Reject</button>
               </div>
             </div>

             {/* Item 3 */}
             <div className="flex items-center justify-between p-4 hover:bg-[#0c0c0c] transition-colors cursor-pointer">
               <div className="flex items-center space-x-3 opacity-60">
                 <div className="w-2 h-2 rounded-full bg-blue-500" />
                 <div className="w-7 h-7 rounded border border-zinc-800 flex items-center justify-center bg-zinc-900/50 text-zinc-400">
                    <User className="w-4 h-4" />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-zinc-400 text-sm font-medium">Hire Agent: CTO</span>
                   <div className="flex items-center space-x-2 text-xs mt-1">
                     <span className="text-zinc-500">Approved</span>
                     <span className="text-zinc-600">requested by CEO</span>
                     <span className="text-zinc-600">updated 5m ago</span>
                   </div>
                 </div>
               </div>
             </div>

           </div>
        </div>

      </div>
    );
  }

  if (activeTab.startsWith("agent_")) {
    const currentAgent = agents.find(a => a.id === activeTab) || agents[0];
    const isLive = currentAgent.status === "live";
    const isProvisioning = currentAgent.status === "provisioning";
    const isUnprovisioned = currentAgent.status === "unprovisioned";

    return (
      <div className="w-full h-full flex-grow bg-[#0A0A0A] text-zinc-150 flex flex-col font-sans antialiased overflow-hidden relative">
        
        {/* Top Breadcrumb and Header Action Row */}
        <div className="flex flex-col px-8 pt-5 pb-3">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-1 text-xs text-zinc-500 font-mono tracking-tight pb-3">
            <span className="cursor-pointer hover:text-zinc-300">Agents</span>
            <span className="text-zinc-700"> &gt; </span>
            <span className="text-zinc-400 font-semibold">{currentAgent.name}</span>
            <span className="text-zinc-700"> &gt; </span>
            <span className="text-zinc-200 capitalize font-medium">
              {activeAgentSubTab === "config" ? "Configuration" : activeAgentSubTab}
            </span>
          </div>

          {/* Big Header Avatar, Titles, and Status Controls Block */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1 pb-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-[#0F0F11]/90 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-300 shadow-md">
                <Bot className="w-8 h-8 text-zinc-400" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
                  {currentAgent.name}
                </h1>
                <span className="text-xs text-zinc-500 font-mono tracking-wider block mt-0.5">
                  {currentAgent.name}
                </span>
              </div>
            </div>
            
            {/* Control Strip matching the Screenshots */}
            <div className="flex items-center flex-wrap gap-2 text-xs font-semibold">
              <button 
                onClick={() => setShowAssignModal(currentAgent)}
                disabled={activeTaskRunningAgent !== null || activeHeartbeatRunningAgent !== null}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0F0F11] border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 rounded text-zinc-200 transition-all cursor-pointer disabled:opacity-50"
              >
                {activeTaskRunningAgent === currentAgent.id ? (
                  <RefreshCw className="w-3.5 h-3.5 text-zinc-400 animate-spin" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-zinc-400" />
                )}
                <span>{activeTaskRunningAgent === currentAgent.id ? "Working..." : "Assign Task"}</span>
              </button>
              
              <button
                onClick={() => handleRunHeartbeat(currentAgent)}
                disabled={activeTaskRunningAgent !== null || activeHeartbeatRunningAgent !== null}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0F0F11] border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 rounded text-zinc-200 transition-all cursor-pointer disabled:opacity-50"
              >
                {activeHeartbeatRunningAgent === currentAgent.id ? (
                  <RefreshCw className="w-3.5 h-3.5 text-zinc-400 animate-spin" />
                ) : (
                  <PlayCircle className="w-3.5 h-3.5 text-zinc-400" />
                )}
                <span>{activeHeartbeatRunningAgent === currentAgent.id ? "Analyzing..." : "Run Heartbeat"}</span>
              </button>

              <button
                onClick={() => {
                  onTriggerAppToast?.(`Paused agent ${currentAgent.name} processes.`, "info");
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0F0F11] border border-zinc-800 hover:border-[#3a1d1d]/85 hover:bg-[#1a0f10] rounded text-zinc-400 hover:text-red-400 transition-all cursor-pointer"
              >
                <Ban className="w-3.5 h-3.5 text-zinc-500" />
                <span>Pause</span>
              </button>

              <span className="bg-[#0c1e21] text-[#2DD4BF] border border-[#2DD4BF]/20 rounded-full py-0.5 px-2.5 text-[10px] font-mono tracking-wide font-bold">
                running
              </span>

              <button className="text-zinc-500 hover:text-zinc-300 px-1 py-1 cursor-pointer">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Clean Underlined Horizontal Tab Switcher Row */}
          <div className="flex items-center gap-6 border-b border-zinc-850 progress-bar-line shrink-0 mt-3">
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "instructions", label: "Instructions" },
              { id: "skills", label: "Skills" },
              { id: "config", label: "Configuration" },
              { id: "runs", label: "Runs" },
              { id: "budget", label: "Budget" }
            ].map((tab) => {
              const isActive = activeAgentSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveAgentSubTab(tab.id as any)}
                  className={`relative pb-3 text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? "text-white font-bold" 
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeAgentSubUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-200 rounded"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Workspace Component Container */}
        <div className="flex-1 overflow-y-auto px-8 py-5 min-w-0 min-h-0 text-left">
          
          {/* TAB 1: DASHBOARD VIEW (TELEMETRY MONITOR) */}
          {activeAgentSubTab === "dashboard" && (
            <div className="space-y-6 max-w-4xl">
              
              {/* Telemetry Panel */}
              <div className="border border-zinc-850 rounded-xl bg-gradient-to-r from-zinc-950 via-zinc-900/40 to-black p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-xl">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm font-bold text-[#2DD4BF] shrink-0 shadow-inner">
                    {currentAgent.initials}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-md font-bold text-white tracking-tight">{currentAgent.name} Overview</h3>
                      <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-semibold px-2 py-0.5 rounded-full">
                        {currentAgent.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed max-w-lg">{currentAgent.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 md:border-l md:border-zinc-900 md:pl-6 shrink-0 text-xs font-mono">
                  <div className="space-y-1">
                    <span className="text-zinc-500 uppercase text-[9px] tracking-wider block">EXECUTED COMMANDS</span>
                    <span className="text-white text-xs font-semibold">{currentAgent.executedCommands} runs</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-zinc-500 uppercase text-[9px] tracking-wider block">HEALTH STATUS</span>
                    <span className={`text-xs font-semibold uppercase flex items-center gap-1.5 ${
                      currentAgent.healthIndicator === 'healthy' ? "text-[#2DD4BF]" : currentAgent.healthIndicator === 'warning' ? "text-amber-400" : "text-zinc-500"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        currentAgent.healthIndicator === "healthy" ? "bg-[#2DD4BF]" : currentAgent.healthIndicator === "warning" ? "bg-amber-500" : "bg-zinc-700"
                      }`} />
                      {currentAgent.healthIndicator}
                    </span>
                  </div>
                </div>
              </div>

              {/* simulated terminal output logs block */}
              <div className="border border-zinc-850 rounded-xl overflow-hidden bg-black flex flex-col shadow-2xl">
                <div className="p-4 border-b border-zinc-900 bg-[#071317]/40 flex items-center justify-between">
                  <div>
                    <h4 className="text-[10px] font-bold tracking-widest text-[#2DD4BF] uppercase">Real-Time Console Stream</h4>
                    <p className="text-zinc-500 text-[9px] font-mono mt-0.5">stdout output mapped on secure edge telemetry proxy</p>
                  </div>
                  {isLive && (
                    <span className="text-[10px] font-mono text-[#2DD4BF]/80 bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 px-2 py-0.5 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-ping" />
                      LIVE TELEMETRY
                    </span>
                  )}
                </div>
                
                <div className="p-4 bg-black/95 font-mono text-xs text-zinc-400 space-y-2.5 h-64 overflow-y-auto text-left" style={{ scrollbarWidth: 'thin' }}>
                  {currentAgent.agentLogs.length > 0 ? (
                    currentAgent.agentLogs.map((log, idx) => (
                      <div key={idx} className="flex items-start space-x-2.5 leading-relaxed">
                        <span className="text-zinc-700 select-none">[{idx + 1}]</span>
                        <p className="text-zinc-300 break-all">{log}</p>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                      <Terminal className="w-6 h-6 text-zinc-800" />
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-650 font-bold uppercase tracking-wider">No Log Output</p>
                        <p className="text-[10px] text-zinc-600 max-w-xs leading-normal">
                          Provision this agent node and assign task objectives to initiate edge terminal streaming telemetry.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Shared Telemetry Footer Bar */}
                <div className="p-3 border-t border-zinc-900 bg-[#070708] flex items-center justify-between text-[10px] font-mono text-zinc-500 shrink-0">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-zinc-700" />
                      <span>Memory: {isLive ? "38MB / 128MB" : "0MB"}</span>
                    </span>
                    <span>•</span>
                    <span>PID: {isLive ? "9252" : "-"}</span>
                  </div>
                  <span>Port 3000 Ingress</span>
                </div>
              </div>

              {/* Heartbeat Trace Section */}
              <div id="heartbeat-trace-section" className="border border-zinc-900 rounded-xl bg-gradient-to-b from-[#09090b] to-black p-6 space-y-5 text-left shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#2DD4BF]/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-[#2DD4BF]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                        Heartbeat Trace Log
                        <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse" />
                      </h4>
                      <p className="text-[10.5px] text-zinc-500 font-mono mt-0.5">Continuous decentralized agent runtime verification logs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400 bg-zinc-900/60 border border-zinc-805/80 px-2.5 py-1 rounded-md">
                    <span className="text-zinc-500 font-sans">Daemon Status:</span>
                    <span className="text-emerald-400 font-bold">MONITORING</span>
                  </div>
                </div>

                {/* Performance telemetry stats row (Uptime, Memory stack, Heap details) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Metric 1: Uptime & Continuity */}
                  <div className="border border-zinc-900/80 rounded-lg p-3.5 bg-zinc-950/40 space-y-1">
                    <span className="text-[9px] uppercase font-mono text-zinc-500 tracking-wider">Agent Node Uptime</span>
                    <div className="flex items-baseline space-x-1.5 pt-0.5">
                      <span className="text-[#2DD4BF] text-lg font-mono font-bold">99.98%</span>
                      <span className="text-[9.5px] text-zinc-500">/ 24h</span>
                    </div>
                    <p className="text-[9.5px] text-zinc-500 leading-normal">Uptime continuous stream. Socket Port 3000 verified.</p>
                  </div>

                  {/* Metric 2: Memory/Heap allocator */}
                  <div className="border border-zinc-900/80 rounded-lg p-3.5 bg-zinc-950/40 space-y-2">
                    <div className="flex justify-between items-center text-[9px] uppercase font-mono text-zinc-500 tracking-wider">
                      <span>Memory Heap Utilization</span>
                      <span className="text-zinc-400 font-mono font-bold">29.4%</span>
                    </div>
                    <div className="w-full bg-zinc-900 rounded-full h-1 my-1 overflow-hidden">
                      <div className="bg-[#2DD4BF] h-1 rounded-full transition-all duration-500" style={{ width: '29.4%' }} />
                    </div>
                    <p className="text-[9.5px] text-zinc-500 font-mono">
                      Heap alloc: <span className="text-zinc-305 font-bold">38.4MB</span> / {(currentAgent.memorySize || 4096)}MB
                    </p>
                  </div>

                  {/* Metric 3: Heartbeat latency & checks */}
                  <div className="border border-zinc-900/80 rounded-lg p-3.5 bg-zinc-950/40 space-y-1">
                    <span className="text-[9px] uppercase font-mono text-zinc-500 tracking-wider">Check Latency & Interval</span>
                    <div className="flex items-baseline space-x-1.5 pt-0.5">
                      <span className="text-white text-lg font-mono font-bold">14ms</span>
                      <span className="text-[9.5px] text-zinc-500 font-semibold text-emerald-500">interval: 60s</span>
                    </div>
                    <p className="text-[9.5px] text-zinc-500 leading-normal">Cron frequency active. Telemetry checks are non-blocking.</p>
                  </div>

                </div>

                {/* Heartbeat checks sub-logs */}
                <div className="space-y-2.5">
                  <span className="text-[9px] uppercase font-bold font-mono tracking-widest text-zinc-400 block px-0.5">
                    Recent System Heartbeat Checks
                  </span>
                  
                  <div className="border border-zinc-900 rounded-lg bg-black/50 divide-y divide-zinc-900 font-mono text-[11px] overflow-hidden">
                    {getAgentHeartbeatChecks(currentAgent.id).map((check, idx) => (
                      <div key={idx} className="flex items-center justify-between px-3 py-2.5 hover:bg-zinc-950/50 transition-colors">
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            check.status === "SUCCESS" ? "bg-emerald-400" : "bg-zinc-650"
                          } shrink-0`} />
                          <span className="text-[10px] text-zinc-500 shrink-0">{check.timestamp}</span>
                          <span className="text-zinc-400 font-semibold truncate">{check.component}</span>
                          <span className="text-zinc-650 hidden md:inline truncate">— {check.detail}</span>
                        </div>
                        <div className="flex items-center space-x-2 shrink-0 pl-2">
                          <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded ${
                            check.status === "SUCCESS" 
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                              : "bg-zinc-800 text-zinc-400"
                          }`}>
                            {check.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Quick Actions Container */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="border border-zinc-900 rounded-xl p-5 bg-zinc-950/20 space-y-2">
                  <span className="text-[10px] font-bold font-mono text-zinc-500 uppercase tracking-widest block">Agent Capabilities</span>
                  <p className="text-xs text-zinc-400 leading-normal">
                    This instance is dedicated to representing the <span className="text-white font-medium">{currentAgent.name}</span> module block. It features full sandbox read/write capabilities across workspace files under human-supervised execution loops.
                  </p>
                </div>

                <div className="border border-zinc-900 rounded-xl p-5 bg-zinc-950/20 space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold font-mono text-zinc-500 uppercase tracking-widest block mb-1">Active Objective</span>
                    <p className="text-xs text-zinc-200 font-mono italic">
                      {currentAgent.activityLabel}
                    </p>
                  </div>
                  {isLive && (
                    <button
                      onClick={() => setShowAssignModal(currentAgent)}
                      className="w-full text-center py-1.5 bg-zinc-900 hover:bg-zinc-850 hover:text-white border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
                    >
                      Delegate Objective
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INSTRUCTIONS VIEW (FILES & EDIT PANELS) */}
          {activeAgentSubTab === "instructions" && (
            <div className="w-full max-w-5xl">
              {/* Advanced toggle matching screenshot */}
              <div className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors text-[11.5px] font-semibold py-1.5 px-0.5 mb-5 cursor-pointer select-none">
                <ChevronRight className="w-4 h-4 shrink-0" />
                <span>Advanced</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
                
                {/* Left column - files browser list */}
                <div className="space-y-3 text-left">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-bold uppercase font-mono tracking-wider text-zinc-400">Files</span>
                    <button 
                      onClick={() => {
                        const newFileName = prompt("Enter new instruction file name:", "RULES.md");
                        if (newFileName && newFileName.endsWith(".md")) {
                          setInstructionsFiles(prev => ({
                            ...prev,
                            [newFileName]: { content: "# " + newFileName + "\nWrite rules here...", size: "128B" }
                          }));
                          setSelectedInstructionsFile(newFileName);
                        }
                      }}
                      className="w-5 h-5 rounded border border-zinc-800 hover:border-zinc-700 flex items-center justify-center bg-zinc-900/60 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer text-xs font-bold"
                      title="Add configuration file"
                    >
                      +
                    </button>
                  </div>

                  <div className="border border-zinc-900 rounded-xl p-2 bg-black/60 space-y-1 overflow-hidden">
                    {Object.entries(instructionsFiles).map(([filename, rawData]) => {
                      const data = rawData as any;
                      const isSelected = selectedInstructionsFile === filename;
                      return (
                        <div
                          key={filename}
                          onClick={() => setSelectedInstructionsFile(filename)}
                          className={`flex items-center justify-between px-3 py-2.5 cursor-pointer group transition-all rounded-lg ${
                            isSelected 
                              ? "bg-zinc-900/60 text-white border border-zinc-800" 
                              : "text-zinc-400 hover:text-zinc-200 hover:bg-[#0E0E10]/50"
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <FileText className={`w-4 h-4 shrink-0 ${isSelected ? "text-zinc-200" : "text-zinc-550 group-hover:text-zinc-300"}`} />
                            <span className={`text-xs font-mono truncate ${isSelected ? "text-zinc-100 font-semibold" : "text-zinc-400"}`}>
                              {filename}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2 shrink-0">
                            {data.tag ? (
                              <span className="text-[8.5px] font-mono py-0.5 px-2 rounded font-bold tracking-wider bg-zinc-800/80 text-zinc-400">
                                {data.tag}
                              </span>
                            ) : (
                              <span className="text-[9.5px] font-mono text-zinc-500 group-hover:text-zinc-400">
                                {data.size}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right column - Code/Markdown editor view */}
                <div className="flex flex-col space-y-3 text-left">
                  <div className="px-1">
                    <span className="text-zinc-100 font-bold text-sm block truncate">{selectedInstructionsFile}</span>
                    <span className="text-zinc-500 text-[10px] uppercase font-mono tracking-widest block">markdown file</span>
                  </div>

                  <div className="border border-zinc-900 rounded-xl overflow-hidden bg-[#0A0A0B] shadow-2xl flex flex-col">
                    <textarea
                      value={fileEditingContent}
                      onChange={(e) => setFileEditingContent(e.target.value)}
                      placeholder="# Enter markdown rules or operational guidelines..."
                      spellCheck={false}
                      className="w-full h-[450px] bg-black/90 p-6 md:p-8 font-mono text-[13px] text-zinc-300 focus:outline-none resize-none leading-[1.9] tracking-tight"
                      style={{ scrollbarWidth: 'thin' }}
                    />
                    
                    <div className="p-4 bg-zinc-950/80 border-t border-zinc-900/80 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                      <div>
                        Chars: {fileEditingContent.length} • Format: UTF-8
                      </div>
                      <button
                        onClick={() => {
                          setInstructionsFiles(prev => ({
                            ...prev,
                            [selectedInstructionsFile]: {
                              ...prev[selectedInstructionsFile],
                              content: fileEditingContent
                            }
                          }));
                          onTriggerAppToast?.(`Committed rules changes directly into ${selectedInstructionsFile}.`, "success");
                        }}
                        className="px-4 py-2 bg-zinc-100 hover:bg-white text-black font-semibold font-sans transition-colors rounded-lg text-xs cursor-pointer shadow-md"
                      >
                        Save Runbook Rules
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: SKILLS VIEW (REGISTRY FOR PAPERCLIP INSTANCE) */}
          {activeAgentSubTab === "skills" && (
            <div className="space-y-6 max-w-4xl text-left">
              <div>
                <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  View company skills library
                </h2>
              </div>

              <div className="space-y-3.5">
                <h3 className="text-[10px] font-extrabold uppercase font-sans tracking-widest text-zinc-500">
                  Required by Paperclip
                </h3>

                <div className="space-y-2.5">
                  {[
                    { id: "paperclip", label: "paperclip", desc: "Will be linked into the effective CODEX_HOME/skills/ directory on the next run." },
                    { id: "paperclip-create-agent", label: "paperclip-create-agent", desc: "Will be linked into the effective CODEX_HOME/skills/ directory on the next run." },
                    { id: "paperclip-create-plugin", label: "paperclip-create-plugin", desc: "Will be linked into the effective CODEX_HOME/skills/ directory on the next run." },
                    { id: "para-memory-files", label: "para-memory-files", desc: "Will be linked into the effective CODEX_HOME/skills/ directory on the next run." }
                  ].map((skillItem) => (
                    <div 
                      key={skillItem.id}
                      className="border border-zinc-850/80 bg-[#0C0C0E]/90 hover:border-zinc-800 p-4 rounded-lg flex items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-center space-x-3.5 min-w-0">
                        {/* Checked active checkbox */}
                        <div className="w-4 h-4 rounded bg-emerald-500/15 border border-emerald-500 flex items-center justify-center text-emerald-400 shrink-0">
                          <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                        </div>
                        <div className="min-w-0 text-left">
                          <span className="text-xs font-semibold text-zinc-150 block tracking-tight">
                            {skillItem.label}
                          </span>
                          <span className="text-zinc-500 text-[11px] leading-relaxed block mt-0.5">
                            {skillItem.desc}
                          </span>
                        </div>
                      </div>

                      <button 
                        onClick={() => onTriggerAppToast?.(`Inspecting skill details: ${skillItem.label}`, "info")}
                        className="text-xs text-zinc-400 hover:text-white underline cursor-pointer shrink-0 font-medium px-2 py-0.5"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Variables applied bar */}
              <div className="pt-6 border-t border-zinc-900 flex flex-wrap gap-x-12 gap-y-4 font-mono text-[11px] text-zinc-400">
                <div className="flex items-center space-x-2">
                  <span className="text-zinc-600">Adapter</span>
                  <span className="text-zinc-200 font-semibold bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-[10px]">
                    Codex (local)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-zinc-600">Skills applied</span>
                  <span className="text-zinc-300 font-semibold">Applied when the agent runs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-zinc-600">Selected skills</span>
                  <span className="text-[#2DD4BF] font-extrabold text-xs">4</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONFIGURATION VIEW (IDENTITY & ADAPTERS) */}
          {activeAgentSubTab === "config" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl text-left font-sans">
              
              {/* Card Section A: Identity */}
              <div className="border border-zinc-850 bg-[#0B0B0C]/40 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-zinc-100 pb-2 border-b border-zinc-900 flex items-center gap-2">
                  <span>Identity</span>
                </h3>

                <div className="space-y-4.5">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span className="tracking-wide">Name</span>
                      <HelpIcon className="w-3.5 h-3.5 text-zinc-600 cursor-pointer" title="The identifying reference of this agent node" />
                    </div>
                    <input 
                      type="text" 
                      value={currentAgent.name} 
                      readOnly
                      className="w-full bg-zinc-950 border border-zinc-850 px-3 py-2 text-xs font-semibold rounded text-zinc-200 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span className="tracking-wide">Title</span>
                      <HelpIcon className="w-3.5 h-3.5 text-zinc-600 cursor-pointer" title="Custom job title or strategic moniker" />
                    </div>
                    <input 
                      type="text" 
                      value={configTitle} 
                      onChange={(e) => setConfigTitle(e.target.value)}
                      placeholder="e.g. VP of Engineering"
                      className="w-full bg-zinc-950 border border-[#1d1d21] hover:border-zinc-800 focus:border-[#2DD4BF] px-3 py-2 text-xs rounded text-zinc-200 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span className="tracking-wide">Reports to</span>
                      <HelpIcon className="w-3.5 h-3.5 text-zinc-600 cursor-pointer" title="Define target manager node for delegations" />
                    </div>
                    <select
                      value={configReportsTo}
                      onChange={(e) => setConfigReportsTo(e.target.value)}
                      className="w-full bg-zinc-950 border border-[#1d1d21] px-3 py-2 text-xs rounded text-zinc-300 focus:outline-none"
                    >
                      <option value="Choose manager...">Choose manager...</option>
                      <option value="agent_ceo">CEO / Strategy Director</option>
                      <option value="agent_cto">CTO / Technical Architect</option>
                      <option value="none">None (Top Orchestrator)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span className="tracking-wide">Capabilities</span>
                      <HelpIcon className="w-3.5 h-3.5 text-zinc-600 cursor-pointer" title="Summarize active permissions and sandboxed limits" />
                    </div>
                    <textarea 
                      value={configCapabilities}
                      onChange={(e) => setConfigCapabilities(e.target.value)}
                      placeholder="Describe what this agent can do..."
                      rows={3}
                      className="w-full bg-zinc-950 border border-[#1d1d21] hover:border-zinc-800 focus:border-[#2DD4BF] p-3 text-xs rounded text-zinc-300 focus:outline-none resize-none leading-relaxed transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Right column: Adapter controls & Permissions & Configuration */}
              <div className="space-y-6">
                
                {/* Section B: Adapter */}
                <div className="border border-zinc-850 bg-[#0B0B0C]/40 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
                    <h3 className="text-xs font-bold text-zinc-100 shrink-0">
                      Adapter
                    </h3>
                    <button 
                      onClick={() => onTriggerAppToast?.("Successfully pinged sandbox workspace environment.", "success")}
                      className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-[10px] font-semibold rounded hover:bg-zinc-855 text-zinc-300 cursor-pointer transition-colors"
                    >
                      Test environment
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                        <span>Adapter type</span>
                        <HelpIcon className="w-3.5 h-3.5 text-zinc-600" />
                      </div>
                      <select className="w-full bg-zinc-950 border border-[#1d1d21] px-3 py-2 text-xs rounded text-zinc-300 focus:outline-none">
                        <option value="codex">Codex (local)</option>
                        <option value="cloud">Cloud Sandbox</option>
                      </select>
                    </div>

                    {/* Dual switches */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between border border-zinc-900 bg-zinc-950/40 p-2.5 rounded-lg">
                        <div className="text-left">
                          <span className="text-[10px] font-mono tracking-wide text-zinc-400 block">Bypass sandbox</span>
                        </div>
                        {/* Switch with green active state */}
                        <button
                          type="button"
                          onClick={() => {
                            setConfigBypassSandbox(!configBypassSandbox);
                            onTriggerAppToast?.(`Bypass sandbox toggled to ${!configBypassSandbox}`, "info");
                          }}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${
                            configBypassSandbox ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-zinc-800"
                          }`}
                        >
                          <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white transition duration-250 ease-in-out ${
                            configBypassSandbox ? "translate-x-4" : "translate-x-0"
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between border border-zinc-900 bg-zinc-950/40 p-2.5 rounded-lg">
                        <div className="text-left">
                          <span className="text-[10px] font-mono tracking-wide text-zinc-400 block">Enable search</span>
                        </div>
                        {/* Switch */}
                        <button
                          type="button"
                          onClick={() => {
                            setConfigEnableSearch(!configEnableSearch);
                            onTriggerAppToast?.(`Enable web search toggled to ${!configEnableSearch}`, "info");
                          }}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${
                            configEnableSearch ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-zinc-800"
                          }`}
                        >
                          <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white transition duration-250 ease-in-out ${
                            configEnableSearch ? "translate-x-4" : "translate-x-0"
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section C: Permissions & Configuration */}
                <div className="border border-zinc-850 bg-[#0B0B0C]/40 rounded-xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-zinc-100 pb-2 border-b border-zinc-900">
                    Permissions & Configuration
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                        <span>Command</span>
                        <HelpIcon className="w-3.5 h-3.5 text-zinc-600" />
                      </div>
                      <input 
                        type="text" 
                        defaultValue="codex" 
                        className="w-full bg-zinc-950 border border-[#1d1d21] px-3 py-2 text-xs font-mono rounded text-zinc-300 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                        <span>Model</span>
                        <HelpIcon className="w-3.5 h-3.5 text-zinc-600" />
                      </div>
                      <select className="w-full bg-zinc-950 border border-[#1d1d21] px-3 py-2 text-xs font-mono rounded text-zinc-300 focus:outline-none">
                        <option value="gpt-5.3-codex">gpt-5.3-codex</option>
                        <option value="gemini-2.5-pro">models/gemini-2.5-pro</option>
                        <option value="gemini-2.5-flash">models/gemini-2.5-flash</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                        <span>Thinking effort</span>
                        <HelpIcon className="w-3.5 h-3.5 text-zinc-600" />
                      </div>
                      <select className="w-full bg-zinc-950 border border-[#1d1d21] px-3 py-2 text-xs font-mono rounded text-zinc-300 focus:outline-none">
                        <option value="auto">Auto</option>
                        <option value="high">High (Deep reasoning)</option>
                        <option value="low">Low (Fast response)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RUNS VIEW (ACTIVE ASSIGNMENTS & ISSUES) */}
          {activeAgentSubTab === "runs" && (
            <div className="grid grid-cols-1 md:grid-cols-[11fr_16fr] gap-6 max-w-4xl">
              
              {/* Left Column: Recent Runs List */}
              <div className="space-y-3">
                <span className="text-[10.5px] font-extrabold uppercase font-sans tracking-wide text-zinc-500 block px-1">
                  Active Execution Runs
                </span>

                <div className="border border-zinc-900 rounded-lg overflow-hidden bg-black/60 divide-y divide-zinc-900/60 text-left">
                  {[
                    { id: "8a6ac81e", tag: "Assignment", isPurple: true, time: "2m ago", status: "queued" },
                    { id: "58c475b3", tag: "Assignment", isPurple: true, time: "3m ago", status: "running" },
                    { id: "40ce5335", tag: "Assignment", isPurple: true, time: "5m ago", status: "succeeded", detail: "980.6k tok" },
                    { id: "2bdbd0b0", tag: "Automation", isPurple: false, time: "6m ago", status: "succeeded", detail: "443.8k tok" },
                    { id: "d9e3c6c4", tag: "Assignment", isPurple: true, time: "9m ago", status: "succeeded", detail: "524.1k tok" },
                    { id: "6ceb315f", tag: "Automation", isPurple: false, time: "11m ago", status: "succeeded", detail: "271.7k tok" }
                  ].map((run) => {
                    const isSelected = selectedRunId === run.id;
                    return (
                      <div
                        key={run.id}
                        onClick={() => setSelectedRunId(run.id)}
                        className={`p-3.5 cursor-pointer transition-all flex flex-col gap-1.5 ${
                          isSelected 
                            ? "bg-[#141416]/90 border-l border-[#2DD4BF]" 
                            : "hover:bg-[#0C0C0E]/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {/* Icon status indicator */}
                            {run.status === "queued" && (
                              <Hourglass className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                            )}
                            {run.status === "running" && (
                              <RefreshCw className="w-3.5 h-3.5 text-[#2DD4BF] animate-spin" />
                            )}
                            {run.status === "succeeded" && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            )}
                            <span className="text-xs font-mono text-zinc-350">{run.id}</span>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <span className={`text-[8.5px] font-mono py-0 px-2 rounded-full font-bold uppercase tracking-wide ${
                              run.isPurple 
                                ? "bg-purple-900/20 text-purple-400 border border-purple-500/10" 
                                : "bg-zinc-800 text-zinc-400"
                            }`}>
                              {run.tag}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-650">{run.time}</span>
                          </div>
                        </div>

                        {run.detail && (
                          <div className="text-[9.5px] text-zinc-500 font-mono pl-5">
                            Cumulative context: {run.detail}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Highlighted Run Properties */}
              <div className="space-y-4">
                {/* Find current selected run information */}
                {(() => {
                  const runsDict: Record<string, string> = {
                    "8a6ac81e": "queued",
                    "58c475b3": "running",
                    "40ce5335": "completed",
                    "2bdbd0b0": "completed"
                  };
                  const currentStatus = runsDict[selectedRunId] || "completed";

                  return (
                    <div className="border border-zinc-850 bg-[#0B0B0C]/40 p-5 rounded-xl space-y-5 text-left">
                      <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${
                            currentStatus === "completed" 
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" 
                              : currentStatus === "running"
                              ? "bg-[#2DD4BF]/15 text-[#2DD4BF] border border-[#2DD4BF]/20"
                              : "bg-zinc-800 text-zinc-400"
                          }`}>
                            {currentStatus}
                          </span>
                        </div>
                        {currentStatus !== "completed" && (
                          <button 
                            onClick={() => onTriggerAppToast?.(`Cancelled run ${selectedRunId}.`, "info")}
                            className="text-xs text-red-400 hover:text-red-300 hover:underline cursor-pointer font-medium"
                          >
                            Cancel
                          </button>
                        )}
                      </div>

                      {/* Issues Touched block */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-zinc-500 block">
                          Issues Touched (1)
                        </span>

                        <div className="border border-zinc-900 bg-black/50 rounded-lg p-3.5 flex items-center justify-between gap-3">
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <span className="bg-[#0c1e21] text-[#2DD4BF] border border-[#2DD4BF]/20 rounded py-0 px-2 text-[9px] font-mono font-extrabold uppercase">
                              todo
                            </span>
                            <span className="text-xs text-zinc-300 font-medium truncate max-w-[190px]">
                              Build ranking + summarization pipeline for daily digest
                            </span>
                          </div>
                          
                          <span className="text-[10.5px] font-mono text-zinc-600 shrink-0 font-semibold tracking-tight">
                            TECA-7
                          </span>
                        </div>
                      </div>

                      {/* Console traces trace events */}
                      <div className="space-y-2 pt-1">
                        <span className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-zinc-500 block">
                          Diagnostics Logs
                        </span>
                        
                        <div className="border border-zinc-900 bg-zinc-950 rounded-lg p-4 font-mono text-[10.5px] text-zinc-600 leading-relaxed min-h-[100px] flex items-center justify-center text-center">
                          <div>
                            <Lock className="w-5 h-5 text-zinc-800 mx-auto mb-2" />
                            No log events available for this thread cache frame.
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* TAB 6: BUDGET VIEW (RESOURCES AND METER) */}
          {activeAgentSubTab === "budget" && (
            <div className="space-y-6 max-w-4xl text-left">
              
              {/* Healthy Alert Header */}
              <div className="border border-zinc-900/60 bg-[#0C0C0E] pl-5 pr-6 py-4 rounded-xl flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-zinc-500 text-[10.5px] font-mono uppercase tracking-wider block">Agent Health Diagnostic</h4>
                  <p className="text-xs text-zinc-400 font-medium">This active model sandbox complies fully with real-time financial policies.</p>
                </div>

                <div className="flex items-center space-x-1.5 px-3 py-1 bg-[#121A15] border border-emerald-950 rounded text-emerald-400 font-bold shrink-0 text-xs font-mono">
                  <Shield className="w-3.5 h-3.5" />
                  <span>HEALTHY</span>
                </div>
              </div>

              {/* Core Observed Stats block */}
              <div className="border border-zinc-850 bg-[#0B0B0C]/40 rounded-xl p-6 space-y-6">
                
                {/* Title */}
                <div>
                  <h3 className="text-md font-bold text-zinc-200 tracking-tight">{currentAgent.name}</h3>
                  <span className="text-zinc-500 font-mono text-[10.5px]">Monthly UTC budget</span>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-zinc-650 block">
                      OBSERVED
                    </span>
                    <div className="space-y-1">
                      <div className="text-3xl font-extrabold text-white tracking-tight">$0.00</div>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">No cap configured</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-zinc-650 block">
                      BUDGET
                    </span>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold text-zinc-100 tracking-tight">
                        {budgetIsSet ? `$${parseFloat(budgetUsdVal).toFixed(2)}` : "Disabled"}
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">Soft alert at 80%</p>
                    </div>
                  </div>
                </div>

                {/* Progress bar line */}
                <div className="space-y-2 pt-3 border-t border-zinc-900/60">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500">Remaining</span>
                    <span className="text-zinc-300 font-bold">{budgetIsSet ? "100.00%" : "Unlimited"}</span>
                  </div>
                  
                  {/* Empty slider track reflecting screenshots */}
                  <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-850 relative">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        budgetIsSet ? "bg-[#2DD4BF] shadow-[0_0_8px_rgba(45,212,191,0.6)]" : "w-0"
                      }`}
                      style={{ width: budgetIsSet ? "100%" : "0" }}
                    />
                  </div>
                </div>
              </div>

              {/* Set budget interactive element block */}
              <div className="border border-zinc-850 bg-[#0B0B0C]/40 rounded-xl p-5 space-y-4">
                <span className="text-[10px] font-extrabold uppercase font-mono tracking-widest text-zinc-500 block">
                  BUDGET (USD)
                </span>

                <div className="flex items-center gap-3 max-w-sm">
                  <input 
                    type="text" 
                    value={budgetUsdVal}
                    onChange={(e) => setBudgetUsdVal(e.target.value)}
                    placeholder="0.00" 
                    className="flex-grow bg-zinc-950 border border-[#1d1d21] focus:border-[#2DD4BF] rounded px-3 py-1.5 font-mono text-xs text-white focus:outline-none transition-all"
                  />
                  <button 
                    onClick={() => {
                      const num = parseFloat(budgetUsdVal);
                      if (!isNaN(num) && num > 0) {
                        setBudgetIsSet(true);
                        updateAgentField(currentAgent.id, "budget", num);
                        onTriggerAppToast?.(`Committed threshold quota set at $${num.toFixed(2)} USD.`, "success");
                      } else {
                        setBudgetIsSet(false);
                        updateAgentField(currentAgent.id, "budget", 0);
                        onTriggerAppToast?.(`Disabled threshold quota limit on ${currentAgent.name}.`, "info");
                      }
                    }}
                    className="px-4 py-1.5 bg-[#141416] hover:bg-zinc-800 border border-zinc-800 text-zinc-150 rounded transition-all text-xs font-semibold shrink-0 cursor-pointer"
                  >
                    Set budget
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Properties Right Sidebar replica for agent details */}
        {showProperties && (
          <div className="w-[280px] border-l border-zinc-900 flex-shrink-0 flex flex-col bg-[#0b0b0c] text-left">
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-900">
              <span className="text-zinc-150 font-medium text-xs">Agent Params</span>
              <button onClick={() => setShowProperties(false)} className="text-zinc-500 hover:text-white cursor-pointer p-0.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div className="p-5 space-y-5 text-xs font-mono">
              <div className="space-y-3.5">
                <div className="grid grid-cols-[100px_1fr] items-center gap-1.5">
                  <span className="text-zinc-550 text-[10px]">INSTANCE ID</span>
                  <span className="text-zinc-400 bg-zinc-900/60 p-1 px-1.5 rounded break-all text-[10px]">{currentAgent.id}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center gap-1.5">
                  <span className="text-zinc-550 text-[10px]">REPLICA AT</span>
                  <span className={`font-semibold uppercase text-[10px] ${isLive ? "text-[#2DD4BF]" : "text-zinc-500"}`}>{currentAgent.status}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center gap-1.5">
                  <span className="text-zinc-550 text-[10px]">HEALTH</span>
                  <span className="text-emerald-400 text-[10px]">CLASS-A (99%)</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center gap-1.5">
                  <span className="text-zinc-550 text-[10px]">COMMITTED</span>
                  <span className="text-zinc-300 text-[10px]">{currentAgent.executedCommands} runs</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center gap-1.5">
                  <span className="text-zinc-550 text-[10px]">VIRTUAL PORTS</span>
                  <span className="text-zinc-300 text-[10px]">3000 › 3000</span>
                </div>
              </div>

              <div className="border-t border-zinc-900 pt-5 space-y-3.5">
                <div className="space-y-1">
                  <span className="text-zinc-550 text-[9px] block">BOUND MEMORY MAPS</span>
                  <span className="text-zinc-500 leading-normal block text-[10px]">
                     HEARTBEAT.md, TOOLS.md, CACHE_STORE.db
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-zinc-550 text-[9.5px] block font-semibold text-[#2DD4BF]">CONTROLLER ENGINE</span>
                  <span className="text-zinc-550 leading-normal block text-[10px]">
                     Gemini-3.5-flash LLM Model Proxy
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  if (activeTab === "issues" || activeTab === "onboarding_project") {
    return (
      <div className="w-full flex-grow bg-[#0A0A0A] text-zinc-100 flex font-sans antialiased overflow-hidden relative">
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Breadcrumb and Actions */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-zinc-900 sticky top-0 bg-[#0A0A0A]/90 backdrop-blur-sm z-10 shrink-0">
            
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-zinc-500">Issues</span>
              <span className="text-zinc-500">›</span>
              <div className="flex items-center space-x-2 text-zinc-200 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 border border-blue-500/30" />
                <span className="truncate">Hire your first engineer and create a hiring plan</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button className="flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors">
                <span className="w-3.5 h-3.5 border-2 border-current rounded-full flex items-center justify-center transform -rotate-45" style={{clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)'}} />
                <span>Upload attachment</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors">
                <Plus className="w-4 h-4" />
                <span>New document</span>
              </button>
              
              {!showProperties && (
                <button 
                  onClick={() => setShowProperties(true)}
                  className="flex items-center justify-center p-1.5 ml-2 border border-zinc-800 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="15" y1="3" x2="15" y2="21"></line></svg>
                </button>
              )}
            </div>
          </div>

          {/* Content Body */}
          <div className="max-w-4xl mx-auto w-full px-8 py-8 flex flex-col gap-8 flex-grow pb-32">
            
            {/* Tabs */}
            <div className="flex items-center space-x-8 border-b border-zinc-900 text-sm">
              <button className="px-2 py-3 border-b-2 border-white text-zinc-100 font-medium tracking-wide">
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 border border-current rounded flex items-center justify-center">
                    <span className="w-2 h-0.5 bg-current rounded-full" />
                  </span>
                  <span>Comments</span>
                </div>
              </button>
              <button className="px-2 py-3 border-b-2 border-transparent text-zinc-500 hover:text-zinc-300 transition-colors">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 opacity-75" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M3.27 6.96L12 12.01l8.73-5.05"/><path d="M12 22.08V12"/></svg>
                  <span>Sub-issues</span>
                </div>
              </button>
              <button className="px-2 py-3 border-b-2 border-transparent text-zinc-500 hover:text-zinc-300 transition-colors">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>Activity</span>
                </div>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-zinc-100 font-medium text-sm">Timeline (0)</h3>
                <p className="text-zinc-500 text-sm mt-4">No timeline entries yet.</p>
              </div>

              {/* LIVE RUNS Block */}
              <div className="border border-zinc-800 rounded-lg overflow-hidden bg-black mt-8">
                <div className="p-4 border-b border-zinc-900 bg-[#071317]">
                  <h4 className="text-[11px] font-bold tracking-widest text-[#2DD4BF] uppercase">Live Runs</h4>
                  <p className="text-zinc-400 text-xs mt-1">Streamed with the same transcript UI used on the full run detail page.</p>
                </div>
                
                <div className="p-4 flex flex-col gap-6 text-sm">
                  
                  {/* Agent Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-semibold text-zinc-300">
                        CE
                      </div>
                      <span className="text-white font-medium">CEO</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-red-950/30 text-red-400 text-xs border border-red-900/50 hover:bg-red-900/50 transition-colors">
                        <div className="w-2 h-2 rounded-[1px] bg-red-500" />
                        <span>Stop</span>
                      </button>
                      <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-zinc-800 text-zinc-300 text-xs hover:border-zinc-700 transition-colors">
                        <span>Open run</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="font-mono bg-zinc-900 px-2 py-0.5 rounded text-zinc-400">da091c93</span>
                    <span className="bg-[#0f2e33] text-[#2DD4BF] px-2 py-0.5 rounded-full font-medium">running</span>
                    <span className="text-zinc-500">Apr 14, 2026, 12:01 PM</span>
                  </div>

                  {/* Stream Logs */}
                  <div className="space-y-4 pt-2">
                    <div className="text-xs uppercase font-mono tracking-widest text-zinc-500 flex items-center">
                      <span>STDOUT</span>
                      <ChevronDown className="w-3.5 h-3.5 ml-2 -rotate-90" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
                        <span className="text-[#2DD4BF]">INIT</span>
                        <span>model codex • session 019d8b70-5512-7ec3-a558-ead4eeab2294</span>
                      </div>
                      
                      <p className="text-zinc-300 leading-relaxed max-w-2xl text-[13px]">
                        I'm taking this as an operational handoff to resume CEO queue management. I'll first load your required runbooks ( <code className="bg-zinc-800/80 px-1 py-0.5 rounded text-zinc-200">HEARTBEAT.md</code> , <code className="bg-zinc-800/80 px-1 py-0.5 rounded text-zinc-200">SOUL.md</code> , <code className="bg-zinc-800/80 px-1 py-0.5 rounded text-zinc-200">TOOLS.md</code> ), then check current assigned tasks and delegate to the correct report instead of implementing directly.
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-500 font-mono">
                      <div className="flex items-center space-x-2">
                        <Terminal className="w-3.5 h-3.5" />
                        <CodeXml className="w-3.5 h-3.5" />
                        <span className="ml-2 uppercase tracking-widest">EXECUTED 2 COMMANDS</span>
                      </div>
                      <ChevronDown className="w-4 h-4 -rotate-90" />
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* Fixed Bottom Comment Box */}
          <div className="border-t border-zinc-900 p-8 pt-0 sticky bottom-0 bg-[#0A0A0A] mt-auto">
            <div className="max-w-4xl mx-auto w-full bg-[#121212] border border-zinc-800 rounded-lg overflow-hidden flex flex-col shadow-2xl">
              <textarea 
                className="w-full bg-transparent text-sm text-zinc-300 p-4 outline-none resize-none placeholder-zinc-600 min-h-[100px]"
                placeholder="Leave a comment..."
              />
              <div className="p-3 border-t border-zinc-800 bg-[#0c0c0c] flex items-center justify-between">
                <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
                  <span className="w-4 h-4 border-2 border-current rounded-full flex items-center justify-center transform -rotate-45" style={{clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)'}} />
                </button>
                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-2 text-sm text-zinc-400 cursor-pointer">
                    <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700 text-blue-500 focus:ring-blue-500/20" defaultChecked />
                    <span>Re-open</span>
                  </label>
                  <button className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-zinc-800 text-zinc-300 text-xs border border-zinc-700 hover:bg-zinc-700 transition-colors">
                    <Bot className="w-3.5 h-3.5" />
                    <span>CEO</span>
                  </button>
                  <button className="px-4 py-1.5 rounded-md bg-zinc-300 text-black text-sm font-medium hover:bg-white transition-colors">
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Right Sidebar */}
        {showProperties && (
          <div className={`w-[300px] border-l border-zinc-900 flex-shrink-0 flex flex-col bg-[#0f0f0f] overflow-y-auto ${!isDocked ? "absolute right-0 h-full z-20 shadow-[-10px_0_30px_rgb(0,0,0,0.5)]" : ""}`}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-900">
              <span className="text-zinc-100 font-medium">Properties</span>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setIsDocked(!isDocked)}
                  className="text-zinc-500 hover:text-white transition-colors"
                  title={isDocked ? "Float panel" : "Dock panel"}
                >
                  <svg className={`w-4 h-4 transition-transform ${!isDocked ? "rotate-45 text-blue-400" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 19-3-3"/><path d="m6 10-2-2 4-4 2 2-2 2zm3-3 4-4 6 6-4 4-2-2-4 4-3-3m0 0-3 3-2-2 3-3"/></svg>
                </button>
                <button 
                  onClick={() => setShowProperties(false)}
                  className="text-zinc-500 hover:text-white transition-colors"
                  title="Close panel"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
            
            <div className="p-4 border-b border-zinc-900">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Filter properties..." 
                  value={propertiesSearch}
                  onChange={(e) => setPropertiesSearch(e.target.value)}
                  className="w-full bg-[#1A1A1E] border border-zinc-800 rounded-md py-1.5 pl-9 pr-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-700 transition-colors"
                />
              </div>
            </div>
            
            <div className="p-6 space-y-6 text-sm">
            
            {(propertiesSearch === "" || "status todo".includes(propertiesSearch.toLowerCase())) && (
            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
              <span className="text-zinc-500">Status</span>
              <div className="flex items-center space-x-2 text-zinc-200">
                <span className="w-4 h-4 flex items-center justify-center border-2 border-blue-500 rounded-full" />
                <span>Todo</span>
              </div>
            </div>
            )}

            {(propertiesSearch === "" || "priority medium".includes(propertiesSearch.toLowerCase())) && (
            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
              <span className="text-zinc-500">Priority</span>
              <div className="flex items-center space-x-2 text-zinc-200">
                <div className="w-4 h-4 flex items-center justify-center">
                  <span className="w-3 h-0.5 bg-orange-500" />
                </div>
                <span>Medium</span>
              </div>
            </div>
            )}

            {(propertiesSearch === "" || "labels no labels".includes(propertiesSearch.toLowerCase())) && (
            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
              <span className="text-zinc-500">Labels</span>
              <div className="flex items-center space-x-2 text-zinc-500">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                <span>No labels</span>
              </div>
            </div>
            )}

            {(propertiesSearch === "" || "assignee ceo CE".includes(propertiesSearch.toLowerCase())) && (
            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
              <span className="text-zinc-500">Assignee</span>
              <div className="flex items-center space-x-2 text-zinc-200 hover:bg-zinc-800/50 p-1 -ml-1 rounded cursor-pointer transition-colors group">
                <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-semibold text-zinc-300">
                  CE
                </div>
                <span>CEO</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            )}

            {(propertiesSearch === "" || "project onboarding".includes(propertiesSearch.toLowerCase())) && (
            <div className="grid grid-cols-[100px_1fr] items-center gap-2">
              <span className="text-zinc-500">Project</span>
              <div className="flex items-center space-x-2 text-zinc-200 hover:bg-zinc-800/50 p-1 -ml-1 rounded cursor-pointer transition-colors group">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>Onboarding</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            )}

            <div className="border-t border-zinc-900 my-6 pt-6 space-y-6">
              {(propertiesSearch === "" || "created by me".includes(propertiesSearch.toLowerCase())) && (
              <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                <span className="text-zinc-500">Created by</span>
                <div className="flex items-center space-x-2 text-zinc-300">
                  <User className="w-3.5 h-3.5" />
                  <span>Me</span>
                </div>
              </div>
              )}
              
              {(propertiesSearch === "" || "created apr 14 2026 april".includes(propertiesSearch.toLowerCase())) && (
              <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                <span className="text-zinc-500">Created</span>
                <span className="text-zinc-300">Apr 14, 2026</span>
              </div>
              )}

              {(propertiesSearch === "" || "updated just now".includes(propertiesSearch.toLowerCase())) && (
              <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                <span className="text-zinc-500">Updated</span>
                <span className="text-zinc-300">just now</span>
              </div>
              )}
            </div>

          </div>
        </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full flex-grow bg-[#000000] text-zinc-100 flex flex-col min-h-screen relative font-sans select-none antialiased">
      
      {/* Toast Notification Container */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-[#121214] border border-[#1F2021] text-xs text-[#00ea88] rounded-md px-4 py-3 shadow-2xl flex items-center space-x-2.5 max-w-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-[#00ea88] shrink-0" />
            <span className="font-semibold text-white">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COMPONENT TOP BREADCRUMB HEADER ROW */}
      <div className="h-14 border-b border-[#1F2021] flex items-center justify-between px-6 shrink-0 bg-[#000000]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          {/* Back button */}
          <button 
            onClick={onBack}
            className="p-1 h-7 bg-[#1A1A1E]/40 border border-[#1F2021] rounded-md text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          
          <span className="text-zinc-650 font-mono text-sm leading-none select-none">/</span>
          
          {/* Vercel styled project breadcrumb list with triangle logo */}
          <div className="flex items-center space-x-2 cursor-pointer group hover:opacity-90">
            <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center shrink-0">
              <svg className="w-2.5 h-2.5 text-black fill-current" viewBox="0 0 100 100">
                <polygon points="51,15 91,85 11,85" />
              </svg>
            </div>
            <span className="text-xs font-bold text-white tracking-tight">{company.name.toLowerCase()}</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          </div>

          <span className="text-zinc-650 font-mono text-sm leading-none select-none">/</span>
          
          <div className="px-2 py-0.5 bg-zinc-900 border border-zinc-850 rounded text-[10px] uppercase font-bold font-mono tracking-wider text-zinc-450 flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#00ea88] rounded-full inline-block animate-ping" />
            <span>Ready</span>
          </div>
        </div>

        {/* Right option controls inside project bar */}
        <div className="flex items-center space-x-2.5">
          <div className="text-[10px] font-mono text-zinc-550 mr-1.5 hidden sm:block">
            Last synced: Just Now
          </div>
          <button 
            onClick={() => {
              setIsSimulating(!isSimulating);
              showNotification(isSimulating ? "Simulation paused" : "Simulation active streaming");
            }}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-md border text-xs cursor-pointer transition-colors ${
              isSimulating 
                ? "bg-[#0A2540] border-[#00DB80]/30 text-[#00DB80]"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            {isSimulating ? "● Active Streaming" : "◯ Frozen Standby"}
          </button>
          
          <button 
            onClick={() => showNotification("Deployment settings initialized")}
            className="p-1.5 bg-[#0A0A0A] border border-[#1F2021] text-zinc-450 hover:text-white hover:bg-zinc-900 rounded-md transition-all cursor-pointer"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* PRIMARY VIEWER WINDOW */}
      <div className="flex-grow overflow-y-auto">
        <AnimatePresence mode="wait">
          
          {/* ======================================================== */}
          {/* TAB 1: OVERVIEW TAB (THE PIXEL PERFECT REPLICA OF SCREENSHOT) */}
          {/* ======================================================== */}
          {activeTab === "overview" && (
            <motion.div 
              key="overview-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1350px] mx-auto text-left"
            >
              
              {/* HEADER CAPTION BAR */}
              <div className="font-sans">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-1">
                  Production Deployment
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  Analyze active microservices, monitor real-time edge caches and deployment checklists.
                </p>
              </div>

              {/* CARD A: PRODUCTION DEPLOYMENT CONTAINER */}
              <div className="bg-[#050506] border border-[#1F2021] rounded-lg overflow-hidden flex flex-col shadow-2xl">
                
                {/* inner top header block */}
                <div className="p-4 border-b border-[#1F2021] bg-[#0A0A0B]/80 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00ea88] inline-block animate-pulse" />
                    <span>Production Deployment</span>
                  </span>
                  
                  {/* Action Group Links */}
                  <div className="flex flex-wrap items-center gap-2">
                    <a 
                      href={`https://github.com/abramswalkerx-cell/artifacts-${company.name.toLowerCase()}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 px-3 py-1.5 rounded-md text-[11px] font-bold text-zinc-300 hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Repository</span>
                    </a>
                    
                    <button 
                      onClick={() => showNotification("Initiating instant rollback to previous sandbox node")}
                      className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 px-3 py-1.5 rounded-md text-[11px] font-bold text-zinc-300 hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <History className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Instant Rollback</span>
                    </button>

                    <a
                      href={`https://${company.name.toLowerCase()}.vercel.app`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white hover:bg-zinc-200 text-black px-3 py-1.5 rounded-md text-[11px] font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3 text-zinc-650" />
                    </a>
                  </div>
                </div>

                {/* Card Inner Grid splitting graphic preview vs metadata */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 md:p-6">
                  
                  {/* Left Column: Visual Screen Preview block representing 404 block from screenshot */}
                  <div className="md:col-span-5 flex flex-col justify-center">
                    <div className="bg-white border text-black font-sans rounded border-zinc-200 aspect-[16/10] flex flex-col items-center justify-center p-6 select-none shadow-sm relative overflow-hidden group/screen">
                      
                      {/* Realistic 404 error page matching the screenshot exactly */}
                      <div className="text-center p-4">
                        <h2 className="text-lg font-bold text-black font-sans tracking-tight mb-0.5">404: NOT FOUND</h2>
                        <p className="text-[10px] text-zinc-550 font-mono tracking-tight leading-none mb-1">Code: <span className="font-semibold text-black">NOT_FOUND</span></p>
                        <p className="text-[9px] text-zinc-400 font-mono leading-none mb-4">ID: artifacts-{company.name.toLowerCase()}-o8xxm6uc2-cell</p>
                        
                        <a 
                          href="https://vercel.com/docs" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[9.5px] text-[#3B82F6] font-medium underline block hover:text-blue-700 font-sans"
                        >
                          Read our documentation to learn more about this error.
                        </a>
                      </div>

                      {/* Cool subtle hover label overlay */}
                      <div className="absolute inset-x-0 bottom-0 bg-black/5 hover:bg-black/10 transition-colors h-7 flex items-center justify-center text-[10px] font-mono text-zinc-500 font-medium">
                        Deployment Active Preview
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Deployment Statistics details metadata */}
                  <div className="md:col-span-7 flex flex-col justify-center space-y-4">
                    
                    {/* Stat Item 1: Deployment URL address */}
                    <div className="text-left leading-normal">
                      <span className="text-[11px] uppercase font-bold tracking-wider text-zinc-505 block font-mono">Deployment</span>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <a 
                          href={`https://artifacts-${company.name.toLowerCase()}-o8xxm6uc2-abramswalkerx-cells-projects.vercel.app`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-white hover:text-purple-400 transition-colors break-all truncate font-mono"
                        >
                          artifacts-{company.name.toLowerCase()}-o8xxm6uc2-abramswalkerx-cells-projects.vercel.app
                        </a>
                        
                        {/* Interactive dynamic sparkline svg */}
                        <svg className="w-8 h-4 text-purple-400 shrink-0 inline-block" viewBox="0 0 100 25" fill="none">
                          <motion.path 
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5 }}
                            d="M 0 18 Q 20 8, 40 18 T 80 5 T 100 22" 
                            stroke="currentColor" 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Stat Item 2: Domains */}
                    <div className="text-left leading-normal">
                      <span className="text-[11px] uppercase font-bold tracking-wider text-zinc-505 block font-mono">Domains</span>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <a 
                          href={`https://${company.name.toLowerCase()}.vercel.app`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-[#3B82F6] hover:underline flex items-center gap-1 font-mono"
                        >
                          <span>{company.name.toLowerCase()}.vercel.app</span>
                          <ExternalLink className="w-3 h-3 text-zinc-500" />
                        </a>
                        <button 
                          onClick={() => {
                            setActiveSidebarTab?.("domains");
                            showNotification("Opening domain console routing panel");
                          }}
                          className="p-0.5 hover:text-white text-zinc-500 rounded transition-colors"
                          title="Register Domain Configuration"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Stat Item 3: Status Details */}
                    <div className="text-left leading-normal">
                      <span className="text-[11px] uppercase font-bold tracking-wider text-zinc-505 block font-mono">Status</span>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-[#00ea88] animate-ping shrink-0" />
                        <span className="text-xs font-semibold text-white">Ready</span>
                      </div>
                    </div>

                    {/* Stat Item 4: Creation source avatar */}
                    <div className="text-left leading-normal">
                      <span className="text-[11px] uppercase font-bold tracking-wider text-zinc-505 block font-mono">Created</span>
                      <div className="flex items-center space-x-1.5 mt-0.5 text-xs text-zinc-305">
                        <span>{projectDate} by abramswalker-cell</span>
                        <div className="w-4 h-4 rounded-full bg-purple-900 border border-purple-800 text-purple-200 text-[8px] font-bold flex items-center justify-center font-sans">
                          AW
                        </div>
                      </div>
                    </div>

                    {/* Stat Item 5: Git commit code details */}
                    <div className="text-left leading-normal">
                      <span className="text-[11px] uppercase font-bold tracking-wider text-zinc-505 block font-mono">Source</span>
                      <div className="flex items-center space-x-2 mt-0.5 text-xs">
                        <span className="text-[#888888] font-mono flex items-center gap-1">
                          <svg className="w-3 h-3 text-zinc-650" viewBox="0 0 100 100">
                            <circle cx="30" cy="30" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <circle cx="30" cy="70" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <circle cx="70" cy="30" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <line x1="30" y1="40" x2="30" y2="60" stroke="currentColor" strokeWidth="4" />
                            <path d="M 30 50 Q 70 50 70 40" stroke="currentColor" strokeWidth="4" fill="none" />
                          </svg>
                          <span>main</span>
                        </span>
                        <span className="text-zinc-500 select-none">|</span>
                        <a 
                          href="https://github.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#8043f9] hover:underline flex items-center gap-1 font-mono hover:text-purple-300 transition-colors"
                        >
                          <span className="font-semibold">07ce14b</span>
                          <span className="text-[#888888]">Add files via upload</span>
                        </a>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Bottom line: settings and recommendations link */}
                <div className="border-t border-[#1F2021] bg-[#111113]/30 px-5 py-3.5 flex flex-wrap justify-between items-center text-xs text-zinc-400 gap-3">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => setActiveSidebarTab?.("settings")}
                      className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <span>Deployment Settings</span>
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                    </button>
                    <span className="text-zinc-750 font-mono">|</span>
                    
                    <button 
                      onClick={() => showNotification("Optimizer: Serverless function execution timeouts adjusted to instant response limits.")}
                      className="bg-[#0A2540] text-[#00DB80]/90 border border-[#00DB80]/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono tracking-tight flex items-center space-x-1"
                    >
                      <Zap className="w-3 h-3 text-[#00DB80] animate-bounce shrink-0" />
                      <span>4 Recommendations</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Helper guide sentence beneath cards container */}
              <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500 mt-2 gap-4 pb-2 border-b border-zinc-940">
                <span>To update your Production Deployment, push to the main branch.</span>
                <div className="flex items-center space-x-1.5 bg-zinc-950 px-2 py-1 rounded border border-zinc-900 shrink-0">
                  <span className="font-bold text-zinc-400 text-[10px] uppercase font-mono tracking-wide">Deployment Pipeline</span>
                  <span className="text-[10px] px-1 bg-purple-900/30 text-[#aa82fb] font-semibold rounded">v3</span>
                </div>
              </div>

              {/* ======================================================== */}
              {/* TRIPLE METRICS COLUMN CARD GRID BLOCK */}
              {/* ======================================================== */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                
                {/* CARD 1: PRODUCTION CHECKLIST */}
                <div className="bg-[#050506] border border-[#1F2021] rounded-lg p-5 flex flex-col justify-between shadow-lg relative select-none">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        Production Checklist
                      </span>
                      <span className="text-[10px] font-bold text-purple-400 font-mono bg-purple-950/20 px-2 py-0.5 rounded-full border border-purple-800/30">
                        {Object.values(checklistProgress).filter(Boolean).length} / 5
                      </span>
                    </div>

                    <div className="space-y-2 text-left">
                      {/* checklist button 1 */}
                      <button 
                        onClick={() => {
                          setChecklistProgress(p => ({ ...p, gitConnected: !p.gitConnected }));
                          showNotification("Git Connection preference saved");
                        }}
                        className={`w-full text-xs font-medium py-2 px-3 rounded-md flex items-center justify-between border cursor-pointer transition-all ${
                          checklistProgress.gitConnected 
                            ? "bg-[#091E3A] border-[#3B82F6]/30 text-white" 
                            : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">Connect Git Repository</span>
                        {checklistProgress.gitConnected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                      </button>

                      {/* checklist button 2 */}
                      <button 
                        onClick={() => {
                          setChecklistProgress(p => ({ ...p, customDomain: !p.customDomain }));
                          showNotification(checklistProgress.customDomain ? "Custom domain deactivated" : "Custom domain authenticated");
                        }}
                        className={`w-full text-xs font-medium py-2 px-3 rounded-md flex items-center justify-between border cursor-pointer transition-all ${
                          checklistProgress.customDomain 
                            ? "bg-[#091E3A] border-[#3B82F6]/30 text-white" 
                            : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <span>Add Custom Domain</span>
                        {checklistProgress.customDomain && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                      </button>

                      {/* checklist button 3 */}
                      <button 
                        onClick={() => {
                          setChecklistProgress(p => ({ ...p, previewEnabled: !p.previewEnabled }));
                          showNotification("Client UI deployment preview toggle saved");
                        }}
                        className={`w-full text-xs font-medium py-2 px-3 rounded-md flex items-center justify-between border cursor-pointer transition-all ${
                          checklistProgress.previewEnabled 
                            ? "bg-[#091E3A] border-[#3B82F6]/30 text-white" 
                            : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <span>Preview Deployment</span>
                        {checklistProgress.previewEnabled && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                      </button>

                      {/* checklist button 4 */}
                      <button 
                        onClick={() => {
                          setChecklistProgress(p => ({ ...p, analyticsEnabled: !p.analyticsEnabled }));
                          showNotification(checklistProgress.analyticsEnabled ? "Real-time crawler tracing paused" : "Edge analytics crawler live trace enabled!");
                        }}
                        className={`w-full text-xs font-medium py-2 px-3 rounded-md flex items-center justify-between border cursor-pointer transition-all ${
                          checklistProgress.analyticsEnabled 
                            ? "bg-[#091E3A] border-[#3B82F6]/30 text-white" 
                            : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <span>Enable Web Analytics</span>
                        {checklistProgress.analyticsEnabled && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                      </button>

                      {/* checklist button 5 */}
                      <button 
                        onClick={() => {
                          setChecklistProgress(p => ({ ...p, speedInsights: !p.speedInsights }));
                          showNotification("FCP Diagnostic metrics enabled on edge nodes");
                        }}
                        className={`w-full text-xs font-medium py-2 px-3 rounded-md flex items-center justify-between border cursor-pointer transition-all ${
                          checklistProgress.speedInsights 
                            ? "bg-[#091E3A] border-[#3B82F6]/30 text-white" 
                            : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <span>Enable Speed Insights</span>
                        {checklistProgress.speedInsights && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                      </button>

                    </div>
                  </div>
                  <div className="absolute top-4 right-4 text-zinc-650">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* CARD 2: OBSERVABILITY WIDGET MATCHING SCREENSHOT */}
                <div 
                  onClick={() => setActiveSidebarTab?.("observability")}
                  className="bg-[#050506] border border-[#1F2021] rounded-lg p-5 flex flex-col justify-between shadow-lg relative cursor-pointer group hover:border-zinc-750 transition-all select-none text-left"
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        Observability <span className="text-zinc-600 font-normal">6h</span>
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-zinc-550 group-hover:text-white transition-colors shrink-0" />
                    </div>

                    <div className="space-y-4">
                      {/* item 1: Edge Requests volume gauge */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-end">
                          <span className="text-[11px] text-zinc-405 block">Edge Requests</span>
                          <span className="text-xs font-bold text-white font-mono">4</span>
                        </div>
                        {/* Interactive glow high fidelity sparkline representing request spike */}
                        <div className="h-6 w-full relative">
                          <svg className="w-full h-full text-blue-500 fill-none" viewBox="0 0 160 30" preserveAspectRatio="none">
                            <line x1="0" y1="28" x2="160" y2="28" stroke="#1F2021" strokeWidth="1" />
                            <path 
                              d="M 0,26 L 30,26 L 60,26 L 75,26 L 90,4 L 105,26 L 130,26 L 160,26" 
                              stroke="currentColor" 
                              strokeWidth="2.5" 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                            />
                            {/* Blue shadow backdrop glow representation */}
                            <path 
                              d="M 0,26 L 30,26 L 60,26 L 75,26 L 90,4 L 105,26 L 130,26 L 160,26 L 160,28 L 0,28 Z" 
                              fill="rgba(59, 130, 246, 0.05)" 
                            />
                          </svg>
                        </div>
                      </div>

                      {/* item 2: CPU invocations graph */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-end">
                          <span className="text-[11px] text-zinc-405 block">Function Invocations</span>
                          <span className="text-xs font-bold text-white font-mono">0</span>
                        </div>
                        <div className="h-5 w-full relative">
                          <svg className="w-full h-full text-zinc-650 fill-none" viewBox="0 0 160 30" preserveAspectRatio="none">
                            <line x1="0" y1="28" x2="160" y2="28" stroke="#1F2021" strokeWidth="1" />
                            <path d="M 0,26 L 160,26" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        </div>
                      </div>

                      {/* item 3: Error Rate text */}
                      <div className="flex justify-between items-center text-xs pt-1 border-t border-zinc-940">
                        <span className="text-zinc-450 text-[11px]">Error Rate</span>
                        <span className="font-mono font-bold text-zinc-300">0%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CARD 3: ANALYTICS HOLLOW CARD BLOCK */}
                <div 
                  onClick={() => setActiveSidebarTab?.("analytics")}
                  className="bg-[#050506] border border-[#1F2021] rounded-lg p-5 flex flex-col justify-between shadow-lg relative cursor-pointer group hover:border-zinc-750 transition-all select-none text-center"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Analytics
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-550 group-hover:text-white transition-colors shrink-0" />
                  </div>

                  {/* Centered screen mockup visualizer empty state */}
                  <div className="py-2 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-lg border border-zinc-850 bg-[#0A0A0B] flex items-center justify-center mb-3 group-hover:border-zinc-700 transition-colors">
                      <TrendingUp className="w-4 h-4 text-zinc-500 group-hover:text-purple-400 transition-colors" />
                    </div>

                    <h4 className="text-[11px] font-bold text-white tracking-tight">Track Visitors & Conversions</h4>
                    <p className="text-[10px] text-zinc-500 leading-normal max-w-sm mt-1 px-3">
                      Monitor organic page views, dynamic ad conversion logs, and revenue scaling in detail.
                    </p>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSidebarTab?.("analytics");
                        showNotification("Routing to active outreach and ad analytics");
                      }}
                      className="mt-4 px-4 py-1 bg-zinc-950 hover:bg-zinc-90 w-full text-[11px] text-white font-semibold border border-zinc-850 hover:border-zinc-700 rounded-md transition-all cursor-pointer"
                    >
                      Enable Analytics
                    </button>
                  </div>
                </div>

              </div>

              {/* ACTIVE BRANCHES ROW AT THE CONTAINER BOTTOM */}
              <div className="space-y-3 pt-4 text-left">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Active Branches
                </h3>
                
                {/* Dotted border container representing empty branch commits */}
                <div className="bg-[#050506] border border-dashed border-[#1F2021] rounded-lg p-16 flex flex-col items-center justify-center text-center">
                  <div className="w-8 h-8 rounded-full border border-zinc-850 bg-zinc-950 flex items-center justify-center text-zinc-650 mb-3 leading-none font-mono">
                    b
                  </div>
                  
                  <h4 className="text-xs font-bold text-white">No Active Branches Found</h4>
                  <p className="text-[11px] text-[#888888] mt-1 pr-1 pl-1 max-w-xs leading-relaxed">
                    Commit of dynamic code schemas using our connected Git integrations will expose automated scaling branch preview nodes here.
                  </p>
                </div>
              </div>

            </motion.div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: DEVELOPER / DEPLOYMENTS */}
          {/* ======================================================== */}
          {activeTab === "deployments" && (
            <motion.div 
              key="developer-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 md:p-8 space-y-6 text-left max-w-5xl mx-auto"
            >
              <h2 className="text-xl font-bold text-white select-text">PostgreSQL Database Schema & Landing Code</h2>
              <p className="text-xs text-zinc-400">Deploy dynamic database schemas and review cached React codebase compiler structures.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Config column */}
                <div className="bg-[#050506] border border-[#1F2021] p-5 rounded-lg space-y-4">
                  <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-purple-400">Dev Stack Configuration</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {company.developer.techStack.map((tech, idx) => (
                      <span key={idx} className="bg-zinc-950 border border-zinc-900 text-[10px] text-white font-mono px-2 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-zinc-900 leading-normal">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono block">Connected Repo URL</span>
                    <a 
                      href={`https://${company.developer.repoName}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-[#3B82F6] hover:underline font-mono truncate block mt-0.5"
                    >
                      {company.developer.repoName}
                    </a>
                  </div>
                </div>

                {/* postgres code column */}
                <div className="bg-[#050506] border border-[#1F2021] p-5 rounded-lg md:col-span-2 space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                    <span className="text-xs font-bold text-white">PostgreSQL Migrations Schema</span>
                    <span className="text-[10.5px] font-mono text-zinc-500">pg_schema.sql</span>
                  </div>
                  
                  <div className="bg-[#0A0A0C] border border-zinc-950 rounded-md p-4 font-mono text-[11px] text-[#00ea88] overflow-x-auto whitespace-pre select-all">
                    {company.developer.schema}
                  </div>
                </div>

              </div>

              {/* react source block */}
              <div className="bg-[#050506] border border-[#1F2021] p-5 rounded-lg space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                  <span className="text-xs font-bold text-white">Interactive Client Landing UI Code</span>
                  <span className="text-[10px] font-mono text-purple-400">components/AppLanding.tsx</span>
                </div>
                
                <div className="bg-[#0A0A0C] border border-zinc-950 rounded-md p-5 font-mono text-[11px] text-zinc-350 overflow-x-auto whitespace-pre leading-relaxed select-all max-h-[400px]">
                  {company.developer.code}
                </div>
              </div>

            </motion.div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: LOGS TERMINAL */}
          {/* ======================================================== */}
          {activeTab === "logs" && (
            <motion.div 
              key="logs-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 md:p-8 space-y-6 text-left max-w-5xl mx-auto"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-zinc-900 pb-4 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Live Event Telemetry Log</h2>
                  <p className="text-xs text-zinc-400">Autonomous scheduler processing updates live. Sandbox compilation server active on port 3000.</p>
                </div>
                <button 
                  onClick={() => {
                    setConsoleLogs([{ timestamp: new Date().toLocaleTimeString(), agent: "Planner", text: "Runtime caches cleared. Reconnecting main sandbox clusters.", level: "info" }]);
                    showNotification("Dynamic logs buffer cleared");
                  }}
                  className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white rounded border border-zinc-800 transition-colors self-start cursor-pointer"
                >
                  Purge Logs Console
                </button>
              </div>

              {/* Realistic Terminal View */}
              <div className="bg-[#050506] border border-[#1F2021] p-6 rounded-lg shadow-2xl flex flex-col">
                <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-zinc-900 text-xs font-mono text-zinc-550">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span>runtime@vercel-sandbox-cluster.sh</span>
                  <span className="text-zinc-750">|</span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#00ea88] rounded-full animate-pulse" />
                    <span>Edge streaming live</span>
                  </span>
                </div>

                <div className="bg-[#010102] rounded border border-zinc-950 p-4 h-96 overflow-y-auto font-mono text-[11px] space-y-2.5 scrollbar text-left">
                  {consoleLogs.map((log, lIdx) => {
                    let badgeColor = "text-blue-400 bg-blue-500/10 border-blue-500/20";
                    if (log.agent === "Planner") badgeColor = "text-purple-400 bg-purple-500/10 border-purple-500/20";
                    if (log.agent === "Developer") badgeColor = "text-[#00ea88] bg-emerald-500/10 border-emerald-500/20";
                    if (log.agent === "Ads") badgeColor = "text-amber-400 bg-amber-500/10 border-amber-500/20";
                    if (log.agent === "Support") badgeColor = "text-pink-400 bg-pink-500/10 border-pink-500/20";
                    
                    return (
                      <div key={lIdx} className="flex items-start space-x-2.5 pb-2 border-b border-zinc-900/30">
                        <span className="text-zinc-600 font-mono text-[10px] select-none shrink-0 pt-0.5">{log.timestamp}</span>
                        <span className={`text-[9.5px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border font-mono shrink-0 ${badgeColor}`}>
                          {log.agent}
                        </span>
                        <p className="text-zinc-300 font-mono break-all leading-normal select-text">{log.text}</p>
                      </div>
                    );
                  })}
                  <div ref={logsEndRef} />
                </div>
              </div>

            </motion.div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: ANALYTICS & ADS OUTREACH */}
          {/* ======================================================== */}
          {activeTab === "analytics" && (
            <motion.div 
              key="analytics-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 md:p-8 space-y-6 text-left max-w-5xl mx-auto"
            >
              <h2 className="text-xl font-bold text-white">Dynamic Audience Marketing & Ads Analytics</h2>
              <p className="text-xs text-zinc-400 font-sans">Audit real ad platform budgets and lead outreach sequences automatically routed via social algorithms.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* persona */}
                <div className="bg-[#050506] border border-[#1F2021] p-5 rounded-lg space-y-3">
                  <span className="text-[10px] font-bold font-mono tracking-widest text-[#aa82fb] block uppercase">Target Audience Persona</span>
                  <p className="text-xs text-zinc-300 leading-relaxed bg-[#0A0A0C] p-3.5 rounded border border-zinc-950 font-sans">
                    {company.ads.audienceProfile}
                  </p>
                </div>

                {/* Email Template */}
                <div className="bg-[#050506] border border-[#1F2021] p-5 rounded-lg md:col-span-2 space-y-3">
                  <span className="text-[10px] font-bold font-mono tracking-widest text-zinc-400 block uppercase">Inbound Outreach sequence</span>
                  <div className="bg-[#0A0A0C] p-4 rounded border border-zinc-950 text-xs text-zinc-300 leading-relaxed space-y-2">
                    <p><span className="text-zinc-550 font-mono">Subject:</span> <span className="font-semibold text-white">{company.outreach.emailSubject}</span></p>
                    <div className="border-t border-zinc-900 pt-2 mt-2 font-serif text-zinc-350">
                      {company.outreach.emailBody}
                    </div>
                  </div>
                </div>

              </div>

              {/* Lists table */}
              <div className="bg-[#050506] border border-[#1F2021] p-5 rounded-lg space-y-3">
                <span className="text-xs font-bold text-white block pb-1 border-b border-zinc-904">Customer Prospect Lead pipeline</span>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-zinc-500 border-b border-zinc-900 font-mono">
                        <th className="py-2">Lead Enterprise</th>
                        <th className="py-2">Key Decision Maker</th>
                        <th className="py-2">Contract Pipeline Value</th>
                        <th className="py-2 text-right">Outreach Sequence Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/60">
                      {company.outreach.leads.map((lead, idx) => (
                        <tr key={idx} className="hover:bg-zinc-950">
                          <td className="py-2.5 font-bold text-white">{lead.companyName}</td>
                          <td className="py-2.5 text-zinc-400">{lead.contactName} ({lead.role})</td>
                          <td className="py-2.5 font-mono text-purple-400 font-semibold">{lead.estimatedContractValue}</td>
                          <td className="py-2.5 text-right">
                            <span className="inline-block text-[9px] font-mono uppercase bg-emerald-500/10 border border-emerald-500/20 text-[#00ea88] px-2 py-0.5 rounded">
                              {lead.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </motion.div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: SPEED INSIGHTS */}
          {/* ======================================================== */}
          {activeTab === "speed-insights" && (
            <motion.div 
              key="speed-insights-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 md:p-8 space-y-6 text-left max-w-5xl mx-auto"
            >
              <h2 className="text-xl font-bold text-white">Speed Insights Diagnostics</h2>
              <p className="text-xs text-zinc-400">Perform sub-millisecond network checks on active main branch servers.</p>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                
                {/* Score panel FCP */}
                <div className="bg-[#050506] border border-[#1F2021] p-5 rounded-lg text-center space-y-2">
                  <span className="text-[10px] font-bold font-mono text-zinc-500 uppercase">First Contentful Paint</span>
                  <h3 className="text-3xl font-bold text-[#00ea88] font-mono">0.3s</h3>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold block">Excellent</span>
                </div>

                {/* Score LCP */}
                <div className="bg-[#050506] border border-[#1F2021] p-5 rounded-lg text-center space-y-2">
                  <span className="text-[10px] font-bold font-mono text-zinc-500 uppercase">Largest Contentful Paint</span>
                  <h3 className="text-3xl font-bold text-[#00ea88] font-mono">0.6s</h3>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold block">Excellent</span>
                </div>

                {/* score TBT */}
                <div className="bg-[#050506] border border-[#1F2021] p-5 rounded-lg text-center space-y-2">
                  <span className="text-[10px] font-bold font-mono text-zinc-500 uppercase">Total Blocking Time</span>
                  <h3 className="text-3xl font-bold text-[#00ea88] font-mono">15ms</h3>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold block">Excellent</span>
                </div>

                {/* Score CLS */}
                <div className="bg-[#050506] border border-[#1F2021] p-5 rounded-lg text-center space-y-2">
                  <span className="text-[10px] font-bold font-mono text-zinc-500 uppercase">Cumulative Layout Shift</span>
                  <h3 className="text-3xl font-bold text-[#00ea88] font-mono">0.01</h3>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold block">Excellent</span>
                </div>

              </div>
              
              <div className="bg-[#050506] border border-[#1F2021] p-6 rounded-lg text-center py-16 text-zinc-500 space-y-3">
                <p className="text-xs">All metric parameters satisfy speed limits set by the Chrome UX Report algorithms.</p>
                <button 
                  onClick={() => showNotification("Performed fresh edge metric diagnostic checks")}
                  className="px-4 py-1.5 bg-zinc-950 text-white font-semibold border border-zinc-855 rounded-md text-xs cursor-pointer hover:bg-zinc-900 transition-colors inline-flex items-center space-x-1"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Re-run Diagnostics</span>
                </button>
              </div>

            </motion.div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: OBSERVABILITY PERFORMANCE */}
          {/* ======================================================== */}
          {activeTab === "observability" && (
            <motion.div 
              key="observability-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 md:p-8 space-y-6 text-left max-w-5xl mx-auto"
            >
              <h2 className="text-xl font-bold text-white">Full Observability Metrics</h2>
              <p className="text-xs text-zinc-400">Review edge execution quotas, serverless latencies and logs databases anomalies.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* graph block Edge request */}
                <div className="bg-[#050506] border border-[#1F2021] p-5 rounded-lg space-y-4">
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Edge Requests Scaling</span>
                  <div className="h-44 bg-[#0A0A0C] border border-zinc-950 p-4 rounded flex items-center justify-center relative">
                    <svg className="w-full h-full text-purple-500 fill-none" viewBox="0 0 300 100" preserveAspectRatio="none">
                      <line x1="0" y1="90" x2="300" y2="90" stroke="#1F2021" />
                      <path d="M 0,80 L 50,80 L 100,50 L 150,85 L 200,80 L 250,5 L 300,75" stroke="currentColor" strokeWidth="2.5" />
                      <circle cx="250" cy="5" r="4.5" fill="purple" />
                    </svg>
                    <span className="absolute top-2 right-2 text-[10px] font-mono text-zinc-500">Max Peak: 88reqs</span>
                  </div>
                </div>

                {/* Metric Anomalies */}
                <div className="bg-[#050506] border border-[#1F2021] p-5 rounded-lg space-y-4">
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Real-time Sandbox Anomalies</span>
                  
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    <div className="p-3 bg-zinc-950/60 rounded border border-zinc-900 text-xs flex items-center justify-between text-zinc-400">
                      <span>Port 3000 Ingress Verification</span>
                      <span className="text-[#00ea88] font-mono uppercase bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Success</span>
                    </div>
                    <div className="p-3 bg-zinc-950/60 rounded border border-zinc-900 text-xs flex items-center justify-between text-zinc-400">
                      <span>Serverless Function Cold-starts</span>
                      <span className="text-[#00ea88] font-mono uppercase bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">0 instances</span>
                    </div>
                    <div className="p-3 bg-zinc-950/60 rounded border border-zinc-900 text-xs flex items-center justify-between text-zinc-450">
                      <span>SSL handshake expiry check</span>
                      <span className="text-purple-400 font-mono">Infinite Days</span>
                    </div>
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: ENVIRONMENT VARIABLES */}
          {/* ======================================================== */}
          {activeTab === "env-variables" && (
            <motion.div 
              key="env-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 md:p-8 space-y-6 text-left max-w-5xl mx-auto"
            >
              <h2 className="text-xl font-bold text-white">Environment Variables Config</h2>
              <p className="text-xs text-zinc-400">Keys specified here will be parsed and injected into the dynamic Node sandbox runtime environment upon compilation.</p>

              {/* add variables form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newEnvKey.trim() || !newEnvVal.trim()) return;
                  setEnvVars(prev => [...prev, { key: newEnvKey.trim(), value: newEnvVal }]);
                  showNotification(`Added local env variable: ${newEnvKey.trim()}`);
                  setNewEnvKey("");
                  setNewEnvVal("");
                }}
                className="bg-[#050506] border border-[#1F2021] p-4 rounded-lg flex flex-col sm:flex-row gap-3 items-end"
              >
                <div className="space-y-1 text-left w-full">
                  <label className="text-[10px] font-bold font-mono text-zinc-450 uppercase">Variable Key Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. STRIPE_SECRET_KEY"
                    value={newEnvKey}
                    onChange={(e) => setNewEnvKey(e.target.value)}
                    className="w-full bg-[#0E0E10] border border-zinc-900 rounded-md p-2 text-xs text-white placeholder-zinc-650 outline-none focus:border-zinc-750"
                  />
                </div>
                <div className="space-y-1 text-left w-full">
                  <label className="text-[10px] font-bold font-mono text-zinc-450 uppercase">Value payload</label>
                  <input 
                    type="text" 
                    placeholder="SECRET_VALUE"
                    value={newEnvVal}
                    onChange={(e) => setNewEnvVal(e.target.value)}
                    className="w-full bg-[#0E0E10] border border-zinc-900 rounded-md p-2 text-xs text-white placeholder-zinc-650 outline-none focus:border-zinc-750"
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-white hover:bg-zinc-200 text-black text-xs font-bold px-4 py-2.5 rounded-md flex items-center justify-center shrink-0 h-9 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Variable</span>
                </button>
              </form>

              {/* listings */}
              <div className="bg-[#050506] border border-[#1F2021] p-5 rounded-lg space-y-3">
                <span className="text-xs font-bold text-white block pb-1 border-b border-zinc-900">Configured variables ({envVars.length})</span>
                
                <div className="space-y-2">
                  {envVars.map((item, idx) => (
                    <div key={idx} className="p-3 bg-zinc-950 rounded border border-zinc-900 flex justify-between items-center text-xs">
                      <div className="text-left font-mono">
                        <span className="text-white font-bold block">{item.key}</span>
                        <span className="text-zinc-550 block mt-0.5 break-all max-w-xl">{item.value}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setEnvVars(prev => prev.filter((_, i) => i !== idx));
                          showNotification(`Removed variable: ${item.key}`);
                        }}
                        className="p-1 text-zinc-500 hover:text-red-400 rounded transition-colors"
                        title="Delete parameter"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

          {/* ======================================================== */}
          {/* TAB 8: REGIONS & DOMAINS */}
          {/* ======================================================== */}
          {activeTab === "domains" && (
            <motion.div 
              key="domains-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 md:p-8 space-y-6 text-left max-w-5xl mx-auto"
            >
              <h2 className="text-xl font-bold text-white">Registered Domains</h2>
              <p className="text-xs text-zinc-400">Setup dynamic alias headers resolving to your SSL certified edge servers of development nodes.</p>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newDomainInput.trim()) return;
                  setDomainsList(prev => [...prev, { name: newDomainInput.trim(), status: "Valid Configuration", type: "Custom" }]);
                  showNotification(`Added domain routing: ${newDomainInput.trim()}`);
                  setNewDomainInput("");
                }}
                className="bg-[#050506] border border-[#1F2021] p-4 rounded-lg flex gap-3 h-14"
              >
                <input 
                  type="text" 
                  placeholder="e.g. app.mybusiness.com"
                  value={newDomainInput}
                  onChange={(e) => setNewDomainInput(e.target.value)}
                  className="flex-grow bg-[#0E0E10] border border-zinc-900 rounded-md px-3 text-xs text-white placeholder-zinc-650 outline-none focus:border-zinc-750"
                />
                <button 
                  type="submit"
                  className="bg-white hover:bg-zinc-200 text-black px-4 py-1.5 text-xs font-bold rounded-md flex items-center space-x-1 shrink-0 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register Domain</span>
                </button>
              </form>

              <div className="bg-[#050506] border border-[#1F2021] p-5 rounded-lg space-y-3">
                <span className="text-xs font-bold text-white block pb-1 border-b border-zinc-900">Configured Domains</span>
                
                <div className="space-y-2">
                  {domainsList.map((dom, idx) => (
                    <div key={idx} className="p-3 bg-zinc-950 rounded border border-zinc-900 flex justify-between items-center text-xs">
                      <div className="text-left font-mono">
                        <span className="text-white font-bold block">{dom.name}</span>
                        <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider mt-0.5">{dom.type} Domain</span>
                      </div>
                      <span className="text-[#00ea88] font-mono text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase font-bold">
                        {dom.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

          {/* ======================================================== */}
          {/* TAB 9: INTEGRATIONS / COOPERATIONS */}
          {/* ======================================================== */}
          {activeTab === "integrations" && (
            <motion.div 
              key="integrations-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 md:p-8 space-y-6 text-left max-w-5xl mx-auto"
            >
              <h2 className="text-xl font-bold text-white">Cloud Workspace Integrations</h2>
              <p className="text-xs text-zinc-400">Connect third-party databases, search vectors, and LLM providers instantly.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Neon DB */}
                <div className="bg-[#050506] border border-[#1F2021] p-5 rounded-lg flex flex-col justify-between h-40">
                  <div className="text-left space-y-1">
                    <span className="text-[10px] font-bold text-purple-400 uppercase font-mono tracking-wider block">Database Storage</span>
                    <h3 className="text-sm font-bold text-white">Neon Serverless SQL</h3>
                    <p className="text-[11px] text-zinc-500 leading-normal">Connect serverless postgres with native edge driver capabilities.</p>
                  </div>
                  <button 
                    onClick={() => showNotification("Connected Serverless Neon Database")}
                    className="w-full py-1 bg-[#1A1A1E] text-white hover:bg-zinc-800 rounded border border-zinc-850 text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    Connect Sandbox DB
                  </button>
                </div>

                {/* Resend */}
                <div className="bg-[#050506] border border-[#1F2021] p-5 rounded-lg flex flex-col justify-between h-40">
                  <div className="text-left space-y-1">
                    <span className="text-[10px] font-bold text-purple-400 uppercase font-mono tracking-wider block">Email Delivery</span>
                    <h3 className="text-sm font-bold text-white">Resend SMTP Edge</h3>
                    <p className="text-[11px] text-zinc-500 leading-normal">Deliver automated cold-outreach templates beautifully.</p>
                  </div>
                  <button 
                    onClick={() => showNotification("Resend connected for outreach automation email campaigns!")}
                    className="w-full py-1 bg-[#1A1A1E] text-white hover:bg-zinc-805 rounded border border-zinc-850 text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    Link Integration
                  </button>
                </div>

                {/* Stripe */}
                <div className="bg-[#050506] border border-[#1F2021] p-5 rounded-lg flex flex-col justify-between h-40">
                  <div className="text-left space-y-1">
                    <span className="text-[10px] font-bold text-purple-400 uppercase font-mono tracking-wider block">Ledger Payments</span>
                    <h3 className="text-sm font-bold text-white">Stripe Subscriptions</h3>
                    <p className="text-[11px] text-zinc-500 leading-normal">Verify ledger payouts and automate invoice generations online.</p>
                  </div>
                  <button 
                    onClick={() => showNotification("Linked Stripe subscriptions ledger account.")}
                    className="w-full py-1 bg-white text-black text-[11px] font-bold rounded hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    Link Payments Account
                  </button>
                </div>

              </div>

            </motion.div>
          )}

          {/* ======================================================== */}
          {/* TAB 10: STORAGE / SQL */}
          {/* ======================================================== */}
          {activeTab === "storage" && (
            <motion.div 
              key="storage-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 md:p-8 space-y-6 text-left max-w-5xl mx-auto"
            >
              <h2 className="text-xl font-bold text-white">SQL Storage Sandbox</h2>
              <p className="text-xs text-zinc-400 font-sans">Verify local schemas, index structures, and execute raw SQL queries on the autopilot database.</p>

              <div className="bg-[#050506] p-5 rounded-lg border border-[#1F2021] space-y-3 leading-normal">
                <span className="text-xs font-bold text-white block pb-1 border-b border-zinc-900">PostgreSQL Schema Compiler Reference</span>
                <div className="bg-[#0A0A0C] border border-zinc-950 p-4 rounded font-mono text-[11px] text-[#00ea88] overflow-x-auto whitespace-pre leading-relaxed select-all">
                  {company.developer.schema}
                </div>
              </div>

            </motion.div>
          )}

          {/* ======================================================== */}
          {/* TAB 11: A/B TESTING FEATURES FLAGS */}
          {/* ======================================================== */}
          {activeTab === "flags" && (
            <motion.div 
              key="flags-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 md:p-8 space-y-6 text-left max-w-5xl mx-auto"
            >
              <h2 className="text-xl font-bold text-white">A/B Testing Feature Flags</h2>
              <p className="text-xs text-zinc-400">Toggle active code variants in production dynamically without redeploying main assets branch.</p>

              <div className="space-y-3">
                {featureFlags.map((flag, idx) => (
                  <div key={idx} className="bg-[#050506] p-4 rounded-lg border border-[#1F2021] flex justify-between items-center text-xs">
                    <div className="text-left space-y-0.5 max-w-xl">
                      <span className="text-white font-bold block font-mono text-sm">{flag.key}</span>
                      <p className="text-zinc-[#888888] font-sans text-xs leading-normal">{flag.desc}</p>
                    </div>
                    
                    {/* Toggle Button layout */}
                    <button 
                      onClick={() => {
                        const updated = [...featureFlags];
                        updated[idx].enabled = !updated[idx].enabled;
                        setFeatureFlags(updated);
                        showNotification(`Feature flag ${flag.key} turned ${updated[idx].enabled ? "ON" : "OFF"}`);
                      }}
                      className={`w-12 h-6 rounded-full p-1 pr-1 cursor-pointer transition-colors shrink-0 flex items-center ${
                        flag.enabled ? "bg-purple-600 justify-end" : "bg-zinc-800 justify-start"
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-white block shadow-sm" />
                    </button>
                  </div>
                ))}
              </div>

            </motion.div>
          )}

          {/* ======================================================== */}
          {/* TAB 12: CORE AI COGNITIVE AGENT */}
          {/* ======================================================== */}
          {activeTab === "agent" && (
            <motion.div 
              key="agent-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 md:p-8 space-y-6 text-left max-w-5xl mx-auto"
            >
              <h2 className="text-xl font-bold text-white select-text">Polsia Planner Agent Core Cognition</h2>
              <p className="text-xs text-zinc-400 font-sans">Review dynamic business roadmaps, market fit logs and analytical value proposition statements generated live.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Val Prop */}
                <div className="bg-[#050506] border border-[#1F2021] p-5 rounded-lg space-y-2">
                  <span className="text-[10px] font-bold font-mono text-purple-400 uppercase tracking-widest block">Value Proposition statement</span>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans mt-1 bg-zinc-950 p-4 rounded border border-zinc-900">
                    {company.planner.valueProp}
                  </p>
                </div>

                {/* Timeline roadmap */}
                <div className="bg-[#050506] border border-[#1F2021] p-5 rounded-lg md:col-span-2 space-y-4">
                  <span className="text-xs font-bold text-white block pb-1 border-b border-zinc-900 font-mono">Automated Roadmap timeline</span>
                  
                  <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-3 before:w-px before:bg-zinc-800">
                    {company.planner.roadmap.map((stage, idx) => {
                      const completed = stage.status === "completed";
                      const active = stage.status === "in-progress";

                      return (
                        <div key={idx} className="pl-8 relative text-xs">
                          <div className="absolute left-1.5 top-0 flex items-center justify-center -translate-x-1/2">
                            {completed ? (
                              <div className="w-4 h-4 bg-[#00ea88] rounded-full flex items-center justify-center text-black font-extrabold text-[10px]">
                                ✓
                              </div>
                            ) : active ? (
                              <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center text-white text-[10px] animate-pulse">
                                ●
                              </div>
                            ) : (
                              <div className="w-4 h-4 bg-zinc-900 border border-zinc-750 rounded-full" />
                            )}
                          </div>

                          <div className="text-left space-y-0.5">
                            <span className="text-[9px] font-mono tracking-widest uppercase text-zinc-550 mr-2">{stage.phase}</span>
                            <span className={`text-[9px] px-1 font-mono uppercase rounded ${
                              completed ? "bg-emerald-900/30 text-emerald-400" :
                              active ? "bg-purple-900/30 text-purple-305" : "bg-zinc-900 text-zinc-450"
                            }`}>{stage.status}</span>
                            <h4 className="text-sm font-bold text-white leading-normal mt-0.5">{stage.title}</h4>
                            <p className="text-zinc-[#888888] text-[11px] font-sans leading-normal">{stage.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* ======================================================== */}
          {/* TAB 13: BACKEND WORKFLOWS */}
          {/* ======================================================== */}
          {activeTab === "workflows" && (
            <motion.div 
              key="workflows-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 md:p-8 space-y-6 text-left max-w-5xl mx-auto"
            >
              <h2 className="text-xl font-bold text-white">Back-office Orchestration workflows</h2>
              <p className="text-xs text-zinc-400">Manage scheduler agents triggers running periodic microservices execution handshakes.</p>

              <div className="space-y-3">
                <div className="bg-[#050506] border border-[#1F2021] p-4 rounded-lg flex justify-between items-center text-xs">
                  <div className="text-left space-y-0.5 font-mono">
                    <span className="text-white font-bold block">Marketer Outreach cron (weekly)</span>
                    <span className="text-zinc-500 block">Trigger: every Sunday at 00:00 UTC</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-990/30 border border-emerald-500/20 text-[#00ea88] font-mono rounded">Active</span>
                </div>

                <div className="bg-[#050506] border border-[#1F2021] p-4 rounded-lg flex justify-between items-center text-xs">
                  <div className="text-left space-y-0.5 font-mono">
                    <span className="text-white font-bold block">Ads Budget Optimizer node (hourly)</span>
                    <span className="text-zinc-500 block">Trigger: hourly at top of hour</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-990/30 border border-emerald-500/20 text-[#00ea88] font-mono rounded">Active</span>
                </div>
              </div>

            </motion.div>
          )}

          {/* ======================================================== */}
          {/* TAB 14: CUSTOMER SUPPORT CHAT TICKETS SIMULATOR */}
          {/* ======================================================== */}
          {activeTab === "support" && (
            <motion.div 
              key="support-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 md:p-8 space-y-6 text-left max-w-5xl mx-auto"
            >
              <h2 className="text-xl font-bold text-white">Customer Support ticketing & Commands Console</h2>
              <p className="text-xs text-zinc-400">Interact with the smart support agent. Issue direct operational codes to re-route billing sequences manually.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* FAQs */}
                <div className="bg-[#050506] p-5 rounded-lg border border-[#1F2021] space-y-4">
                  <span className="text-xs font-bold text-white block pb-1 border-b border-zinc-900 font-mono">Autopilot FAQ database</span>
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {company.support.faqs.map((faq, idx) => (
                      <div key={idx} className="p-3 bg-zinc-950 rounded border border-zinc-900 leading-normal space-y-1 text-xs text-left">
                        <span className="text-white font-semibold block">Q: {faq.question}</span>
                        <p className="text-zinc-400">A: {faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ticket simulator */}
                <div className="bg-[#050506] p-5 rounded-lg border border-[#1F2021] md:col-span-2 flex flex-col justify-between h-[450px]">
                  <div>
                    <span className="text-xs font-bold text-white block pb-2 border-b border-zinc-900 font-mono">Active Support Simulator Ticket #205</span>
                    
                    {/* Chat dialog bubble lists */}
                    <div className="space-y-3.5 h-64 overflow-y-auto pr-1 pt-3">
                      {supportTickets.map((t, idx) => {
                        const cust = t.sender === "customer";
                        return (
                          <div key={idx} className={`flex ${cust ? "justify-end" : "justify-start"}`}>
                            <div className={`rounded-lg p-3 max-w-sm text-xs leading-normal ${
                              cust ? "bg-purple-600 text-white font-sans text-left rounded-tr-none" : "bg-zinc-950 text-zinc-300 border border-zinc-900 rounded-tl-none text-left"
                            }`}>
                              <span className="text-[9px] uppercase font-mono tracking-wider text-zinc-450 block mb-1">{cust ? "Executive Command" : "Polsia support agent"}</span>
                              <p className="whitespace-pre-line">{t.message}</p>
                              <span className="text-[8px] font-mono text-zinc-550 text-right block mt-1">{t.timestamp}</span>
                            </div>
                          </div>
                        );
                      })}

                      {isSupportThinking && (
                        <div className="flex justify-start">
                          <div className="bg-zinc-950 border border-zinc-900 p-2 text-xs text-zinc-500 rounded-md text-left animate-pulse">
                            Processing local records vectors...
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* input form */}
                  <form onSubmit={handleSupportCommandSubmit} className="flex gap-2 border-t border-zinc-900 pt-3">
                    <input 
                      type="text" 
                      placeholder="Prompt command (e.g., 'Lower subscription limits')"
                      value={supportInput}
                      onChange={(e) => setSupportInput(e.target.value)}
                      className="flex-grow bg-[#0E0E10] border border-zinc-900 rounded-md px-3 text-xs text-white placeholder-zinc-650 outline-none focus:border-zinc-750"
                    />
                    <button 
                      type="submit"
                      className="bg-white hover:bg-zinc-200 text-black px-4 py-1.5 rounded-md text-xs font-bold flex items-center space-x-1 shrink-0 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Execute</span>
                    </button>
                  </form>
                </div>

              </div>

            </motion.div>
          )}

          {/* ======================================================== */}
          {/* TAB 15: AD-HOC SYSTEM SETTINGS */}
          {/* ======================================================== */}
          {activeTab === "settings" && (
            <motion.div 
              key="settings-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 md:p-8 space-y-6 text-left max-w-5xl mx-auto"
            >
              <h2 className="text-xl font-bold text-white">Platform Settings</h2>
              <p className="text-xs text-zinc-400">Change metadata details and manage environment compilation parameters.</p>

              <div className="bg-[#050506] border border-[#1F2021] p-5 rounded-lg space-y-4">
                <span className="text-xs font-bold text-white block pb-1 border-b border-zinc-900">Configure Platform metadata</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono text-zinc-500 uppercase">Enterprise Name</label>
                    <input 
                      type="text" 
                      value={company.name}
                      onChange={(e) => onUpdateCompany({ ...company, name: e.target.value })}
                      className="w-full bg-[#0E0E10] border border-zinc-900 rounded-md p-2 text-xs text-white outline-none focus:border-zinc-750"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono text-zinc-500 uppercase">Tagline Description</label>
                    <input 
                      type="text" 
                      value={company.tagline}
                      onChange={(e) => onUpdateCompany({ ...company, tagline: e.target.value })}
                      className="w-full bg-[#0E0E10] border border-zinc-900 rounded-md p-2 text-xs text-white outline-none focus:border-zinc-750"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => showNotification("SaaS metadata profiles saved successfully!")}
                    className="px-4 py-2 bg-white text-black text-xs font-bold rounded-md hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Quick Provision Modal Overlay */}
      <AnimatePresence>
        {activeProvisioningAgent && isProvisioningInModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0c0c0e] border border-zinc-850 rounded-xl p-6 max-w-sm w-full text-left space-y-6 shadow-2xl"
            >
              <div className="flex items-center space-x-3 pb-3 border-b border-zinc-900">
                <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-[#2DD4BF]">
                  {activeProvisioningAgent.initials}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">Automated Agent Provisioning</h3>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Initializing {activeProvisioningAgent.name} Workspace</p>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>Edge Sandbox Status</span>
                  <span className="text-[#2DD4BF] animate-pulse">Running setup...</span>
                </div>
                
                {/* Simulated Segment Bar Track */}
                <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                  <div 
                    className="h-full bg-[#2DD4BF] rounded-full transition-all duration-500" 
                    style={{ width: `${(provisioningStep + 1) * 25}%` }}
                  />
                </div>

                <div className="space-y-2 pt-1">
                  {[
                    "Pulling modular agent runtime configurations...",
                    "Mounting secure local environment credentials...",
                    "Binding API ports and telemetry trackers on 3000...",
                    "Simulating container network handshakes..."
                  ].map((stepText, idx) => {
                    const isDone = provisioningStep > idx;
                    const isCurrent = provisioningStep === idx;
                    return (
                      <div key={idx} className="flex items-center space-x-2.5 text-[10px] font-mono leading-normal">
                        <div className="shrink-0 flex items-center justify-center w-3 text-center">
                          {isDone ? (
                            <span className="text-[#2DD4BF]">✓</span>
                          ) : isCurrent ? (
                            <RefreshCw className="w-2.5 h-2.5 text-[#2DD4BF] animate-spin" />
                          ) : (
                            <div className="w-1 h-1 bg-zinc-850 rounded-full" />
                          )}
                        </div>
                        <span className={isDone ? "text-zinc-400" : isCurrent ? "text-[#2DD4BF] font-medium" : "text-zinc-600"}>
                          {stepText}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Assign Task Modal */}
      <AnimatePresence>
        {showAssignModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0c0c0e] border border-zinc-850 rounded-xl p-6 max-w-md w-full text-left space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-blue-400">
                    {showAssignModal.initials}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Delegate Task Objective</h3>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Board delegation protocols to {showAssignModal.name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAssignModal(null)}
                  className="text-zinc-500 hover:text-white font-mono text-lg leading-none p-1 cursor-pointer"
                >
                  ×
                </button>
              </div>

              {/* Form content */}
              <div className="space-y-4">
                {/* Option 1: Select Roadmap Item */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold font-mono text-zinc-550 uppercase tracking-widest block">
                    Option A: Select Active Roadmap Item
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {company.planner.roadmap.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedTaskToAssign(item.title);
                          setCustomTaskInput("");
                        }}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          selectedTaskToAssign === item.title 
                            ? "border-blue-500/50 bg-[#1A1A22]/40 text-white" 
                            : "border-zinc-900 bg-zinc-950/20 text-zinc-400 hover:border-zinc-800 hover:text-white"
                        }`}
                      >
                        <div className="space-y-1 text-left">
                          <p className="font-semibold">{item.phase}: {item.title}</p>
                          <p className="text-zinc-500 text-[10px] leading-relaxed line-clamp-1">{item.description}</p>
                        </div>
                        <span className={`text-[9px] font-mono uppercase font-semibold px-1.5 py-0.5 rounded ml-2 shrink-0 ${
                          item.status === 'completed' 
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400 font-medium"
                        }`}>
                          {item.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative py-1 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-900"></div></div>
                  <span className="relative text-[9px] font-bold font-mono tracking-widest text-zinc-650 bg-[#0c0c0e] px-3 uppercase">OR</span>
                </div>

                {/* Option 2: Custom Text Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold font-mono text-zinc-550 uppercase tracking-widest block">
                    Option B: Enter Custom Task Directive
                  </label>
                  <input
                    type="text"
                    value={customTaskInput}
                    onChange={(e) => {
                      setCustomTaskInput(e.target.value);
                      setSelectedTaskToAssign("");
                    }}
                    placeholder="e.g. Deploy secondary PostgreSQL schema extensions to container"
                    className="w-full bg-zinc-950/40 border border-zinc-850 rounded-lg px-3.5 py-2 text-xs text-white placeholder-zinc-650 outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex justify-end space-x-2.5 pt-3 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(null)}
                  className="px-3.5 py-1.5 bg-transparent hover:bg-zinc-900 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white border border-zinc-805 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedTaskToAssign && !customTaskInput.trim()}
                  onClick={() => {
                    const chosen = selectedTaskToAssign || customTaskInput;
                    handleAssignTask(chosen);
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-lg disabled:opacity-40 transition-colors cursor-pointer text-center"
                >
                  Delegate and Run
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
