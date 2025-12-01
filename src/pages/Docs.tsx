import { ArrowLeft, Terminal, Monitor, Settings, Folder, Shield, Keyboard, HelpCircle, Zap, Users, Map, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const Docs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">URBANSHADE OS Documentation</h1>
          <Link 
            to="/" 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        {/* Intro */}
        <section className="text-center space-y-4">
          <Terminal className="w-16 h-16 mx-auto text-primary" />
          <h2 className="text-4xl font-bold">Welcome to URBANSHADE OS</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A fictional deep-sea facility management operating system. This documentation covers all features, applications, and hidden secrets within the simulation.
          </p>
        </section>

        {/* Getting Started */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Monitor className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-bold">Getting Started</h3>
          </div>
          <div className="space-y-4 text-muted-foreground">
            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <h4 className="font-bold text-foreground mb-2">First Boot</h4>
              <p>When you first launch URBANSHADE OS, you'll go through the installation process, OOBE (Out of Box Experience), and create your admin account. Your data is stored locally in your browser.</p>
            </div>
            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <h4 className="font-bold text-foreground mb-2">Login</h4>
              <p>After setup, you'll be presented with a user selection screen. Select your account and enter your password to access the desktop.</p>
            </div>
            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <h4 className="font-bold text-foreground mb-2">Desktop Navigation</h4>
              <p>The desktop features icons for quick access to applications, a taskbar at the bottom with the Start Menu, and window management for open applications.</p>
            </div>
          </div>
        </section>

        {/* Core Applications */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Folder className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-bold">Core Applications</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <h4 className="font-bold text-foreground mb-2">📁 File Explorer</h4>
              <p className="text-sm text-muted-foreground">Browse the simulated file system, view documents, and navigate facility directories.</p>
            </div>
            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <h4 className="font-bold text-foreground mb-2">💻 Terminal</h4>
              <p className="text-sm text-muted-foreground">Command-line interface with various commands. Type <code className="bg-black/50 px-1 rounded">help</code> to see available commands.</p>
            </div>
            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <h4 className="font-bold text-foreground mb-2">📊 Task Manager</h4>
              <p className="text-sm text-muted-foreground">View running processes and system resource usage.</p>
            </div>
            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <h4 className="font-bold text-foreground mb-2">⚙️ Settings</h4>
              <p className="text-sm text-muted-foreground">Configure system preferences, manage accounts, and export/import system data.</p>
            </div>
            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <h4 className="font-bold text-foreground mb-2">🌐 Browser</h4>
              <p className="text-sm text-muted-foreground">Access the facility intranet with documentation and internal resources.</p>
            </div>
            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <h4 className="font-bold text-foreground mb-2">📝 Notepad</h4>
              <p className="text-sm text-muted-foreground">Simple text editor for notes and documents.</p>
            </div>
          </div>
        </section>

        {/* Facility Applications */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Map className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-bold">Facility Applications</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <h4 className="font-bold text-foreground mb-2">📹 Security Cameras</h4>
              <p className="text-sm text-muted-foreground">Monitor facility areas through the camera system.</p>
            </div>
            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <h4 className="font-bold text-foreground mb-2">🔒 Containment Monitor</h4>
              <p className="text-sm text-muted-foreground">Track containment status and specimen information.</p>
            </div>
            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <h4 className="font-bold text-foreground mb-2">⚡ Power Grid</h4>
              <p className="text-sm text-muted-foreground">Manage facility power distribution and systems.</p>
            </div>
            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <h4 className="font-bold text-foreground mb-2">🗺️ Facility Planner</h4>
              <p className="text-sm text-muted-foreground">View and edit facility layout and room configurations.</p>
            </div>
            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <h4 className="font-bold text-foreground mb-2">👥 Personnel Directory</h4>
              <p className="text-sm text-muted-foreground">Access staff information and contact details.</p>
            </div>
            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <h4 className="font-bold text-foreground mb-2">🚨 Emergency Protocols</h4>
              <p className="text-sm text-muted-foreground">Initiate and manage emergency procedures.</p>
            </div>
          </div>
        </section>

        {/* Advanced Features */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-bold">Advanced Features</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
              <h4 className="font-bold text-primary mb-2">🔧 BIOS Access</h4>
              <p className="text-sm text-muted-foreground mb-2">Press <kbd className="px-2 py-1 bg-black/50 rounded border border-white/20">DEL</kbd> during boot to access BIOS settings.</p>
              <p className="text-xs text-muted-foreground">Configure boot order, system settings, and hardware options.</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
              <h4 className="font-bold text-primary mb-2">🔄 Recovery Mode</h4>
              <p className="text-sm text-muted-foreground mb-2">Press <kbd className="px-2 py-1 bg-black/50 rounded border border-white/20">F2</kbd> during boot to enter Recovery Mode.</p>
              <p className="text-xs text-muted-foreground">Reset passwords, repair system, or perform factory reset.</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
              <h4 className="font-bold text-primary mb-2">🛡️ Admin Panel</h4>
              <p className="text-sm text-muted-foreground mb-2">Access administrative controls for system management.</p>
              <p className="text-xs text-muted-foreground">Hint: Try typing <code className="bg-black/50 px-1 rounded">secret</code> in the Terminal...</p>
            </div>
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <h4 className="font-bold text-yellow-500 mb-2">⚠️ Maintenance Mode</h4>
              <p className="text-sm text-muted-foreground">System maintenance state for administrative tasks.</p>
            </div>
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
              <h4 className="font-bold text-destructive mb-2">🔐 Lockdown Mode</h4>
              <p className="text-sm text-muted-foreground">Emergency lockdown state that restricts system access.</p>
            </div>
          </div>
        </section>

        {/* Terminal Commands */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Terminal className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-bold">Terminal Commands</h3>
          </div>
          <div className="p-4 rounded-lg bg-black/60 border border-white/10 font-mono text-sm space-y-2">
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <span className="text-primary">help</span>
              <span className="text-muted-foreground">Display available commands</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <span className="text-primary">clear</span>
              <span className="text-muted-foreground">Clear terminal screen</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <span className="text-primary">status</span>
              <span className="text-muted-foreground">Show system status</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <span className="text-primary">whoami</span>
              <span className="text-muted-foreground">Display current user</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <span className="text-primary">date</span>
              <span className="text-muted-foreground">Show current date/time</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <span className="text-primary">ls</span>
              <span className="text-muted-foreground">List directory contents</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <span className="text-primary">cd</span>
              <span className="text-muted-foreground">Change directory</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <span className="text-primary">cat</span>
              <span className="text-muted-foreground">Display file contents</span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <span className="text-primary">secret</span>
              <span className="text-muted-foreground">???</span>
            </div>
          </div>
        </section>

        {/* Keyboard Shortcuts */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Keyboard className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-bold">Keyboard Shortcuts</h3>
          </div>
          <div className="p-4 rounded-lg bg-black/40 border border-white/10 space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-muted-foreground">Access BIOS</span>
              <kbd className="px-3 py-1 bg-black/50 rounded border border-white/20 text-sm">DEL</kbd>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-muted-foreground">Recovery Mode</span>
              <kbd className="px-3 py-1 bg-black/50 rounded border border-white/20 text-sm">F2</kbd>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-muted-foreground">Open Start Menu</span>
              <kbd className="px-3 py-1 bg-black/50 rounded border border-white/20 text-sm">Win</kbd>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Close Window</span>
              <kbd className="px-3 py-1 bg-black/50 rounded border border-white/20 text-sm">Alt + F4</kbd>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-bold">Troubleshooting</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <h4 className="font-bold text-foreground mb-2">Forgot Password?</h4>
              <p className="text-sm text-muted-foreground">Press F2 during boot to enter Recovery Mode and reset your password.</p>
            </div>
            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <h4 className="font-bold text-foreground mb-2">System Not Loading?</h4>
              <p className="text-sm text-muted-foreground">Try clearing your browser's localStorage for this site, or use the Recovery Mode factory reset option.</p>
            </div>
            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <h4 className="font-bold text-foreground mb-2">Lost All Data?</h4>
              <p className="text-sm text-muted-foreground">If you have an exported system image, you can import it via Settings → System → Import System Image.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-white/10">
          <p className="text-sm text-muted-foreground">
            URBANSHADE OS Documentation • v3.2.1 • © 2024 Urbanshade Corporation
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            This is a fictional simulation for entertainment purposes only.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Docs;
