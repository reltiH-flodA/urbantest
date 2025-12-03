import { useState, useEffect } from "react";
import { Camera, Video, AlertTriangle, List, Map, Plus, Link2, X, ExternalLink, Settings } from "lucide-react";
import { toast } from "sonner";

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline" | "warning";
  description: string;
  area: "north" | "south" | "east" | "west" | "central";
  isExternal?: boolean;
  streamUrl?: string;
}

export const SecurityCameras = () => {
  const defaultCameras: CameraFeed[] = [
    { id: "CAM-01", name: "Main Entrance", location: "Airlock Alpha", status: "online", description: "Clear visibility. No activity detected.", area: "north" },
    { id: "CAM-02", name: "Control Room", location: "Operations Center", status: "online", description: "Personnel present. All systems operational.", area: "central" },
    { id: "CAM-03", name: "Research Lab A", location: "Research Division", status: "online", description: "Lab equipment active. 2 personnel on duty.", area: "east" },
    { id: "CAM-04", name: "Containment Z-13", location: "Zone 4", status: "warning", description: "⚠️ ALERT: Subject pressing against containment glass. Unusual behavior.", area: "south" },
    { id: "CAM-05", name: "Server Bay", location: "Level 2", status: "online", description: "Temperature normal. No personnel present. [Feed flickers occasionally]", area: "central" },
    { id: "CAM-06", name: "Corridor 7-B", location: "Zone 7", status: "online", description: "Emergency lighting active. Shadow movement detected 3 times in past hour.", area: "west" },
    { id: "CAM-07", name: "Terminal T-07", location: "Zone 4 Access", status: "offline", description: "⚠️ CAMERA DESTROYED - Lens shattered. Wet residue on housing.", area: "south" },
    { id: "CAM-08", name: "Medical Bay", location: "Medical Division", status: "online", description: "1 personnel on duty. Equipment standby mode.", area: "east" },
    { id: "CAM-09", name: "Engineering", location: "Engineering Deck", status: "online", description: "Active maintenance. 3 personnel present.", area: "west" },
  ];

  const [cameras, setCameras] = useState<CameraFeed[]>(() => {
    const saved = localStorage.getItem("urbanshade_external_cameras");
    if (saved) {
      try {
        const external = JSON.parse(saved);
        return [...defaultCameras, ...external];
      } catch { return defaultCameras; }
    }
    return defaultCameras;
  });

  const [selectedCamera, setSelectedCamera] = useState<CameraFeed>(cameras[0]);
  const [scanLines, setScanLines] = useState(0);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [showAddCamera, setShowAddCamera] = useState(false);
  const [newCamera, setNewCamera] = useState({ name: "", location: "", streamUrl: "" });

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLines(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "text-primary";
      case "warning": return "text-yellow-500";
      case "offline": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getAreaCameras = (area: string) => cameras.filter(c => c.area === area);

  const handleAddCamera = () => {
    if (!newCamera.name || !newCamera.streamUrl) {
      toast.error("Please enter camera name and stream URL");
      return;
    }

    const externalCamera: CameraFeed = {
      id: `EXT-${Date.now()}`,
      name: newCamera.name,
      location: newCamera.location || "External",
      status: "online",
      description: "External IP camera stream",
      area: "central",
      isExternal: true,
      streamUrl: newCamera.streamUrl,
    };

    const updatedCameras = [...cameras, externalCamera];
    setCameras(updatedCameras);
    
    // Save external cameras
    const externalCameras = updatedCameras.filter(c => c.isExternal);
    localStorage.setItem("urbanshade_external_cameras", JSON.stringify(externalCameras));
    
    setNewCamera({ name: "", location: "", streamUrl: "" });
    setShowAddCamera(false);
    toast.success(`Camera "${newCamera.name}" added`);
  };

  const handleRemoveCamera = (id: string) => {
    const updatedCameras = cameras.filter(c => c.id !== id);
    setCameras(updatedCameras);
    
    const externalCameras = updatedCameras.filter(c => c.isExternal);
    localStorage.setItem("urbanshade_external_cameras", JSON.stringify(externalCameras));
    
    if (selectedCamera.id === id) {
      setSelectedCamera(updatedCameras[0]);
    }
    toast.success("Camera removed");
  };

  const areas = [
    { id: "north", name: "North Sector", x: "50%", y: "10%", color: "bg-blue-500" },
    { id: "south", name: "South Sector", x: "50%", y: "90%", color: "bg-red-500" },
    { id: "east", name: "East Sector", x: "90%", y: "50%", color: "bg-green-500" },
    { id: "west", name: "West Sector", x: "10%", y: "50%", color: "bg-yellow-500" },
    { id: "central", name: "Central Hub", x: "50%", y: "50%", color: "bg-primary" },
  ];

  return (
    <div className="flex h-full">
      {/* Camera List or Map */}
      <div className="w-72 border-r border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5 bg-black/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              <h2 className="font-bold">Security Cameras</h2>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mb-3">
            {cameras.filter(c => c.status === "online").length}/{cameras.length} online
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("list")}
              className={`flex-1 px-3 py-2 rounded-lg transition-colors text-xs flex items-center justify-center gap-2 ${
                viewMode === "list" ? "bg-primary/30 border border-primary" : "bg-muted/20 border border-border hover:bg-muted/30"
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex-1 px-3 py-2 rounded-lg transition-colors text-xs flex items-center justify-center gap-2 ${
                viewMode === "map" ? "bg-primary/30 border border-primary" : "bg-muted/20 border border-border hover:bg-muted/30"
              }`}
            >
              <Map className="w-4 h-4" />
              Map
            </button>
          </div>

          {/* Add External Camera Button */}
          <button
            onClick={() => setShowAddCamera(true)}
            className="w-full mt-2 px-3 py-2 rounded-lg bg-primary/20 border border-primary/30 hover:bg-primary/30 transition-colors text-xs flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add IP Camera
          </button>
        </div>

        {/* Add Camera Modal */}
        {showAddCamera && (
          <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-lg p-4 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-primary" />
                  <h3 className="font-bold">Add IP Camera</h3>
                </div>
                <button onClick={() => setShowAddCamera(false)} className="p-1 hover:bg-muted/30 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Camera Name *</label>
                  <input
                    type="text"
                    value={newCamera.name}
                    onChange={(e) => setNewCamera({ ...newCamera, name: e.target.value })}
                    placeholder="e.g., Front Door Camera"
                    className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Location</label>
                  <input
                    type="text"
                    value={newCamera.location}
                    onChange={(e) => setNewCamera({ ...newCamera, location: e.target.value })}
                    placeholder="e.g., Building Entrance"
                    className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Stream URL *</label>
                  <input
                    type="text"
                    value={newCamera.streamUrl}
                    onChange={(e) => setNewCamera({ ...newCamera, streamUrl: e.target.value })}
                    placeholder="http://192.168.1.x:8080/video"
                    className="w-full px-3 py-2 rounded-lg bg-muted/30 border border-border text-sm font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter MJPEG stream URL or snapshot URL from your IP camera
                  </p>
                </div>
                
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <p className="text-xs text-amber-400">
                    <AlertTriangle className="w-3 h-3 inline mr-1" />
                    Camera must be on the same network and accessible from this browser
                  </p>
                </div>
                
                <button
                  onClick={handleAddCamera}
                  className="w-full px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors"
                >
                  Add Camera
                </button>
              </div>
        </div>
          </div>
        )}

        <div className="overflow-y-auto flex-1">
          {viewMode === "list" ? (
            // List View
            cameras.map((camera) => (
              <div
                key={camera.id}
                onClick={() => setSelectedCamera(camera)}
                className={`p-3 border-b border-white/5 cursor-pointer transition-colors ${
                  selectedCamera.id === camera.id ? "bg-primary/20" : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {camera.isExternal ? (
                    <ExternalLink className={`w-4 h-4 ${getStatusColor(camera.status)}`} />
                  ) : (
                    <Video className={`w-4 h-4 ${getStatusColor(camera.status)}`} />
                  )}
                  <div className="font-bold text-sm flex-1">{camera.name}</div>
                  {camera.isExternal && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCamera(camera.id);
                      }}
                      className="p-1 hover:bg-destructive/20 rounded"
                    >
                      <X className="w-3 h-3 text-destructive" />
                    </button>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{camera.location}</div>
                <div className={`text-xs font-bold mt-1 ${getStatusColor(camera.status)}`}>
                  ● {camera.status.toUpperCase()} {camera.isExternal && "(External)"}
                </div>
              </div>
            ))
          ) : (
            // Map View
            <div className="p-4">
              <div className="relative w-full aspect-square bg-black/60 rounded-lg border border-white/10 mb-4">
                {/* Grid background */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(0deg, transparent 24%, rgba(0, 217, 255, 0.1) 25%, rgba(0, 217, 255, 0.1) 26%, transparent 27%),
                      linear-gradient(90deg, transparent 24%, rgba(0, 217, 255, 0.1) 25%, rgba(0, 217, 255, 0.1) 26%, transparent 27%)
                    `,
                    backgroundSize: '30px 30px'
                  }}
                />

                {/* Areas */}
                {areas.map((area) => {
                  const areaCameras = getAreaCameras(area.id);
                  const hasWarning = areaCameras.some(c => c.status === "warning");
                  const hasOffline = areaCameras.some(c => c.status === "offline");
                  
                  return (
                    <div
                      key={area.id}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group`}
                      style={{ left: area.x, top: area.y }}
                      onClick={() => setSelectedArea(area.id === selectedArea ? null : area.id)}
                    >
                      <div className={`relative w-16 h-16 rounded-lg ${area.color}/20 border-2 ${
                        hasOffline ? "border-destructive" : hasWarning ? "border-yellow-500" : `${area.color.replace("bg-", "border-")}`
                      } ${selectedArea === area.id ? "ring-2 ring-primary" : ""} hover:brightness-125 transition-all flex items-center justify-center`}>
                        <Camera className="w-6 h-6" />
                        <div className="absolute -top-2 -right-2 bg-black/80 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border border-current">
                          {areaCameras.length}
                        </div>
                      </div>
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap">
                        {area.name}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Area Cameras List */}
              {selectedArea && (
                <div>
                  <div className="text-xs font-bold text-primary mb-2">
                    {areas.find(a => a.id === selectedArea)?.name} Cameras
                  </div>
                  {getAreaCameras(selectedArea).map((camera) => (
                    <div
                      key={camera.id}
                      onClick={() => setSelectedCamera(camera)}
                      className={`p-2 mb-2 rounded-lg cursor-pointer transition-colors ${
                        selectedCamera.id === camera.id ? "bg-primary/20" : "bg-muted/20 hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Video className={`w-3 h-3 ${getStatusColor(camera.status)}`} />
                        <div className="text-xs font-bold">{camera.name}</div>
                      </div>
                      <div className={`text-xs mt-1 ${getStatusColor(camera.status)}`}>
                        ● {camera.status.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Camera Feed */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-white/5 bg-black/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-lg">{selectedCamera.name}</div>
              <div className="text-sm text-muted-foreground">{selectedCamera.location}</div>
            </div>
            <div className={`flex items-center gap-2 text-sm font-bold ${getStatusColor(selectedCamera.status)}`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
              {selectedCamera.status.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Video Feed */}
        <div className="flex-1 bg-black relative overflow-hidden">
          {selectedCamera.status === "offline" ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
                <div className="text-destructive font-bold text-lg">SIGNAL LOST</div>
                <div className="text-muted-foreground text-sm mt-2">Camera offline - maintenance required</div>
              </div>
            </div>
          ) : selectedCamera.isExternal && selectedCamera.streamUrl ? (
            <>
              {/* External IP Camera Feed */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src={selectedCamera.streamUrl} 
                  alt={selectedCamera.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden text-center">
                  <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <div className="text-yellow-500 font-bold text-lg">STREAM UNAVAILABLE</div>
                  <div className="text-muted-foreground text-sm mt-2">Unable to connect to camera stream</div>
                  <div className="text-xs text-muted-foreground mt-1 font-mono">{selectedCamera.streamUrl}</div>
                </div>
              </div>

              {/* Camera info overlay for external */}
              <div className="absolute top-4 left-4 font-mono text-xs space-y-1 text-primary">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                  <span>LIVE</span>
                </div>
                <div>{selectedCamera.id}</div>
                <div className="flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  External Feed
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Simulated camera feed with noise */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent">
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(0deg, transparent 24%, rgba(0, 217, 255, 0.05) 25%, rgba(0, 217, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 217, 255, 0.05) 75%, rgba(0, 217, 255, 0.05) 76%, transparent 77%, transparent),
                      linear-gradient(90deg, transparent 24%, rgba(0, 217, 255, 0.05) 25%, rgba(0, 217, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 217, 255, 0.05) 75%, rgba(0, 217, 255, 0.05) 76%, transparent 77%, transparent)
                    `,
                    backgroundSize: '50px 50px'
                  }}
                />
                
                {/* Scan lines */}
                <div 
                  className="absolute inset-0 opacity-30 pointer-events-none"
                  style={{
                    background: `linear-gradient(180deg, transparent ${scanLines}%, rgba(0, 217, 255, 0.1) ${scanLines + 1}%, transparent ${scanLines + 2}%)`
                  }}
                />

                {/* Static noise */}
                <div className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />
              </div>

              {/* Camera info overlay */}
              <div className="absolute top-4 left-4 font-mono text-xs space-y-1 text-primary">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                  <span>REC</span>
                </div>
                <div>{selectedCamera.id}</div>
                <div>{new Date().toLocaleTimeString()}</div>
              </div>

              {selectedCamera.status === "warning" && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="text-center animate-pulse">
                    <AlertTriangle className="w-20 h-20 text-yellow-500 mx-auto mb-3" />
                    <div className="text-yellow-500 font-bold text-xl">⚠ WARNING</div>
                    <div className="text-yellow-400 mt-2">Unusual activity detected</div>
                  </div>
                </div>
              )}

              {/* Location label */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="glass-panel p-3">
                  <div className="font-bold text-sm mb-1">{selectedCamera.location}</div>
                  <div className="text-xs text-muted-foreground">{selectedCamera.description}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
