import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bug, ArrowLeft, Download, Upload, Trash2, Edit, Save, RefreshCw, Database, Search, Plus, Code, FileImage, Terminal, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ImageData {
  [key: string]: string;
}

export default function DevDev() {
  const navigate = useNavigate();
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [activeTab, setActiveTab] = useState<"entries" | "raw" | "add" | "console">("entries");
  const [consoleLogs, setConsoleLogs] = useState<Array<{ type: string; msg: string; time: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load system state on mount
  useEffect(() => {
    addLog("info", "Dev Mode initialized");
    addLog("info", `LocalStorage contains ${localStorage.length} entries`);
    addLog("info", `Storage size: ${(JSON.stringify(localStorage).length / 1024).toFixed(2)} KB`);
  }, []);

  const addLog = (type: string, msg: string) => {
    setConsoleLogs(prev => [...prev, { type, msg, time: new Date().toLocaleTimeString() }]);
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setImageData(data);
        setFileName(file.name);
        addLog("success", `Loaded ${file.name} (${Object.keys(data).length} entries)`);
        toast.success(`Loaded ${file.name}`);
      } catch (error) {
        addLog("error", "Failed to parse file");
        toast.error("Failed to parse file");
      }
    };
    reader.readAsText(file);
  };

  const handleLoadCurrentSystem = () => {
    const systemImage: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        systemImage[key] = localStorage.getItem(key) || "";
      }
    }
    setImageData(systemImage);
    setFileName(`system_snapshot_${Date.now()}.img`);
    addLog("success", `Loaded current system state (${Object.keys(systemImage).length} entries)`);
    toast.success("Loaded current system state");
  };

  const handleSaveValue = (key: string) => {
    if (!imageData) return;
    setImageData({ ...imageData, [key]: editValue });
    setEditingKey(null);
    addLog("success", `Updated key: ${key}`);
    toast.success(`Updated ${key}`);
  };

  const handleDeleteKey = (key: string) => {
    if (!imageData) return;
    const newData = { ...imageData };
    delete newData[key];
    setImageData(newData);
    addLog("warn", `Deleted key: ${key}`);
    toast.success(`Deleted ${key}`);
  };

  const handleAddKey = () => {
    if (!imageData || !newKey) return;
    if (imageData[newKey] !== undefined) {
      toast.error("Key already exists");
      return;
    }
    setImageData({ ...imageData, [newKey]: newValue });
    addLog("success", `Added key: ${newKey}`);
    setNewKey("");
    setNewValue("");
    toast.success(`Added ${newKey}`);
  };

  const handleExport = () => {
    if (!imageData) return;
    const blob = new Blob([JSON.stringify(imageData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || `urbanshade_image_${Date.now()}.img`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addLog("success", `Exported: ${fileName}`);
    toast.success("Image exported");
  };

  const handleApplyToSystem = () => {
    if (!imageData) return;
    if (!window.confirm("⚠️ This will REPLACE your entire system state with this image. Continue?")) return;
    
    addLog("warn", "Applying image to system...");
    localStorage.clear();
    Object.entries(imageData).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    addLog("success", "Image applied successfully");
    toast.success("System image applied. Reloading...");
    setTimeout(() => window.location.href = "/", 1500);
  };

  const handleClearSystem = () => {
    if (!window.confirm("⚠️ DANGER: This will PERMANENTLY delete ALL system data. Continue?")) return;
    addLog("error", "Clearing all system data...");
    localStorage.clear();
    toast.success("System cleared. Reloading...");
    setTimeout(() => window.location.href = "/", 1000);
  };

  const filteredEntries = imageData 
    ? Object.entries(imageData).filter(([key, value]) => 
        key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const formatValue = (value: string) => {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  };

  const getValuePreview = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === 'object') {
        return `{...} (${Object.keys(parsed).length} keys)`;
      }
      return String(parsed);
    } catch {
      return value.length > 80 ? value.substring(0, 80) + "..." : value;
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0f] text-gray-100 flex flex-col overflow-hidden font-mono">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-900/30 via-purple-900/30 to-pink-900/30 border-b border-pink-500/30 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")}
            className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Exit
          </Button>
          <div className="flex items-center gap-2">
            <Bug className="w-5 h-5 text-pink-400" />
            <span className="font-bold text-pink-400">URBANSHADE DEV MODE</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500">v2.2.0</span>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-green-400">ACTIVE</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-gray-800 p-3 flex flex-wrap gap-2 bg-gray-900/50">
        <input ref={fileInputRef} type="file" accept=".img,.json" onChange={handleImportFile} className="hidden" />
        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
          <Upload className="w-4 h-4 mr-2" /> Import .img
        </Button>
        <Button variant="outline" size="sm" onClick={handleLoadCurrentSystem} className="border-green-500/30 text-green-400 hover:bg-green-500/10">
          <Database className="w-4 h-4 mr-2" /> Load System
        </Button>
        {imageData && (
          <>
            <Button variant="outline" size="sm" onClick={handleExport} className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleApplyToSystem} className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
              <RefreshCw className="w-4 h-4 mr-2" /> Apply to System
            </Button>
          </>
        )}
        <div className="flex-1" />
        <Button variant="outline" size="sm" onClick={handleClearSystem} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
          <Trash2 className="w-4 h-4 mr-2" /> Clear All Data
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Editor */}
        <div className="flex-1 flex flex-col border-r border-gray-800 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-800 bg-gray-900/30">
            {[
              { id: "entries", label: "Entries", icon: FileImage },
              { id: "raw", label: "Raw JSON", icon: Code },
              { id: "add", label: "Add Entry", icon: Plus },
              { id: "console", label: "Console", icon: Terminal },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
                  activeTab === tab.id 
                    ? "bg-pink-500/10 text-pink-400 border-b-2 border-pink-500" 
                    : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto p-4">
            {!imageData && activeTab !== "console" ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <FileImage className="w-16 h-16 mx-auto text-gray-700" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-400">No Image Loaded</h3>
                    <p className="text-sm text-gray-600 mt-1">Import a .img file or load current system state</p>
                  </div>
                </div>
              </div>
            ) : activeTab === "entries" && imageData ? (
              <div className="space-y-2">
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <Input
                    placeholder="Search keys or values..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-900 border-gray-700 text-gray-300"
                  />
                </div>
                
                <div className="text-xs text-gray-500 mb-2">{filteredEntries.length} entries</div>
                
                {filteredEntries.map(([key, value]) => (
                  <div key={key} className="border border-gray-800 rounded-lg p-3 hover:border-pink-500/30 transition-colors bg-gray-900/30">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-pink-400 font-bold truncate">{key}</div>
                        {editingKey === key ? (
                          <div className="mt-2 space-y-2">
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-full h-32 bg-gray-900 border border-gray-700 rounded p-2 text-xs text-gray-300 resize-y font-mono"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleSaveValue(key)} className="bg-green-600 hover:bg-green-700">
                                <Save className="w-3 h-3 mr-1" /> Save
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingKey(null)}>Cancel</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 mt-1 truncate">{getValuePreview(value)}</div>
                        )}
                      </div>
                      {editingKey !== key && (
                        <div className="flex gap-1 shrink-0">
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-500 hover:text-cyan-400"
                            onClick={() => { setEditingKey(key); setEditValue(formatValue(value)); }}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-500 hover:text-red-400"
                            onClick={() => handleDeleteKey(key)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : activeTab === "raw" && imageData ? (
              <pre className="text-xs bg-gray-900/50 rounded-lg p-4 overflow-auto whitespace-pre-wrap text-gray-400">
                {JSON.stringify(imageData, null, 2)}
              </pre>
            ) : activeTab === "add" && imageData ? (
              <div className="max-w-lg space-y-4">
                <h3 className="text-lg font-bold text-pink-400">Add New Entry</h3>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Key</label>
                  <Input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="my_custom_key" className="bg-gray-900 border-gray-700" />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Value</label>
                  <textarea
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder='{"key": "value"} or plain text'
                    className="w-full h-32 bg-gray-900 border border-gray-700 rounded p-2 text-sm text-gray-300 resize-y"
                  />
                </div>
                <Button onClick={handleAddKey} disabled={!newKey} className="bg-pink-600 hover:bg-pink-700">
                  <Plus className="w-4 h-4 mr-2" /> Add Entry
                </Button>
              </div>
            ) : activeTab === "console" ? (
              <div className="space-y-1">
                {consoleLogs.map((log, i) => (
                  <div key={i} className={`text-xs p-2 rounded ${
                    log.type === 'error' ? 'bg-red-500/10 text-red-400' :
                    log.type === 'warn' ? 'bg-yellow-500/10 text-yellow-400' :
                    log.type === 'success' ? 'bg-green-500/10 text-green-400' :
                    'bg-gray-800/50 text-gray-400'
                  }`}>
                    <span className="text-gray-600">[{log.time}]</span> {log.msg}
                  </div>
                ))}
                {consoleLogs.length === 0 && (
                  <div className="text-center text-gray-600 py-8">No logs yet</div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Right Panel - System Info */}
        <div className="w-72 bg-gray-900/30 p-4 overflow-auto">
          <h3 className="text-sm font-bold text-pink-400 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4" /> System Info
          </h3>
          
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded bg-gray-800/50 border border-gray-700">
              <div className="text-gray-500">Storage Used</div>
              <div className="text-cyan-400 font-bold text-lg">{(JSON.stringify(localStorage).length / 1024).toFixed(2)} KB</div>
            </div>
            
            <div className="p-3 rounded bg-gray-800/50 border border-gray-700">
              <div className="text-gray-500">Total Entries</div>
              <div className="text-cyan-400 font-bold text-lg">{localStorage.length}</div>
            </div>
            
            <div className="p-3 rounded bg-gray-800/50 border border-gray-700">
              <div className="text-gray-500">Current File</div>
              <div className="text-cyan-400 font-mono truncate">{fileName || "None"}</div>
            </div>
            
            {imageData && (
              <div className="p-3 rounded bg-gray-800/50 border border-gray-700">
                <div className="text-gray-500">Image Entries</div>
                <div className="text-cyan-400 font-bold text-lg">{Object.keys(imageData).length}</div>
              </div>
            )}
            
            <div className="border-t border-gray-700 pt-3 mt-4">
              <div className="text-gray-500 mb-2">Quick Actions</div>
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    const backup = {} as Record<string, string>;
                    for (let i = 0; i < localStorage.length; i++) {
                      const key = localStorage.key(i);
                      if (key) backup[key] = localStorage.getItem(key) || "";
                    }
                    console.log("System Backup:", backup);
                    addLog("info", "Backup logged to browser console");
                    toast.info("Backup logged to console (F12)");
                  }}
                  className="w-full text-left p-2 rounded hover:bg-gray-800 text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  → Log backup to console
                </button>
                <button 
                  onClick={() => {
                    const accounts = localStorage.getItem('urbanshade_accounts');
                    addLog("info", `Accounts: ${accounts || "None"}`);
                  }}
                  className="w-full text-left p-2 rounded hover:bg-gray-800 text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  → View accounts data
                </button>
                <button 
                  onClick={() => {
                    const keys = [];
                    for (let i = 0; i < localStorage.length; i++) {
                      keys.push(localStorage.key(i));
                    }
                    addLog("info", `Keys: ${keys.join(", ")}`);
                  }}
                  className="w-full text-left p-2 rounded hover:bg-gray-800 text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  → List all keys
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
