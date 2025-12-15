import { useState, useRef, useEffect } from "react";
import { App } from "./Desktop";

interface DesktopIconProps {
  app: App;
  onOpen: (app: App) => void;
  initialPosition?: { x: number; y: number };
  gridIndex?: number;
  onPositionChange?: (appId: string, position: { x: number; y: number }) => void;
}

const GRID_SIZE = 110;
const GRID_COLS = 10;

export const DesktopIcon = ({ 
  app, 
  onOpen, 
  initialPosition, 
  gridIndex = 0,
  onPositionChange 
}: DesktopIconProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const iconRef = useRef<HTMLDivElement>(null);
  
  // Load saved position
  useEffect(() => {
    const savedPositions = localStorage.getItem('desktop_icon_positions');
    if (savedPositions) {
      const positions = JSON.parse(savedPositions);
      if (positions[app.id]) {
        setPosition(positions[app.id]);
      }
    }
  }, [app.id]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    const rect = iconRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    e.preventDefault();
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (position) {
        // Snap to grid
        const snappedX = Math.round(position.x / GRID_SIZE) * GRID_SIZE + 28;
        const snappedY = Math.round(position.y / GRID_SIZE) * GRID_SIZE + 28;
        
        const finalPosition = { x: snappedX, y: snappedY };
        setPosition(finalPosition);
        
        // Save position to localStorage
        const savedPositions = localStorage.getItem('desktop_icon_positions');
        const positions = savedPositions ? JSON.parse(savedPositions) : {};
        positions[app.id] = finalPosition;
        localStorage.setItem('desktop_icon_positions', JSON.stringify(positions));
        
        onPositionChange?.(app.id, finalPosition);
      }
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, position, app.id, onPositionChange]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      app.run();
    }
  };

  // Calculate default grid position
  const defaultGridPosition = {
    x: (gridIndex % GRID_COLS) * GRID_SIZE + 28,
    y: Math.floor(gridIndex / GRID_COLS) * GRID_SIZE + 28
  };

  const currentPosition = position || defaultGridPosition;

  return (
    <div
      ref={iconRef}
      className={`absolute w-[100px] flex flex-col items-center gap-2 text-center select-none group cursor-pointer hover-scale ${
        isDragging ? 'z-50 opacity-80 scale-105' : 'animate-fade-in'
      }`}
      style={{
        left: currentPosition.x,
        top: currentPosition.y,
        transition: isDragging ? 'none' : 'all 0.2s ease-out'
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <div className={`w-16 h-16 rounded-xl glass-panel flex items-center justify-center text-primary transition-all duration-300 ${
        isDragging ? 'ring-2 ring-primary shadow-lg' : 'group-hover:urbanshade-glow'
      }`}>
        <div className="w-10 h-10 flex items-center justify-center [&>svg]:w-10 [&>svg]:h-10">
          {app.icon}
        </div>
      </div>
      <div className="text-xs text-muted-foreground transition-colors group-hover:text-foreground max-w-[90px] truncate px-1 py-0.5 rounded bg-black/30">
        {app.name}
      </div>
    </div>
  );
};
