import { ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HallwayToolProps {
  pointCount: number;
  onComplete: () => void;
  onCancel: () => void;
  startRoomName?: string;
}

export const HallwayTool = ({ pointCount, onComplete, onCancel, startRoomName }: HallwayToolProps) => {
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[5000] bg-background/95 backdrop-blur border border-primary/50 rounded-lg p-4 shadow-2xl animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <ArrowRight className="w-5 h-5 text-primary animate-pulse" />
          <span className="font-semibold">Hallway Tool Active</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Points: {pointCount}</span>
          {startRoomName && (
            <span className="text-primary">
              Starting from {startRoomName}
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          {pointCount >= 2 && (
            <Button
              size="sm"
              onClick={onComplete}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-1" />
              Complete
            </Button>
          )}
          <Button
            size="sm"
            variant="destructive"
            onClick={onCancel}
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground">
        {pointCount === 0 && "Click on a room to start the hallway"}
        {pointCount === 1 && "Click on another room or empty space (only straight lines)"}
        {pointCount > 1 && "Continue to another point or click Complete"}
      </div>
    </div>
  );
};
