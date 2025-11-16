import { useState, useEffect } from "react";
import { Package, Check, Download, Settings, X } from "lucide-react";
import { toast } from "sonner";

interface GenericInstallerProps {
  appName?: string;
  onComplete?: () => void;
}

export const GenericInstaller = ({ appName = "Application", onComplete }: GenericInstallerProps) => {
  const [stage, setStage] = useState<"welcome" | "options" | "installing" | "complete">("welcome");
  const [progress, setProgress] = useState(0);
  const [installLocation, setInstallLocation] = useState("C:\\Program Files\\");
  const [createShortcut, setCreateShortcut] = useState(true);
  const [pinToStart, setPinToStart] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);

  useEffect(() => {
    if (stage === "installing") {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStage("complete"), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleInstall = () => {
    setStage("installing");
  };

  const handleFinish = () => {
    if (pinToStart) {
      toast.success(`${appName} pinned to Start Menu`);
    }
    onComplete?.();
  };

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      {/* Header */}
      <div className="bg-muted/30 border-b border-border/50 p-4 flex items-center gap-3">
        <Package className="w-6 h-6 text-primary" />
        <h1 className="text-lg font-bold">Generic Installer v1.1</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {stage === "welcome" && (
          <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center animate-scale-in">
                <Package className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Welcome to {appName} Setup</h2>
              <p className="text-muted-foreground">
                This wizard will guide you through the installation of {appName}.
              </p>
            </div>

            <div className="bg-muted/20 border border-border/30 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                It is recommended that you close all other applications before continuing.
                Click Next to continue, or Cancel to exit Setup.
              </p>
            </div>
          </div>
        )}

        {stage === "options" && (
          <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold mb-4">Installation Options</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Install Location:</label>
                <input
                  type="text"
                  value={installLocation}
                  onChange={(e) => setInstallLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-muted/50 border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={createShortcut}
                    onChange={(e) => setCreateShortcut(e.target.checked)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm group-hover:text-primary transition-colors">Create desktop shortcut</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={pinToStart}
                    onChange={(e) => setPinToStart(e.target.checked)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm group-hover:text-primary transition-colors">Pin to Start Menu</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={autoUpdate}
                    onChange={(e) => setAutoUpdate(e.target.checked)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm group-hover:text-primary transition-colors">Enable automatic updates</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {stage === "installing" && (
          <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
            <div className="text-center space-y-4">
              <Download className="w-16 h-16 mx-auto text-primary animate-pulse" />
              <h2 className="text-xl font-bold">Installing {appName}</h2>
              <p className="text-muted-foreground">Please wait while Setup installs {appName}...</p>
            </div>

            <div className="space-y-2">
              <div className="h-6 bg-muted/30 rounded-full overflow-hidden border border-border/30">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 flex items-center justify-end pr-2"
                  style={{ width: `${progress}%` }}
                >
                  <span className="text-xs font-bold text-primary-foreground">{progress}%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {progress < 30 && "Extracting files..."}
                {progress >= 30 && progress < 60 && "Installing components..."}
                {progress >= 60 && progress < 90 && "Configuring settings..."}
                {progress >= 90 && "Finalizing installation..."}
              </p>
            </div>
          </div>
        )}

        {stage === "complete" && (
          <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center animate-scale-in">
                <Check className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold">Installation Complete</h2>
              <p className="text-muted-foreground">
                {appName} has been successfully installed on your computer.
              </p>
            </div>

            <div className="bg-muted/20 border border-border/30 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>Program files installed to {installLocation}</span>
              </div>
              {createShortcut && (
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Desktop shortcut created</span>
                </div>
              )}
              {pinToStart && (
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Pinned to Start Menu</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-muted/20 border-t border-border/50 p-4 flex justify-end gap-2">
        {stage === "welcome" && (
          <>
            <button
              onClick={() => onComplete?.()}
              className="px-4 py-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setStage("options")}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Next
            </button>
          </>
        )}

        {stage === "options" && (
          <>
            <button
              onClick={() => setStage("welcome")}
              className="px-4 py-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleInstall}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Install
            </button>
          </>
        )}

        {stage === "complete" && (
          <button
            onClick={handleFinish}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Finish
          </button>
        )}
      </div>
    </div>
  );
};
