import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

export type CrashType = 
  | "KERNEL_PANIC" 
  | "CRITICAL_PROCESS_DIED" 
  | "SYSTEM_SERVICE_EXCEPTION" 
  | "MEMORY_MANAGEMENT" 
  | "IRQL_NOT_LESS_OR_EQUAL"
  | "PAGE_FAULT_IN_NONPAGED_AREA"
  | "DRIVER_IRQL_NOT_LESS_OR_EQUAL"
  | "SYSTEM_THREAD_EXCEPTION_NOT_HANDLED"
  | "UNEXPECTED_KERNEL_MODE_TRAP"
  | "KMODE_EXCEPTION_NOT_HANDLED"
  | "INACCESSIBLE_BOOT_DEVICE"
  | "VIDEO_TDR_FAILURE"
  | "WHEA_UNCORRECTABLE_ERROR"
  | "DPC_WATCHDOG_VIOLATION"
  | "CLOCK_WATCHDOG_TIMEOUT"
  | "custom";

export interface CrashData {
  stopCode: CrashType;
  process?: string;
  module?: string;
  address?: string;
  description?: string;
  collectingData?: boolean;
}

interface CrashScreenProps {
  onReboot: () => void;
  crashData?: CrashData;
  killedProcess?: string;
  crashType?: "kernel" | "virus" | "bluescreen" | "memory" | "corruption" | "overload";
  customData?: { title: string; message: string } | null;
}

// UrbanShade themed crash screen - clean, minimal, professional
const CRASH_THEMES: Record<CrashType, { 
  accentColor: string;
  emoticon: string;
  title: string;
  subtitle: string;
}> = {
  KERNEL_PANIC: {
    accentColor: "#00d4ff",
    emoticon: ":(",
    title: "System ran into a problem",
    subtitle: "We're collecting diagnostic data and will restart shortly."
  },
  CRITICAL_PROCESS_DIED: {
    accentColor: "#00d4ff",
    emoticon: ":(",
    title: "A critical process has stopped",
    subtitle: "The system cannot continue without this process."
  },
  SYSTEM_SERVICE_EXCEPTION: {
    accentColor: "#00d4ff",
    emoticon: ":/",
    title: "System service exception",
    subtitle: "A system service encountered an unexpected error."
  },
  MEMORY_MANAGEMENT: {
    accentColor: "#00d4ff",
    emoticon: ":0",
    title: "Memory management error",
    subtitle: "The system detected a memory allocation failure."
  },
  IRQL_NOT_LESS_OR_EQUAL: {
    accentColor: "#00d4ff",
    emoticon: ":|",
    title: "IRQL violation detected",
    subtitle: "A process accessed memory at an invalid level."
  },
  PAGE_FAULT_IN_NONPAGED_AREA: {
    accentColor: "#00d4ff",
    emoticon: ":X",
    title: "Page fault in nonpaged area",
    subtitle: "Invalid memory was referenced."
  },
  DRIVER_IRQL_NOT_LESS_OR_EQUAL: {
    accentColor: "#00d4ff",
    emoticon: ":\\",
    title: "Driver IRQL violation",
    subtitle: "A driver accessed memory incorrectly."
  },
  SYSTEM_THREAD_EXCEPTION_NOT_HANDLED: {
    accentColor: "#00d4ff",
    emoticon: ":#",
    title: "Thread exception not handled",
    subtitle: "A system thread generated an unhandled exception."
  },
  UNEXPECTED_KERNEL_MODE_TRAP: {
    accentColor: "#00d4ff",
    emoticon: ":?",
    title: "Unexpected kernel trap",
    subtitle: "The kernel encountered an unexpected trap."
  },
  KMODE_EXCEPTION_NOT_HANDLED: {
    accentColor: "#00d4ff",
    emoticon: ":!",
    title: "Kernel exception not handled",
    subtitle: "A kernel mode exception was not caught."
  },
  INACCESSIBLE_BOOT_DEVICE: {
    accentColor: "#00d4ff",
    emoticon: ":'(",
    title: "Boot device inaccessible",
    subtitle: "The system cannot access the boot device."
  },
  VIDEO_TDR_FAILURE: {
    accentColor: "#00d4ff",
    emoticon: ":v",
    title: "Display driver timeout",
    subtitle: "The display driver failed to respond in time."
  },
  WHEA_UNCORRECTABLE_ERROR: {
    accentColor: "#00d4ff",
    emoticon: ":(",
    title: "Hardware error detected",
    subtitle: "A fatal hardware error has occurred."
  },
  DPC_WATCHDOG_VIOLATION: {
    accentColor: "#00d4ff",
    emoticon: ":@",
    title: "DPC watchdog violation",
    subtitle: "A deferred procedure call exceeded timeout."
  },
  CLOCK_WATCHDOG_TIMEOUT: {
    accentColor: "#00d4ff",
    emoticon: ":>",
    title: "Clock watchdog timeout",
    subtitle: "Processor clock interrupt was not received."
  },
  custom: {
    accentColor: "#00d4ff",
    emoticon: ":(",
    title: "System error",
    subtitle: "The system encountered an error."
  }
};

