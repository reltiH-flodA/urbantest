import { useState } from "react";
import { Shield, Github, Info, CheckCircle } from "lucide-react";

interface DisclaimerScreenProps {
  onAccept: () => void;
}

export const DisclaimerScreen = ({ onAccept }: DisclaimerScreenProps) => {
  const [understood, setUnderstood] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8 animate-fade-in">
          <Shield className="w-24 h-24 mx-auto mb-6 text-primary animate-pulse" />
          <h1 className="text-5xl font-bold mb-4 text-primary">UrbanShade OS</h1>
          <p className="text-xl text-muted-foreground">Deep-Sea Facility Management System</p>
        </div>

        <div className="glass-panel p-8 space-y-6">
          <div className="flex items-start gap-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <Info className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-bold text-yellow-500 text-lg">IMPORTANT DISCLAIMER</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This is a <strong>Fictional Operating system</strong> for fun and laughs.
                UrbanShade OS is not a real operating system and does not interact with your actual computer or files.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <h4 className="font-bold text-primary mb-2">🎮 What This Is:</h4>
              <ul className="space-y-1 ml-4">
                <li>• A web-based simulation of a fictional facility OS</li>
                <li>• Inspired by Urbanshade from Pressure</li>
                <li>• All features are simulated client-side in your browser</li>
                <li>• No real files, processes, or system operations</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <h4 className="font-bold text-primary mb-2">💾 Data Storage:</h4>
              <ul className="space-y-1 ml-4">
                <li>• All data is stored locally in your browser using <code className="bg-black/50 px-1 rounded">localStorage</code></li>
                <li>• No data is sent to external servers</li>
                <li>• Your settings and progress are saved in your browser only</li>
                <li>• <strong>Clearing browser data will reset the simulation</strong></li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-black/40 border border-white/10">
              <h4 className="font-bold text-primary mb-2">🔐 Privacy & Security:</h4>
              <ul className="space-y-1 ml-4">
                <li>• Do not enter real passwords or sensitive information</li>
                <li>• All "authentication" is purely simulated</li>
                <li>• This is not secure software - it's for entertainment</li>
                <li>• Hardcoded passwords are intentional easter eggs</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
              <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                <Github className="w-5 h-5" />
                Open Source Project
              </h4>
              <p className="mb-2">
                This project is open source and available on GitHub, made by aswdbatch:
              </p>
              <a
                href="https://github.com/aswdBatch/urbanshade-7e993958"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 border border-primary/30 hover:bg-primary/30 transition-colors"
              >
                <Github className="w-4 h-4" />
                View source on Github (offsite)
              </a>
            </div>
          </div>

        <div className="border-t border-white/10 pt-6 space-y-4">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-center">
              <p className="text-sm text-muted-foreground">
                Need help? Check out the{" "}
                <a 
                  href="/docs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold"
                >
                  User Documentation
                </a>
                {" "}for guides and information.
              </p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10 hover:border-primary/30 transition-colors">
              <input
                type="checkbox"
                checked={understood}
                onChange={(e) => setUnderstood(e.target.checked)}
                className="w-5 h-5 mt-1 cursor-pointer"
              />
              <div className="flex-1">
                <div className="font-bold text-primary mb-1">I Understand and Consent</div>
                <div className="text-xs text-muted-foreground">
                  I understand this is a fictional simulation. I consent to the use of localStorage 
                  for storing my settings and progress locally in my browser. I will not enter real 
                  sensitive information.
                </div>
              </div>
            </label>
          </div>

          <button
            onClick={onAccept}
            disabled={!understood}
            className="w-full px-8 py-4 rounded-lg bg-primary hover:bg-primary/80 text-black font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {understood ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Enter UrbanShade OS
              </>
            ) : (
              "Please read and accept to continue"
            )}
          </button>

          <p className="text-xs text-center text-muted-foreground">
            By proceeding, you agree to use this simulation for entertainment purposes only
          </p>
        </div>
      </div>
    </div>
  );
};
