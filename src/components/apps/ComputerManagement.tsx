import { useState } from "react";
import { Monitor, Cpu, HardDrive, Wifi, WifiOff, Power, RefreshCw, Settings, AlertTriangle, CheckCircle, Clock, User } from "lucide-react";

interface Computer {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline" | "maintenance" | "warning";
  type: "workstation" | "server" | "terminal" | "embedded";
  ip: string;
  lastSeen: string;
  cpu: number;
  memory: number;
  disk: number;
  user?: string;
  os: string;
}

export const ComputerManagement = () => {
  const [computers] = useState<Computer[]>([
    { id: "WS-001", name: "Control Room Primary", location: "Operations Center", status: "online", type: "workstation", ip: "10.0.1.10", lastSeen: "Now", cpu: 45, memory: 62, disk: 34, user: "Dr. Chen", os: "UrbanShade OS 2.2" },
    { id: "WS-002", name: "Research Terminal A", location: "Research Lab A", status: "online", type: "workstation", ip: "10.0.2.20", lastSeen: "Now", cpu: 78, memory: 85, disk: 56, user: "Dr. Martinez", os: "UrbanShade OS 2.2" },
    { id: "WS-003", name: "Engineering Console", location: "Engineering Deck", status: "online", type: "workstation", ip: "10.0.3.30", lastSeen: "Now", cpu: 23, memory: 41, disk: 28, os: "UrbanShade OS 2.2" },
    { id: "SRV-001", name: "Primary Database Server", location: "Server Bay", status: "online", type: "server", ip: "10.0.0.1", lastSeen: "Now", cpu: 67, memory: 72, disk: 45, os: "UrbanShade Server 2.2" },
    { id: "SRV-002", name: "Backup Server", location: "Server Bay", status: "online", type: "server", ip: "10.0.0.2", lastSeen: "Now", cpu: 12, memory: 35, disk: 89, os: "UrbanShade Server 2.2" },
    { id: "SRV-003", name: "Security Server", location: "Server Bay", status: "warning", type: "server", ip: "10.0.0.3", lastSeen: "2 min ago", cpu: 95, memory: 91, disk: 67, os: "UrbanShade Server 2.2" },
    { id: "TERM-001", name: "Airlock Terminal", location: "Airlock Alpha", status: "online", type: "terminal", ip: "10.0.4.100", lastSeen: "Now", cpu: 15, memory: 28, disk: 12, os: "UrbanShade Embedded" },
    { id: "TERM-002", name: "Medical Bay Terminal", location: "Medical Division", status: "online", type: "terminal", ip: "10.0.4.101", lastSeen: "Now", cpu: 8, memory: 22, disk: 18, os: "UrbanShade Embedded" },
    { id: "TERM-003", name: "Zone 4 Access Terminal", location: "Zone 4", status: "offline", type: "terminal", ip: "10.0.4.102", lastSeen: "3 hours ago", cpu: 0, memory: 0, disk: 0, os: "UrbanShade Embedded" },
    { id: "EMB-001", name: "Containment Controller", location: "Zone 4", status: "online", type: "embedded", ip: "10.0.5.50", lastSeen: "Now", cpu: 34, memory: 45, disk: 5, os: "UrbanShade Realtime" },
    { id: "EMB-002", name: "Power Grid Controller", location: "Engineering", status: "maintenance", type: "embedded", ip: "10.0.5.51", lastSeen: "1 hour ago", cpu: 0, memory: 0, disk: 0, os: "UrbanShade Realtime" },
    { id: "WS-004", name: "Security Office", location: "Security Hub", status: "online", type: "workstation", ip: "10.0.1.15", lastSeen: "Now", cpu: 31, memory: 54, disk: 42, user: "Officer Davis", os: "UrbanShade OS 2.2" },
  ]);

  const [selectedComputer, setSelectedComputer] = useState<Computer | null>(null);
  const [filter, setFilter] = useState<"all" | "online" | "offline" | "warning">("all");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online": return <CheckCircle className="w-4 h-4 text-primary" />;
      case "offline": return <WifiOff className="w-4 h-4 text-destructive" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "maintenance": return <Settings className="w-4 h-4 text-blue-400 animate-spin" />;
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "workstation": return <Monitor className="w-4 h-4" />;
      case "server": return <HardDrive className="w-4 h-4" />;
      case "terminal": return <Cpu className="w-4 h-4" />;
      case "embedded": return <Cpu className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const getUsageColor = (value: number) => {
    if (value >= 90) return "bg-destructive";
    if (value >= 70) return "bg-yellow-500";
    return "bg-primary";
  };

  const filteredComputers = computers.filter(c => {
    if (filter === "all") return true;
    return c.status === filter;
  });

  const stats = {
    total: computers.length,
    online: computers.filter(c => c.status === "online").length,
    offline: computers.filter(c => c.status === "offline").length,
    warning: computers.filter(c => c.status === "warning" || c.status === "maintenance").length,
  };

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Computer Management</h2>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 rounded-lg bg-muted/30">
              <div className="text-lg font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="p-2 rounded-lg bg-primary/20">
              <div className="text-lg font-bold text-primary">{stats.online}</div>
              <div className="text-xs text-muted-foreground">Online</div>
            </div>
            <div className="p-2 rounded-lg bg-destructive/20">
              <div className="text-lg font-bold text-destructive">{stats.offline}</div>
              <div className="text-xs text-muted-foreground">Offline</div>
            </div>
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <div className="text-lg font-bold text-yellow-500">{stats.warning}</div>
              <div className="text-xs text-muted-foreground">Issues</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-2 border-b border-border flex gap-1">
          {(["all", "online", "offline", "warning"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-muted/30 hover:bg-muted/50"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Computer List */}
        <div className="flex-1 overflow-y-auto">
          {filteredComputers.map((computer) => (
            <div
              key={computer.id}
              onClick={() => setSelectedComputer(computer)}
              className={`p-3 border-b border-border cursor-pointer transition-colors ${
                selectedComputer?.id === computer.id ? "bg-primary/20" : "hover:bg-muted/20"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {getTypeIcon(computer.type)}
                <span className="font-medium text-sm flex-1 truncate">{computer.name}</span>
                {getStatusIcon(computer.status)}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Wifi className="w-3 h-3" />
                <span>{computer.ip}</span>
                <span className="ml-auto">{computer.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Panel */}
      <div className="flex-1 flex flex-col">
        {selectedComputer ? (
          <>
            <div className="p-4 border-b border-border bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    {getTypeIcon(selectedComputer.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{selectedComputer.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{selectedComputer.id}</span>
                      <span>•</span>
                      <span>{selectedComputer.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedComputer.status)}
                  <span className={`font-medium ${
                    selectedComputer.status === "online" ? "text-primary" :
                    selectedComputer.status === "offline" ? "text-destructive" :
                    "text-yellow-500"
                  }`}>
                    {selectedComputer.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {/* System Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/20 border border-border">
                  <div className="text-xs text-muted-foreground mb-1">IP Address</div>
                  <div className="font-mono font-bold">{selectedComputer.ip}</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/20 border border-border">
                  <div className="text-xs text-muted-foreground mb-1">Operating System</div>
                  <div className="font-bold">{selectedComputer.os}</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/20 border border-border">
                  <div className="text-xs text-muted-foreground mb-1">Type</div>
                  <div className="font-bold capitalize">{selectedComputer.type}</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/20 border border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Clock className="w-3 h-3" />
                    Last Seen
                  </div>
                  <div className="font-bold">{selectedComputer.lastSeen}</div>
                </div>
              </div>

              {/* Current User */}
              {selectedComputer.user && (
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-blue-400">Current User</span>
                  </div>
                  <div className="font-bold">{selectedComputer.user}</div>
                </div>
              )}

              {/* Resource Usage */}
              {selectedComputer.status !== "offline" && (
                <div className="p-4 rounded-lg bg-muted/20 border border-border">
                  <h4 className="font-bold mb-4">Resource Usage</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>CPU</span>
                        <span className="font-mono">{selectedComputer.cpu}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getUsageColor(selectedComputer.cpu)} transition-all`}
                          style={{ width: `${selectedComputer.cpu}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Memory</span>
                        <span className="font-mono">{selectedComputer.memory}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getUsageColor(selectedComputer.memory)} transition-all`}
                          style={{ width: `${selectedComputer.memory}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Disk</span>
                        <span className="font-mono">{selectedComputer.disk}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getUsageColor(selectedComputer.disk)} transition-all`}
                          style={{ width: `${selectedComputer.disk}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-3 gap-2">
                <button className="p-3 rounded-lg bg-primary/20 border border-primary/30 hover:bg-primary/30 transition-colors flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Restart</span>
                </button>
                <button className="p-3 rounded-lg bg-destructive/20 border border-destructive/30 hover:bg-destructive/30 transition-colors flex items-center justify-center gap-2">
                  <Power className="w-4 h-4" />
                  <span className="text-sm">Shutdown</span>
                </button>
                <button className="p-3 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-colors flex items-center justify-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Configure</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Monitor className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select a computer to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