export const CrashScreen = ({ 
  onReboot, 
  crashData,
  killedProcess, 
  crashType = "kernel", 
  customData 
}: CrashScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"collecting" | "ready">("collecting");
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [qrCode, setQrCode] = useState<string[]>([]);

  // Convert legacy props to new format
  const resolvedCrashData: CrashData = crashData || {
    stopCode: crashType === "bluescreen" ? "CRITICAL_PROCESS_DIED" :
              crashType === "memory" ? "MEMORY_MANAGEMENT" :
              crashType === "overload" ? "DPC_WATCHDOG_VIOLATION" :
              crashType === "virus" ? "SYSTEM_SERVICE_EXCEPTION" :
              "KERNEL_PANIC",
    process: killedProcess || customData?.title,
    description: customData?.message
  };

  const theme = CRASH_THEMES[resolvedCrashData.stopCode] || CRASH_THEMES.KERNEL_PANIC;

  useEffect(() => {
    // Progress to 100%
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setPhase("ready");
          return 100;
        }
        return prev + Math.random() * 3;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Generate fake QR code pattern
  useEffect(() => {
    const size = 21;
    const pattern: string[] = [];
    for (let i = 0; i < size; i++) {
      let row = '';
      for (let j = 0; j < size; j++) {
        // Fixed corners for QR authenticity
        const isCorner = (i < 7 && j < 7) || (i < 7 && j >= size - 7) || (i >= size - 7 && j < 7);
        if (isCorner) {
          const isOuter = i === 0 || i === 6 || j === 0 || j === 6 || 
                          (i >= size - 7 && (i === size - 7 || i === size - 1)) ||
                          (j >= size - 7 && (j === size - 7 || j === size - 1));
          const isInner = (i >= 2 && i <= 4 && j >= 2 && j <= 4) ||
                          (i >= 2 && i <= 4 && j >= size - 5 && j <= size - 3) ||
                          (i >= size - 5 && i <= size - 3 && j >= 2 && j <= 4);
          row += (isOuter || isInner) ? '█' : ' ';
        } else {
          row += Math.random() > 0.5 ? '█' : ' ';
        }
      }
      pattern.push(row);
    }
    setQrCode(pattern);
  }, []);

  // Glitch effect for virus type
  useEffect(() => {
    if (crashType === "virus") {
      const interval = setInterval(() => {
        setGlitchIntensity(Math.random());
      }, 100);
      return () => clearInterval(interval);
    }
  }, [crashType]);

  const displayProgress = Math.min(100, Math.floor(progress));

  return (
    <div 
      className="fixed inset-0 bg-[#0a0e14] text-white font-sans overflow-hidden flex flex-col"
      style={crashType === "virus" ? {
        filter: `hue-rotate(${glitchIntensity * 30}deg)`,
        transform: `translate(${(glitchIntensity - 0.5) * 4}px, ${(glitchIntensity - 0.5) * 2}px)`
      } : undefined}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-transparent to-slate-950/40 pointer-events-none" />
      
      {/* Scan lines overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
        style={{ 
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.05) 2px, rgba(0,212,255,0.05) 4px)' 
        }} 
      />

      {/* Main content - centered */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-3xl w-full space-y-8">
          {/* Emoticon */}
          <div 
            className="text-[120px] md:text-[180px] font-light leading-none"
            style={{ color: theme.accentColor }}
          >
            {theme.emoticon}
          </div>

          {/* Main message */}
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-light text-white leading-relaxed">
              {customData?.title || theme.title}
            </h1>
            <p className="text-lg text-white/60">
              {customData?.message || theme.subtitle}
            </p>
          </div>

          {/* Progress */}
          <div className="space-y-3 max-w-lg">
            <p className="text-sm text-white/50">
              {phase === "collecting" ? `${displayProgress}% complete` : "Ready to restart"}
            </p>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-100 ease-out"
                style={{ width: `${displayProgress}%`, backgroundColor: theme.accentColor }}
              />
            </div>
          </div>

          {/* Info grid */}
          <div className="flex flex-wrap gap-8 pt-4">
            {/* QR Code */}
            <div className="flex items-start gap-4">
              <div className="bg-white p-2 rounded-lg">
                <div className="font-mono text-[4px] leading-[4px] text-black whitespace-pre">
                  {qrCode.map((row, i) => (
                    <div key={i}>{row}</div>
                  ))}
                </div>
              </div>
              <div className="text-xs text-white/40 max-w-xs">
                <p className="mb-2">For more information about this issue and possible fixes, visit:</p>
                <p className="font-mono" style={{ color: theme.accentColor }}>urbanshade.os/support</p>
              </div>
            </div>

            {/* Technical info */}
            <div className="space-y-2 text-xs text-white/30">
              <p>Stop code: <span className="font-mono" style={{ color: theme.accentColor }}>{resolvedCrashData.stopCode}</span></p>
              {resolvedCrashData.process && (
                <p>What failed: <span className="font-mono text-white/50">{resolvedCrashData.process}</span></p>
              )}
              {resolvedCrashData.module && (
                <p>Module: <span className="font-mono text-white/50">{resolvedCrashData.module}</span></p>
              )}
            </div>
          </div>

          {/* Restart button - Only option */}
          {phase === "ready" && (
            <button
              onClick={onReboot}
              className="flex items-center gap-3 px-8 py-4 rounded-lg transition-all font-medium"
              style={{ 
                backgroundColor: `${theme.accentColor}20`,
                borderColor: `${theme.accentColor}40`,
                borderWidth: '1px',
                color: theme.accentColor
              }}
            >
              <RefreshCw className="w-5 h-5" />
              <span>Reboot Now</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 flex items-center justify-between text-xs text-white/20">
        <span>UrbanShade OS</span>
        <span>{new Date().toLocaleString()} | Build: US-2.5.0-{Date.now().toString(36).slice(-4).toUpperCase()}</span>
      </div>
    </div>
  );
};

// Helper function to trigger crashes programmatically
export const triggerCrash = (type: CrashType, options?: Partial<CrashData>) => {
  return {
    stopCode: type,
    ...options
  } as CrashData;
};
