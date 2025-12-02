import { Power, LogOut, Lock, MessageSquare, RotateCcw } from "lucide-react";

interface ShutdownOptionsDialogProps {
  onClose: () => void;
  onShutdown: () => void;
  onSignOut: () => void;
  onLock: () => void;
  onRestart: () => void;
}

export const ShutdownOptionsDialog = ({ 
  onClose, 
  onShutdown, 
  onSignOut, 
  onLock,
  onRestart 
}: ShutdownOptionsDialogProps) => {
  const options = [
    { icon: Power, label: "Shut down", action: onShutdown, color: "text-red-400" },
    { icon: LogOut, label: "Sign out", action: onSignOut, color: "text-cyan-400" },
    { icon: Lock, label: "Lock", action: onLock, color: "text-yellow-400" },
    { icon: RotateCcw, label: "Restart", action: onRestart, color: "text-green-400" },
    { icon: MessageSquare, label: "Feedback", action: () => window.open("https://github.com", "_blank"), color: "text-blue-400" },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]"
      onClick={onClose}
    >
      {/* Dialog */}
      <div 
        className="bg-slate-800/90 backdrop-blur border border-slate-600/50 rounded-xl p-2 shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1">
          {options.map((option, i) => (
            <button
              key={i}
              onClick={() => {
                option.action();
                onClose();
              }}
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-white/10 transition-all group min-w-[80px]"
            >
              <div className={`p-3 rounded-lg bg-slate-700/50 group-hover:bg-slate-600/50 transition-colors`}>
                <option.icon className={`w-6 h-6 ${option.color}`} />
              </div>
              <span className="text-xs text-slate-300 group-hover:text-white transition-colors">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
