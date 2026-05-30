const fs = require('fs');
let content = fs.readFileSync('src/components/CompanyDetail.tsx', 'utf8');
const lines = content.split('\n');

const insertIndex = lines.findIndex(l => l.includes('if (activeTab === "issues" || activeTab === "onboarding_project" || activeTab === "agent_ceo") {'));

const inboxBlock = `
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
`;

if (insertIndex > -1) {
    lines.splice(insertIndex, 0, inboxBlock);
    fs.writeFileSync('src/components/CompanyDetail.tsx', lines.join('\\n'));
    console.log("Success");
} else {
    console.log("Failed to find insert index");
}
