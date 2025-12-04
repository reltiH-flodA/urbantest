import { useState, useEffect } from "react";
import { Taskbar } from "./Taskbar";
import { DesktopIcon } from "./DesktopIcon";
import { StartMenu } from "./StartMenu";
import { WindowManager } from "./WindowManager";
import { RecoveryMode } from "./RecoveryMode";
import { ContextMenu, getDesktopMenuItems } from "./ContextMenu";
import { FileText, Database, Activity, Radio, FileBox, AlertTriangle, Terminal, Users, Wifi, Cpu, Mail, Globe, Music, Camera, Shield, MapPin, BookOpen, Zap, Wind, Calculator as CalcIcon, Lock, FileWarning, Grid3x3, ShoppingBag, StickyNote, Palette, Volume2, CloudRain, Clock as ClockIcon, Calendar, Newspaper, Key, HardDrive, FileArchive, FileText as PdfIcon, Sheet, Presentation, Video, Image, Mic, Gamepad2, MessageSquare, VideoIcon, MailOpen, FolderUp, TerminalSquare, Network, HardDrive as DiskIcon, Settings as SettingsIcon, Activity as PerformanceIcon, ScanLine, Languages, BookOpenCheck, Globe2, MapPinned, Telescope, Beaker, Calculator as PhysicsIcon, Fingerprint, Lock as EncryptionIcon, KeyRound, Download, Puzzle, Skull, Monitor } from "lucide-react";
import { toast } from "sonner";

export interface App {
  id: string;
  name: string;
  icon: React.ReactNode;
  run: () => void;
  minimalInclude?: boolean;
  standardInclude?: boolean;
  downloadable?: boolean;
}

