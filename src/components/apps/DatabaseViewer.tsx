import { useState } from "react";
import { Database, Search, Lock, AlertTriangle, Eye, EyeOff, FileText, Shield, Activity } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SpecimenData {
  id: string;
  codename: string;
  classification: string;
  threat_level: "MINIMAL" | "LOW" | "MODERATE" | "HIGH" | "EXTREME";
  containment: string;
  status: "CONTAINED" | "DECEASED" | "MISSING" | "TERMINATED";
  discovered: string;
  notes: string;
  clearance_required: number;
}

export const DatabaseViewer = () => {
  const [search, setSearch] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<SpecimenData | null>(null);
  const [showRedacted, setShowRedacted] = useState(false);
  const userClearance = 5;

  const specimens: SpecimenData[] = [
    {
      id: "Z-13",
      codename: "EYEFESTATION",
      classification: "Aquatic Entity",
      threat_level: "EXTREME",
      containment: "Zone 4, Cell B-07",
      status: "CONTAINED",
      discovered: "2023-08-15",
      notes: "Highly aggressive. Multiple eyes capable of inducing psychological trauma. Containment requires specialized viewing restrictions. Staff advised to avoid direct visual contact. Recent containment stress detected.",
      clearance_required: 4
    },
    {
      id: "Z-09",
      codename: "PANDEMONIUM",
      classification: "Multi-Entity Organism",
      threat_level: "HIGH",
      containment: "Zone 3, Cell A-14",
      status: "CONTAINED",
      discovered: "2023-11-22",
      notes: "Exhibits collective intelligence. Multiple individual entities acting as one. Containment breach attempts: 3. Sound-based communication detected. Sedation protocols ready.",
      clearance_required: 3
    },
    {
      id: "Z-01",
      codename: "ANGLER",
      classification: "Deep-Sea Predator",
      threat_level: "HIGH",
      containment: "Zone 2, Cell C-03",
      status: "CONTAINED",
      discovered: "2022-03-08",
      notes: "Uses bioluminescent lure to attract prey. Extremely patient hunter. Has shown problem-solving capabilities. Containment stable. Feeding schedule: Weekly.",
      clearance_required: 2
    },
    {
      id: "Z-05",
      codename: "WALL DWELLER",
      classification: "Humanoid Entity",
      threat_level: "MODERATE",
      containment: "Zone 1, Cell D-22",
      status: "CONTAINED",
      discovered: "2023-01-19",
      notes: "Capable of flattening body to hide in narrow spaces. Non-aggressive unless cornered. Containment: Standard humanoid cell with reinforced walls.",
      clearance_required: 2
    },
    {
      id: "Z-17",
      codename: "[REDACTED]",
      classification: "[CLASSIFIED]",
      threat_level: "EXTREME",
      containment: "[DATA EXPUNGED]",
      status: "CONTAINED",
      discovered: "[CLASSIFIED]",
      notes: "[ACCESS DENIED - LEVEL 6 CLEARANCE REQUIRED]",
      clearance_required: 6
    },
    {
      id: "Z-23",
      codename: "SQUIDDLES",
      classification: "Cephalopod Swarm",
      threat_level: "LOW",
      containment: "Zone 1, Aquarium A-01",
      status: "CONTAINED",
      discovered: "2024-02-14",
      notes: "Generally docile. Exhibits playful behavior. Often used for stress relief for staff. Containment: Large saltwater tank. Feeding: Daily.",
      clearance_required: 1
    },
    {
      id: "Z-11",
      codename: "VOID MASS",
      classification: "Unknown Origin",
      threat_level: "HIGH",
      containment: "Zone 5, Special Cell",
      status: "CONTAINED",
      discovered: "2023-09-30",
      notes: "Absorbs all light in vicinity. Composition unknown. Containment requires specialized electromagnetic barriers. Research ongoing. Extreme caution advised.",
      clearance_required: 4
    },
    {
      id: "Z-06",
      codename: "GOOD PEOPLE",
      classification: "Humanoid Entity",
      threat_level: "MINIMAL",
      containment: "Zone 1, Cell B-09",
      status: "DECEASED",
      discovered: "2023-04-12",
      notes: "Former specimen. Displayed friendly behavior. Cause of death: Natural causes. Autopsy completed. Data archived.",
      clearance_required: 2
    },
    {
      id: "Z-███",
      codename: "[DATA EXPUNGED]",
      classification: "[REDACTED]",
      threat_level: "EXTREME",
      containment: "[CLASSIFIED]",
      status: "CONTAINED",
      discovered: "████-██-██",
      notes: "⚠️ WARNING: This file should not exist. If you can read this, report to Director Morrison immediately. [REMAINING DATA CORRUPTED]",
      clearance_required: 6
    }
  ];

  const getThreatColor = (level: string) => {
    switch (level) {
      case "EXTREME": return "text-red-500 bg-red-500/10 border-red-500/30";
      case "HIGH": return "text-amber-500 bg-amber-500/10 border-amber-500/30";
      case "MODERATE": return "text-blue-400 bg-blue-400/10 border-blue-400/30";
      case "LOW": return "text-cyan-400 bg-cyan-400/10 border-cyan-400/30";
      case "MINIMAL": return "text-green-400 bg-green-400/10 border-green-400/30";
      default: return "text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONTAINED": return "text-emerald-400 bg-emerald-500/10";
      case "DECEASED": return "text-slate-400 bg-slate-500/10";
      case "MISSING": return "text-red-400 bg-red-500/10";
      case "TERMINATED": return "text-amber-400 bg-amber-500/10";
      default: return "text-muted-foreground";
    }
  };

  const filteredSpecimens = specimens.filter(s => 
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.codename.toLowerCase().includes(search.toLowerCase()) ||
    s.classification.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: specimens.length,
    contained: specimens.filter(s => s.status === "CONTAINED").length,
    extreme: specimens.filter(s => s.threat_level === "EXTREME").length,
    classified: specimens.filter(s => s.clearance_required > userClearance).length
  };

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar */}
      <div className="w-80 border-r border-cyan-500/20 flex flex-col bg-black/20">
        {/* Header */}
        <div className="p-4 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-transparent">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <Database className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">Specimen Database</h2>
              <p className="text-xs text-cyan-600">URBANSHADE Facility</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-center">
              <div className="text-lg font-bold text-white">{stats.total}</div>
              <div className="text-[10px] text-slate-500 uppercase">Total</div>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
              <div className="text-lg font-bold text-emerald-400">{stats.contained}</div>
              <div className="text-[10px] text-emerald-600 uppercase">Contained</div>
            </div>
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
              <div className="text-lg font-bold text-red-400">{stats.extreme}</div>
              <div className="text-[10px] text-red-600 uppercase">Extreme</div>
            </div>
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-center">
              <div className="text-lg font-bold text-purple-400">{stats.classified}</div>
              <div className="text-[10px] text-purple-600 uppercase">Classified</div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search specimens..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
            />
          </div>
        </div>

        {/* Specimen List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredSpecimens.map((specimen) => {
              const hasAccess = userClearance >= specimen.clearance_required;
              return (
                <button
                  key={specimen.id}
                  onClick={() => hasAccess && setSelectedEntry(specimen)}
                  className={`w-full p-3 rounded-xl text-left transition-all ${
                    !hasAccess ? "opacity-50 cursor-not-allowed" :
                    selectedEntry?.id === specimen.id 
                      ? "bg-cyan-500/20 border border-cyan-500/40 shadow-lg shadow-cyan-500/10" 
                      : "hover:bg-slate-800/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-white truncate flex items-center gap-2">
                        {specimen.codename}
                        {!hasAccess && <Lock className="w-3 h-3 text-red-400 flex-shrink-0" />}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {specimen.id} • {specimen.classification}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getThreatColor(specimen.threat_level)}`}>
                      ⚠ {specimen.threat_level}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getStatusColor(specimen.status)}`}>
                      ● {specimen.status}
                    </span>
                  </div>
                  {!hasAccess && (
                    <div className="text-[10px] text-red-400 mt-2 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      LEVEL {specimen.clearance_required} REQUIRED
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-cyan-500/20 bg-black/20">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Your clearance: Level {userClearance}</span>
            <button 
              onClick={() => setShowRedacted(!showRedacted)}
              className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
            >
              {showRedacted ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {showRedacted ? "Hide" : "Show"} redacted
            </button>
          </div>
        </div>
      </div>

      {/* Details Panel */}
      <div className="flex-1 p-6 overflow-auto">
        {selectedEntry ? (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            {/* Header Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-xs text-cyan-500 font-bold mb-1 tracking-wider">SPECIMEN RECORD</div>
                  <div className="font-mono font-bold text-4xl text-cyan-400">{selectedEntry.id}</div>
                </div>
                <span className={`text-sm font-bold px-3 py-1.5 rounded-lg border ${getThreatColor(selectedEntry.threat_level)}`}>
                  ⚠ {selectedEntry.threat_level}
                </span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{selectedEntry.codename}</div>
              <div className="text-slate-400">{selectedEntry.classification}</div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</div>
                <div className={`font-bold text-lg ${getStatusColor(selectedEntry.status).split(' ')[0]}`}>
                  ● {selectedEntry.status}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Containment</div>
                <div className="font-mono text-white">{selectedEntry.containment}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Discovered</div>
                <div className="font-mono text-white">{selectedEntry.discovered}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Clearance</div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-cyan-400">LEVEL {selectedEntry.clearance_required}</span>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">✓ GRANTED</span>
                </div>
              </div>
            </div>

            {/* Research Notes */}
            <div className="p-5 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white">Research Notes</h3>
              </div>
              <p className="text-slate-300 leading-relaxed">{selectedEntry.notes}</p>
            </div>

            {/* Activity Log (mock) */}
            <div className="p-5 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white">Recent Activity</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Feeding routine completed</span>
                  <span className="text-xs font-mono">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Vital signs recorded</span>
                  <span className="text-xs font-mono">6 hours ago</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Security check passed</span>
                  <span className="text-xs font-mono">12 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50">
              <Database className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <h3 className="text-lg font-bold text-white mb-2">Select a Specimen</h3>
              <p className="text-slate-500 text-sm max-w-xs">
                Choose a specimen from the list to view detailed information and research notes.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-cyan-600">
                <Shield className="w-3 h-3" />
                Your clearance: Level {userClearance}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};