import { useState, useRef, useEffect } from "react";
import { FileImage, Upload, Download, Save, Trash2, Edit, Eye, FolderOpen, Search, RefreshCw, Database, Settings, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface ImageData {
  [key: string]: string;
}

export const ImageEditor = () => {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load recovery images from localStorage
  const [savedImages, setSavedImages] = useState<string[]>(() => {
    const images = localStorage.getItem('urbanshade_recovery_images');
    return images ? JSON.parse(images) : [];
  });

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setImageData(data);
        setFileName(file.name);
        toast.success(`Loaded ${file.name}`);
      } catch (error) {
        toast.error("Failed to parse file. Make sure it's a valid .img or .json file.");
      }
    };
    reader.readAsText(file);
  };

  const handleLoadFromStorage = (imageName: string) => {
    const data = localStorage.getItem(`recovery_image_${imageName}`);
    if (data) {
      setImageData(JSON.parse(data));
      setFileName(imageName);
      toast.success(`Loaded ${imageName}`);
    }
  };

  const handleCreateNew = () => {
    // Create from current system state
    const systemImage: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !key.startsWith('recovery_image_')) {
        systemImage[key] = localStorage.getItem(key) || "";
      }
    }
    setImageData(systemImage);
    setFileName(`urbanshade_image_${Date.now()}.img`);
    toast.success("Created image from current system state");
  };

  const handleSaveValue = (key: string) => {
    if (!imageData) return;
    setImageData({ ...imageData, [key]: editValue });
    setEditingKey(null);
    toast.success(`Updated ${key}`);
  };

  const handleDeleteKey = (key: string) => {
    if (!imageData) return;
    const newData = { ...imageData };
    delete newData[key];
    setImageData(newData);
    toast.success(`Deleted ${key}`);
  };

  const handleAddKey = () => {
    if (!imageData || !newKey) return;
    if (imageData[newKey] !== undefined) {
      toast.error("Key already exists");
      return;
    }
    setImageData({ ...imageData, [newKey]: newValue });
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
    toast.success("Image exported successfully");
  };

  const handleApplyToSystem = () => {
    if (!imageData) return;
    if (!window.confirm("This will replace your current system state. Continue?")) return;
    
    localStorage.clear();
    Object.entries(imageData).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    toast.success("System image applied. Reloading...");
    setTimeout(() => window.location.reload(), 1500);
  };

  const handleSaveToStorage = () => {
    if (!imageData || !fileName) return;
    const imageName = fileName.replace(/\.(img|json)$/, '');
    localStorage.setItem(`recovery_image_${imageName}`, JSON.stringify(imageData));
    
    const images = JSON.parse(localStorage.getItem('urbanshade_recovery_images') || '[]');
    if (!images.includes(imageName)) {
      images.push(imageName);
      localStorage.setItem('urbanshade_recovery_images', JSON.stringify(images));
      setSavedImages(images);
    }
    toast.success(`Saved ${imageName} to storage`);
  };

  const filteredEntries = imageData 
    ? Object.entries(imageData).filter(([key, value]) => 
        key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const getValuePreview = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === 'object') {
        return `{...} (${Object.keys(parsed).length} keys)`;
      }
      return String(parsed);
    } catch {
      return value.length > 50 ? value.substring(0, 50) + "..." : value;
    }
  };

  const formatValue = (value: string) => {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-r from-primary/5 via-transparent to-primary/5 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <FileImage className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">.Img Editor</h1>
            <p className="text-sm text-muted-foreground">Edit recovery images and system snapshots</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".img,.json"
            onChange={handleImportFile}
            className="hidden"
          />
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Import File
          </Button>
          <Button variant="outline" size="sm" onClick={handleCreateNew}>
            <Database className="w-4 h-4 mr-2" />
            Snapshot Current
          </Button>
          {imageData && (
            <>
              <Button variant="outline" size="sm" onClick={handleSaveToStorage}>
                <Save className="w-4 h-4 mr-2" />
                Save to Storage
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="destructive" size="sm" onClick={handleApplyToSystem}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Apply to System
              </Button>
            </>
          )}
        </div>
      </div>

      {!imageData ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6 p-8">
            <FileImage className="w-20 h-20 mx-auto text-primary/30" />
            <div>
              <h2 className="text-xl font-semibold mb-2">No Image Loaded</h2>
              <p className="text-muted-foreground text-sm max-w-md">
                Import an existing .img file, create a snapshot from your current system, 
                or select a saved recovery image below.
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Import File
              </Button>
              <Button variant="default" onClick={handleCreateNew}>
                <Database className="w-4 h-4 mr-2" />
                Snapshot Current System
              </Button>
            </div>

            {savedImages.length > 0 && (
              <div className="border border-border rounded-lg p-4 max-w-md mx-auto">
                <h3 className="font-semibold mb-3 text-left flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-primary" />
                  Saved Images
                </h3>
                <div className="space-y-2">
                  {savedImages.map(img => (
                    <Button
                      key={img}
                      variant="ghost"
                      className="w-full justify-start text-left"
                      onClick={() => handleLoadFromStorage(img)}
                    >
                      <FileImage className="w-4 h-4 mr-2 text-primary" />
                      {img}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* File Info */}
          <div className="p-4 bg-muted/30 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileImage className="w-5 h-5 text-primary" />
              <span className="font-mono text-sm">{fileName}</span>
              <span className="text-xs text-muted-foreground">
                ({Object.keys(imageData).length} entries)
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search keys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 h-9"
              />
            </div>
          </div>

          <Tabs defaultValue="entries" className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-4">
              <TabsTrigger value="entries">
                <Settings className="w-4 h-4 mr-2" />
                Entries
              </TabsTrigger>
              <TabsTrigger value="raw">
                <Code className="w-4 h-4 mr-2" />
                Raw JSON
              </TabsTrigger>
              <TabsTrigger value="add">
                <Edit className="w-4 h-4 mr-2" />
                Add Entry
              </TabsTrigger>
            </TabsList>

            <TabsContent value="entries" className="flex-1 overflow-hidden m-0 p-4">
              <ScrollArea className="h-full">
                <div className="space-y-2">
                  {filteredEntries.map(([key, value]) => (
                    <div
                      key={key}
                      className="border border-border rounded-lg p-3 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-sm text-primary font-medium mb-1">
                            {key}
                          </div>
                          {editingKey === key ? (
                            <div className="space-y-2">
                              <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-full h-32 bg-muted border border-border rounded p-2 font-mono text-xs resize-y"
                              />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleSaveValue(key)}>
                                  Save
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setEditingKey(null)}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground font-mono truncate">
                              {getValuePreview(value)}
                            </div>
                          )}
                        </div>
                        {editingKey !== key && (
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => {
                                setEditingKey(key);
                                setEditValue(formatValue(value));
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteKey(key)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="raw" className="flex-1 overflow-hidden m-0 p-4">
              <ScrollArea className="h-full">
                <pre className="text-xs font-mono bg-muted/50 rounded-lg p-4 whitespace-pre-wrap">
                  {JSON.stringify(imageData, null, 2)}
                </pre>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="add" className="flex-1 overflow-hidden m-0 p-4">
              <div className="max-w-lg space-y-4">
                <h3 className="font-semibold">Add New Entry</h3>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Key</label>
                  <Input
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="settings_custom_value"
                    className="font-mono"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Value</label>
                  <textarea
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder='{"example": "value"} or plain text'
                    className="w-full h-32 bg-muted border border-border rounded p-2 font-mono text-sm resize-y"
                  />
                </div>
                <Button onClick={handleAddKey} disabled={!newKey}>
                  Add Entry
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};