export const Desktop = ({ 
  onLogout, 
  onReboot, 
  onShutdown,
  onCriticalKill, 
  onLockdown, 
  onEnterBios, 
  onUpdate 
}: { 
  onLogout: () => void; 
  onReboot: () => void; 
  onShutdown?: () => void;
  onCriticalKill: (processName: string, type?: "kernel" | "virus" | "bluescreen" | "memory" | "corruption" | "overload") => void; 
  onLockdown?: (protocolName: string) => void; 
  onEnterBios?: () => void; 
  onUpdate?: () => void; 
}) => {
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [windows, setWindows] = useState<Array<{ id: string; app: App; zIndex: number; minimized?: boolean }>>([]);
  const [nextZIndex, setNextZIndex] = useState(100);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  
  // Load background gradient from settings
  const [bgGradient, setBgGradient] = useState(() => {
    const start = localStorage.getItem('settings_bg_gradient_start') || '#1a1a2e';
    const end = localStorage.getItem('settings_bg_gradient_end') || '#16213e';
    return { start, end };
  });

  // Listen for settings changes
  useEffect(() => {
    const handleStorageChange = () => {
      const start = localStorage.getItem('settings_bg_gradient_start') || '#1a1a2e';
      const end = localStorage.getItem('settings_bg_gradient_end') || '#16213e';
      setBgGradient({ start, end });
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen for installer window requests
  useEffect(() => {
    const handleOpenInstaller = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { appName } = customEvent.detail;
      const installerApp = {
        id: "installer",
        name: `${appName} Setup`,
        icon: <Download className="w-11 h-11" />,
        run: () => {}
      };
      openWindow(installerApp);
    };
    window.addEventListener('open-installer', handleOpenInstaller);
    return () => window.removeEventListener('open-installer', handleOpenInstaller);
  }, [nextZIndex]);

  const [installedApps, setInstalledApps] = useState<string[]>(() => {
    const installed = localStorage.getItem('urbanshade_installed_apps');
    return installed ? JSON.parse(installed) : [];
  });

  const openWindow = (app: App) => {
    const existing = windows.find(w => w.id === app.id);
    if (existing) {
      // Bring to front
      setWindows(prev => prev.map(w => 
        w.id === app.id ? { ...w, zIndex: nextZIndex } : w
      ));
      setNextZIndex(prev => prev + 1);
    } else {
      setWindows(prev => [...prev, { id: app.id, app, zIndex: nextZIndex }]);
      setNextZIndex(prev => prev + 1);
    }
    setStartMenuOpen(false);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, minimized: true } : w
    ));
  };

  const restoreWindow = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, minimized: false, zIndex: nextZIndex } : w
    ));
    setNextZIndex(prev => prev + 1);
  };

  const focusWindow = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: nextZIndex, minimized: false } : w
    ));
    setNextZIndex(prev => prev + 1);
  };

  // Get installation type to filter apps
  const installType = localStorage.getItem('urbanshade_install_type') || 'standard';

  // Helper to open app by ID - fixes the icon shift bug
  const openAppById = (appId: string) => {
    const app = allApps.find(a => a.id === appId);
    if (app) openWindow(app);
  };
  
  const allApps: App[] = [
    {
      id: "app-store",
      name: "App Store",
      icon: <ShoppingBag className="w-11 h-11" />,
      run: () => openAppById("app-store"),
      minimalInclude: true
    },
    {
      id: "explorer",
      name: "File Explorer",
      icon: <FileText className="w-11 h-11" />,
      run: () => openAppById("explorer"),
      minimalInclude: true
    },
    {
      id: "monitor",
      name: "System Monitor",
      icon: <Activity className="w-11 h-11" />,
      run: () => openAppById("monitor"),
      minimalInclude: true
    },
    {
      id: "personnel",
      name: "Personnel",
      icon: <Users className="w-11 h-11" />,
      run: () => openAppById("personnel"),
      standardInclude: true
    },
    {
      id: "logger",
      name: "Action Logger",
      icon: <Database className="w-11 h-11" />,
      run: () => openAppById("logger"),
      minimalInclude: true
    },
    {
      id: "network",
      name: "Network Scanner",
      icon: <Wifi className="w-11 h-11" />,
      run: () => openAppById("network"),
      standardInclude: true
    },
    {
      id: "terminal",
      name: "Terminal",
      icon: <Terminal className="w-11 h-11" />,
      run: () => openAppById("terminal"),
      minimalInclude: true
    },
    {
      id: "task-manager",
      name: "Task Manager",
      icon: <Cpu className="w-11 h-11" />,
      run: () => openAppById("task-manager"),
      minimalInclude: true
    },
    {
      id: "messages",
      name: "Messages",
      icon: <Mail className="w-11 h-11" />,
      run: () => openAppById("messages"),
      standardInclude: true
    },
    {
      id: "incidents",
      name: "Incidents",
      icon: <FileWarning className="w-11 h-11" />,
      run: () => openAppById("incidents"),
      standardInclude: true
    },
    {
      id: "database",
      name: "Specimen DB",
      icon: <Database className="w-11 h-11" />,
      run: () => openAppById("database"),
      standardInclude: true
    },
    {
      id: "browser",
      name: "Browser",
      icon: <Globe className="w-11 h-11" />,
      run: () => openAppById("browser"),
      minimalInclude: true
    },
    {
      id: "audio-logs",
      name: "Audio Logs",
      icon: <Music className="w-11 h-11" />,
      run: () => openAppById("audio-logs")
    },
    {
      id: "cameras",
      name: "Security Cameras",
      icon: <Camera className="w-11 h-11" />,
      run: () => openAppById("cameras"),
      standardInclude: true
    },
    {
      id: "protocols",
      name: "Emergency Protocols",
      icon: <Shield className="w-11 h-11" />,
      run: () => openAppById("protocols"),
      standardInclude: true
    },
    {
      id: "map",
      name: "Facility Map",
      icon: <MapPin className="w-11 h-11" />,
      run: () => openAppById("map"),
      standardInclude: true
    },
    {
      id: "research",
      name: "Research Notes",
      icon: <BookOpen className="w-11 h-11" />,
      run: () => openAppById("research")
    },
    {
      id: "power",
      name: "Power Grid",
      icon: <Zap className="w-11 h-11" />,
      run: () => openAppById("power")
    },
    {
      id: "containment",
      name: "Containment",
      icon: <Lock className="w-11 h-11" />,
      run: () => openAppById("containment")
    },
    {
      id: "environment",
      name: "Environment",
      icon: <Wind className="w-11 h-11" />,
      run: () => openAppById("environment")
    },
    {
      id: "calculator",
      name: "Calculator",
      icon: <CalcIcon className="w-11 h-11" />,
      run: () => openAppById("calculator"),
      minimalInclude: true
    },
    {
      id: "planner",
      name: "Facility Planner",
      icon: <Grid3x3 className="w-11 h-11" />,
      run: () => openAppById("planner"),
      standardInclude: true
    },
    {
      id: "computer-management",
      name: "Computer Mgmt",
      icon: <Monitor className="w-11 h-11" />,
      run: () => openAppById("computer-management"),
      standardInclude: true
    },
    {
      id: "downloads",
      name: "Downloads",
      icon: <Download className="w-11 h-11" />,
      run: () => openAppById("downloads"),
      minimalInclude: true
    },
    {
      id: "plugin-store",
      name: "Plugin Store",
      icon: <Puzzle className="w-11 h-11" />,
      run: () => openAppById("plugin-store"),
      minimalInclude: true
    },
    {
      id: "crash-app",
      name: "System Crash",
      icon: <Skull className="w-11 h-11" />,
      run: () => openAppById("crash-app")
    },
    {
      id: "settings",
      name: "Settings",
      icon: <SettingsIcon className="w-11 h-11" />,
      run: () => openAppById("settings"),
      minimalInclude: true
    },
    {
      id: "file-reader",
      name: "File Reader",
      icon: <FileText className="w-11 h-11" />,
      run: () => openAppById("file-reader"),
      standardInclude: true
    },
    // Downloadable Apps
    {
      id: "notepad",
      name: "Notepad",
      icon: <StickyNote className="w-11 h-11" />,
      run: () => openAppById("notepad"),
      downloadable: true
    },
    {
      id: "paint",
      name: "Paint Tool",
      icon: <Palette className="w-11 h-11" />,
      run: () => openAppById("paint"),
      downloadable: true
    },
    {
      id: "music-player",
      name: "Media Player",
      icon: <Volume2 className="w-11 h-11" />,
      run: () => openAppById("music-player"),
      downloadable: true
    },
    {
      id: "weather",
      name: "Weather Monitor",
      icon: <CloudRain className="w-11 h-11" />,
      run: () => openAppById("weather"),
      downloadable: true
    },
    {
      id: "clock",
      name: "World Clock",
      icon: <ClockIcon className="w-11 h-11" />,
      run: () => openAppById("clock"),
      downloadable: true
    },
    {
      id: "calendar",
      name: "Event Calendar",
      icon: <Calendar className="w-11 h-11" />,
      run: () => openAppById("calendar"),
      downloadable: true
    },
    {
      id: "notes",
      name: "Advanced Notes",
      icon: <Newspaper className="w-11 h-11" />,
      run: () => openAppById("notes"),
      downloadable: true
    },
    {
      id: "vpn",
      name: "Secure VPN",
      icon: <Shield className="w-11 h-11" />,
      run: () => openAppById("vpn"),
      downloadable: true
    },
    {
      id: "firewall",
      name: "Network Firewall",
      icon: <Shield className="w-11 h-11" />,
      run: () => openAppById("firewall"),
      downloadable: true
    },
    {
      id: "antivirus",
      name: "Virus Scanner",
      icon: <Shield className="w-11 h-11" />,
      run: () => openAppById("antivirus"),
      downloadable: true
    },
    {
      id: "backup",
      name: "Data Backup",
      icon: <HardDrive className="w-11 h-11" />,
      run: () => openAppById("backup"),
      downloadable: true
    },
    {
      id: "compression",
      name: "File Compressor",
      icon: <FileArchive className="w-11 h-11" />,
      run: () => openAppById("compression"),
      downloadable: true
    },
    {
      id: "pdf-reader",
      name: "PDF Viewer",
      icon: <PdfIcon className="w-11 h-11" />,
      run: () => openAppById("pdf-reader"),
      downloadable: true
    },
    {
      id: "spreadsheet",
      name: "Data Sheets",
      icon: <Sheet className="w-11 h-11" />,
      run: () => openAppById("spreadsheet"),
      downloadable: true
    },
    {
      id: "presentation",
      name: "Slide Maker",
      icon: <Presentation className="w-11 h-11" />,
      run: () => openAppById("presentation"),
      downloadable: true
    },
    {
      id: "video-editor",
      name: "Video Editor",
      icon: <Video className="w-11 h-11" />,
      run: () => openAppById("video-editor"),
      downloadable: true
    },
    {
      id: "image-viewer",
      name: "Photo Gallery",
      icon: <Image className="w-11 h-11" />,
      run: () => openAppById("image-viewer"),
      downloadable: true
    },
    {
      id: "audio-editor",
      name: "Sound Editor",
      icon: <Mic className="w-11 h-11" />,
      run: () => openAppById("audio-editor"),
      downloadable: true
    },
    {
      id: "game-center",
      name: "Game Hub",
      icon: <Gamepad2 className="w-11 h-11" />,
      run: () => openAppById("game-center"),
      downloadable: true
    },
    {
      id: "chat",
      name: "Instant Chat",
      icon: <MessageSquare className="w-11 h-11" />,
      run: () => openAppById("chat"),
      downloadable: true
    },
    {
      id: "video-call",
      name: "Video Conference",
      icon: <VideoIcon className="w-11 h-11" />,
      run: () => openAppById("video-call"),
      downloadable: true
    },
    {
      id: "email-client",
      name: "Mail Client Pro",
      icon: <MailOpen className="w-11 h-11" />,
      run: () => openAppById("email-client"),
      downloadable: true
    },
    {
      id: "ftp",
      name: "FTP Manager",
      icon: <FolderUp className="w-11 h-11" />,
      run: () => openAppById("ftp"),
      downloadable: true
    },
    {
      id: "ssh",
      name: "SSH Terminal",
      icon: <TerminalSquare className="w-11 h-11" />,
      run: () => openAppById("ssh"),
      downloadable: true
    },
    {
      id: "packet-analyzer",
      name: "Packet Sniffer",
      icon: <Network className="w-11 h-11" />,
      run: () => openAppById("packet-analyzer"),
      downloadable: true
    },
    {
      id: "disk-manager",
      name: "Disk Utility",
      icon: <DiskIcon className="w-11 h-11" />,
      run: () => openAppById("disk-manager"),
      downloadable: true
    },
    {
      id: "registry",
      name: "Registry Editor",
      icon: <Key className="w-11 h-11" />,
      run: () => openAppById("registry"),
      downloadable: true
    },
    {
      id: "performance",
      name: "Performance Analyzer",
      icon: <PerformanceIcon className="w-11 h-11" />,
      run: () => openAppById("performance"),
      downloadable: true
    },
    {
      id: "scanner",
      name: "Document Scanner",
      icon: <ScanLine className="w-11 h-11" />,
      run: () => openAppById("scanner"),
      downloadable: true
    },
    {
      id: "translator",
      name: "Language Translator",
      icon: <Languages className="w-11 h-11" />,
      run: () => openAppById("translator"),
      downloadable: true
    },
    {
      id: "dictionary",
      name: "Digital Dictionary",
      icon: <BookOpenCheck className="w-11 h-11" />,
      run: () => openAppById("dictionary"),
      downloadable: true
    },
    {
      id: "encyclopedia",
      name: "Encyclopedia",
      icon: <Globe2 className="w-11 h-11" />,
      run: () => openAppById("encyclopedia"),
      downloadable: true
    },
    {
      id: "map-viewer",
      name: "Map Navigator",
      icon: <MapPinned className="w-11 h-11" />,
      run: () => openAppById("map-viewer"),
      downloadable: true
    },
    {
      id: "gps",
      name: "GPS Tracker",
      icon: <MapPin className="w-11 h-11" />,
      run: () => openAppById("gps"),
      downloadable: true
    },
    {
      id: "astronomy",
      name: "Star Chart",
      icon: <Telescope className="w-11 h-11" />,
      run: () => openAppById("astronomy"),
      downloadable: true
    },
    {
      id: "chemistry",
      name: "Chemistry Lab",
      icon: <Beaker className="w-11 h-11" />,
      run: () => openAppById("chemistry"),
      downloadable: true
    },
    {
      id: "physics",
      name: "Physics Simulator",
      icon: <PhysicsIcon className="w-11 h-11" />,
      run: () => openAppById("physics"),
      downloadable: true
    },
    {
      id: "biometric",
      name: "Biometric Scanner",
      icon: <Fingerprint className="w-11 h-11" />,
      run: () => openAppById("biometric"),
      downloadable: true
    },
    {
      id: "encryption",
      name: "File Encryptor",
      icon: <EncryptionIcon className="w-11 h-11" />,
      run: () => openAppById("encryption"),
      downloadable: true
    },
    {
      id: "password-manager",
      name: "Password Vault",
      icon: <KeyRound className="w-11 h-11" />,
      run: () => openAppById("password-manager"),
      downloadable: true
    },
    {
      id: "img-editor",
      name: ".Img Editor",
      icon: <FileArchive className="w-11 h-11" />,
      run: () => openAppById("img-editor"),
      downloadable: true
    },
    {
      id: "account-settings",
      name: "Account Settings",
      icon: <Users className="w-11 h-11" />,
      run: () => openAppById("account-settings"),
      minimalInclude: true
    }
  ];

  // Listen for app installations
  useEffect(() => {
    const handleStorage = () => {
      const installed = localStorage.getItem('urbanshade_installed_apps');
      setInstalledApps(installed ? JSON.parse(installed) : []);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Filter apps based on installation type and installed apps
  const apps = allApps.filter(app => {
    // If app is downloadable, only show if installed
    if (app.downloadable) {
      return installedApps.includes(app.id);
    }
    
    // For base apps, filter by install type
    if (installType === 'minimal') {
      return app.minimalInclude === true || app.id === 'app-store';
    } else if (installType === 'standard') {
      return app.minimalInclude === true || app.standardInclude === true || app.id === 'app-store';
    } else {
      // Full installation shows all base (non-downloadable) apps
      return true;
    }
  });

  const desktopApps = apps;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const settingsApp = allApps.find(app => app.id === 'settings');

  return (
    <div 
      className="relative h-screen w-full overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${bgGradient.start} 0%, ${bgGradient.end} 100%)`
      }}
      onContextMenu={handleContextMenu}
    >
      {/* Desktop Icons - Static Grid Layout (no dragging) */}
      <div className="relative z-10 p-7">
        <div className="grid grid-cols-10 gap-2" style={{ minHeight: 'calc(100vh - 120px)' }}>
          {desktopApps.map((app) => (
            <div key={app.id} className="w-[100px]">
              <DesktopIcon 
                app={app} 
                onOpen={openWindow}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Windows */}
      <WindowManager 
        windows={windows} 
        onClose={closeWindow}
        onFocus={focusWindow}
        onMinimize={minimizeWindow}
        allWindows={windows}
        onCloseWindow={closeWindow}
        onCriticalKill={onCriticalKill}
        onLockdown={onLockdown}
        onUpdate={onUpdate}
      />

      {/* Start Menu */}
      <StartMenu 
        open={startMenuOpen} 
        apps={apps}
        onClose={() => setStartMenuOpen(false)}
        onOpenApp={openWindow}
        onReboot={onReboot}
        onShutdown={onShutdown}
        onLogout={onLogout}
      />

      {/* Taskbar */}
      <Taskbar 
        onStartClick={() => setStartMenuOpen(!startMenuOpen)}
        pinnedApps={apps.slice(0, 4)}
        onPinnedClick={openWindow}
        windows={windows}
        onRestoreWindow={restoreWindow}
        onShutdown={onShutdown}
        onReboot={onReboot}
        onLogout={onLogout}
      />

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={getDesktopMenuItems(
            () => toast.info("Folder creation coming soon!"),
            () => settingsApp && openWindow(settingsApp)
          )}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};
