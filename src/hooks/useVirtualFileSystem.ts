import { useState, useEffect, useCallback } from "react";

export interface VirtualFile {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  parentId: string | null;
  createdAt: string;
  modifiedAt: string;
  size: number;
  extension?: string;
  permissions: FilePermissions;
  isHidden: boolean;
  isSystem: boolean;
  isReadOnly: boolean;
  icon?: string;
  metadata?: Record<string, unknown>;
}

export interface FilePermissions {
  read: boolean;
  write: boolean;
  execute: boolean;
}

export interface TrashItem {
  file: VirtualFile;
  originalParentId: string;
  deletedAt: string;
}

export interface FileOperation {
  type: "create" | "update" | "delete" | "move" | "copy" | "rename";
  fileId: string;
  timestamp: string;
  details?: string;
}

const DEFAULT_PERMISSIONS: FilePermissions = { read: true, write: true, execute: false };
const SYSTEM_PERMISSIONS: FilePermissions = { read: true, write: false, execute: false };

const createDefaultFile = (
  id: string,
  name: string,
  type: "file" | "folder",
  parentId: string | null,
  options: Partial<VirtualFile> = {}
): VirtualFile => ({
  id,
  name,
  type,
  parentId,
  createdAt: new Date().toISOString(),
  modifiedAt: new Date().toISOString(),
  size: 0,
  permissions: DEFAULT_PERMISSIONS,
  isHidden: false,
  isSystem: false,
  isReadOnly: false,
  ...options,
});

const DEFAULT_FILES: VirtualFile[] = [
  // Root
  createDefaultFile("root", "Root", "folder", null, { isSystem: true, permissions: SYSTEM_PERMISSIONS }),
  
  // Main folders
  createDefaultFile("desktop", "Desktop", "folder", "root"),
  createDefaultFile("documents", "Documents", "folder", "root"),
  createDefaultFile("downloads", "Downloads", "folder", "root"),
  createDefaultFile("pictures", "Pictures", "folder", "root"),
  createDefaultFile("music", "Music", "folder", "root"),
  createDefaultFile("videos", "Videos", "folder", "root"),
  createDefaultFile("appdata", "AppData", "folder", "root", { isHidden: true }),
  createDefaultFile("system", "System", "folder", "root", { isSystem: true, isReadOnly: true, permissions: SYSTEM_PERMISSIONS }),
  createDefaultFile("trash", "Trash", "folder", "root", { isSystem: true }),
  
  // Documents subfolders
  createDefaultFile("docs-work", "Work", "folder", "documents"),
  createDefaultFile("docs-personal", "Personal", "folder", "documents"),
  createDefaultFile("docs-projects", "Projects", "folder", "documents"),
  
  // Sample files
  createDefaultFile("readme", "README.txt", "file", "documents", {
    content: "Welcome to Urbanshade OS v3.0!\n\nThis is your virtual file system. You can create, edit, and delete files here.\n\nNew in v3.0:\n- Full folder tree navigation\n- Drag and drop support\n- Trash/Recycle bin\n- File permissions\n- Hidden files support\n\nTry creating a new document!",
    size: 280,
    extension: "txt"
  }),
  
  createDefaultFile("secrets", "CLASSIFIED.txt", "file", "system", {
    content: "[REDACTED]\n\nProject URBANSHADE - Level 5 Clearance Required\n\nSubject: Containment Breach Protocol\n\nIf you're reading this, you've accessed restricted files.\nReport to Section Chief immediately.\n\n- Dr. ████████",
    size: 234,
    extension: "txt",
    isReadOnly: true,
    permissions: SYSTEM_PERMISSIONS
  }),
  
  createDefaultFile("system-config", "config.sys", "file", "system", {
    content: "[SYSTEM]\nversion=3.0\ncodename=THE_YEAR_UPDATE\nbuild=20250127\n\n[SECURITY]\nclearance_required=5\ncontainment_status=ACTIVE\n\n[NETWORK]\nfirewall=ENABLED\nvpn=DISABLED",
    size: 180,
    extension: "sys",
    isReadOnly: true,
    isSystem: true,
    permissions: SYSTEM_PERMISSIONS
  }),
  
  createDefaultFile("notes", "notes.txt", "file", "docs-personal", {
    content: "My personal notes:\n\n- Remember to check containment status\n- Meeting with Dr. Chen at 1400\n- Update security protocols",
    size: 120,
    extension: "txt"
  }),
  
  createDefaultFile("wallpaper1", "default_wallpaper.png", "file", "pictures", {
    content: "[Binary Image Data]",
    size: 1024000,
    extension: "png",
    isSystem: true
  }),
  
  createDefaultFile("sample-audio", "ambient.mp3", "file", "music", {
    content: "[Audio Data]",
    size: 5242880,
    extension: "mp3"
  }),
  
  // AppData configs
  createDefaultFile("appdata-settings", "settings.json", "file", "appdata", {
    content: JSON.stringify({ theme: "dark", language: "en", notifications: true }, null, 2),
    size: 80,
    extension: "json",
    isHidden: true
  }),
];

const STORAGE_KEY = 'virtual_filesystem_v3';
const TRASH_KEY = 'virtual_filesystem_trash_v3';
const HISTORY_KEY = 'virtual_filesystem_history_v3';
const FAVORITES_KEY = 'virtual_filesystem_favorites_v3';

export const useVirtualFileSystem = () => {
  const [files, setFiles] = useState<VirtualFile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_FILES;
      }
    }
    return DEFAULT_FILES;
  });

  const [trash, setTrash] = useState<TrashItem[]>(() => {
    const saved = localStorage.getItem(TRASH_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [history, setHistory] = useState<FileOperation[]>(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [clipboard, setClipboard] = useState<{ fileId: string; operation: "copy" | "cut" } | null>(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem(TRASH_KEY, JSON.stringify(trash));
  }, [trash]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-100))); // Keep last 100 operations
  }, [history]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addToHistory = useCallback((operation: Omit<FileOperation, "timestamp">) => {
    setHistory(prev => [...prev, { ...operation, timestamp: new Date().toISOString() }]);
  }, []);

  // Basic getters
  const getChildren = useCallback((parentId: string | null, includeHidden = false) => {
    return files.filter(f => 
      f.parentId === parentId && 
      (includeHidden || !f.isHidden)
    ).sort((a, b) => {
      // Folders first, then alphabetically
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }, [files]);

  const getFile = useCallback((id: string) => {
    return files.find(f => f.id === id);
  }, [files]);

  const getFileByPath = useCallback((path: string): VirtualFile | undefined => {
    if (path === "/" || path === "") return files.find(f => f.id === "root");
    
    const parts = path.split("/").filter(Boolean);
    let current = files.find(f => f.id === "root");
    
    for (const part of parts) {
      if (!current) return undefined;
      const children = files.filter(f => f.parentId === current!.id);
      current = children.find(f => f.name === part);
    }
    
    return current;
  }, [files]);

  const getPath = useCallback((fileId: string): string => {
    const file = files.find(f => f.id === fileId);
    if (!file || file.id === "root") return "/";
    
    const parts: string[] = [file.name];
    let current = file;
    while (current.parentId && current.parentId !== "root") {
      const parent = files.find(f => f.id === current.parentId);
      if (parent) {
        parts.unshift(parent.name);
        current = parent;
      } else break;
    }
    return "/" + parts.join("/");
  }, [files]);

  const getParents = useCallback((fileId: string): VirtualFile[] => {
    const parents: VirtualFile[] = [];
    let current = files.find(f => f.id === fileId);
    
    while (current && current.parentId) {
      const parent = files.find(f => f.id === current!.parentId);
      if (parent) {
        parents.unshift(parent);
        current = parent;
      } else break;
    }
    
    return parents;
  }, [files]);

  const getFolderSize = useCallback((folderId: string): number => {
    let size = 0;
    const processFolder = (id: string) => {
      const children = files.filter(f => f.parentId === id);
      for (const child of children) {
        if (child.type === "file") {
          size += child.size;
        } else {
          processFolder(child.id);
        }
      }
    };
    processFolder(folderId);
    return size;
  }, [files]);

  // CRUD operations
  const createFile = useCallback((name: string, parentId: string, content: string = "", options: Partial<VirtualFile> = {}) => {
    const parent = files.find(f => f.id === parentId);
    if (!parent || parent.type !== "folder") return null;
    if (!parent.permissions.write) return null;

    const extension = name.includes('.') ? name.split('.').pop()?.toLowerCase() : undefined;
    const newFile: VirtualFile = {
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      type: "file",
      content,
      parentId,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      size: content.length,
      extension,
      permissions: DEFAULT_PERMISSIONS,
      isHidden: name.startsWith('.'),
      isSystem: false,
      isReadOnly: false,
      ...options,
    };
    
    setFiles(prev => [...prev, newFile]);
    addToHistory({ type: "create", fileId: newFile.id, details: `Created file: ${name}` });
    return newFile;
  }, [files, addToHistory]);

  const createFolder = useCallback((name: string, parentId: string, options: Partial<VirtualFile> = {}) => {
    const parent = files.find(f => f.id === parentId);
    if (!parent || parent.type !== "folder") return null;
    if (!parent.permissions.write) return null;

    const newFolder: VirtualFile = {
      id: `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      type: "folder",
      parentId,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      size: 0,
      permissions: DEFAULT_PERMISSIONS,
      isHidden: name.startsWith('.'),
      isSystem: false,
      isReadOnly: false,
      ...options,
    };
    
    setFiles(prev => [...prev, newFolder]);
    addToHistory({ type: "create", fileId: newFolder.id, details: `Created folder: ${name}` });
    return newFolder;
  }, [files, addToHistory]);

  const updateFile = useCallback((id: string, content: string) => {
    const file = files.find(f => f.id === id);
    if (!file || file.isReadOnly || !file.permissions.write) return false;

    setFiles(prev => prev.map(f => 
      f.id === id 
        ? { ...f, content, modifiedAt: new Date().toISOString(), size: content.length }
        : f
    ));
    addToHistory({ type: "update", fileId: id, details: `Updated content` });
    return true;
  }, [files, addToHistory]);

  const renameFile = useCallback((id: string, newName: string) => {
    const file = files.find(f => f.id === id);
    if (!file || file.isSystem) return false;

    const extension = newName.includes('.') ? newName.split('.').pop()?.toLowerCase() : file.extension;
    
    setFiles(prev => prev.map(f => 
      f.id === id 
        ? { 
            ...f, 
            name: newName, 
            extension: f.type === "file" ? extension : undefined,
            modifiedAt: new Date().toISOString(),
            isHidden: newName.startsWith('.')
          }
        : f
    ));
    addToHistory({ type: "rename", fileId: id, details: `Renamed to: ${newName}` });
    return true;
  }, [files, addToHistory]);

  const deleteFile = useCallback((id: string, permanent = false) => {
    const file = files.find(f => f.id === id);
    if (!file || file.isSystem || file.id === "root" || file.id === "trash") return false;

    // Get all descendants
    const toDelete = new Set<string>([id]);
    const addChildren = (parentId: string) => {
      files.filter(f => f.parentId === parentId).forEach(f => {
        toDelete.add(f.id);
        if (f.type === "folder") addChildren(f.id);
      });
    };
    if (file.type === "folder") addChildren(id);

    if (permanent) {
      setFiles(prev => prev.filter(f => !toDelete.has(f.id)));
    } else {
      // Move to trash
      const deletedFiles = files.filter(f => toDelete.has(f.id));
      setTrash(prev => [
        ...prev,
        ...deletedFiles.map(f => ({
          file: f,
          originalParentId: f.parentId || "root",
          deletedAt: new Date().toISOString()
        }))
      ]);
      setFiles(prev => prev.filter(f => !toDelete.has(f.id)));
    }
    
    addToHistory({ type: "delete", fileId: id, details: permanent ? "Permanently deleted" : "Moved to trash" });
    return true;
  }, [files, addToHistory]);

  const restoreFromTrash = useCallback((trashItemIndex: number) => {
    const item = trash[trashItemIndex];
    if (!item) return false;

    // Check if original parent still exists
    const parentExists = files.some(f => f.id === item.originalParentId);
    const targetParentId = parentExists ? item.originalParentId : "root";

    setFiles(prev => [...prev, { ...item.file, parentId: targetParentId }]);
    setTrash(prev => prev.filter((_, i) => i !== trashItemIndex));
    return true;
  }, [files, trash]);

  const emptyTrash = useCallback(() => {
    setTrash([]);
  }, []);

  const moveFile = useCallback((id: string, newParentId: string) => {
    const file = files.find(f => f.id === id);
    const newParent = files.find(f => f.id === newParentId);
    
    if (!file || !newParent || newParent.type !== "folder") return false;
    if (file.isSystem || !newParent.permissions.write) return false;
    // Prevent moving a folder into itself
    if (id === newParentId) return false;

    setFiles(prev => prev.map(f => 
      f.id === id 
        ? { ...f, parentId: newParentId, modifiedAt: new Date().toISOString() }
        : f
    ));
    addToHistory({ type: "move", fileId: id, details: `Moved to ${newParent.name}` });
    return true;
  }, [files, addToHistory]);

  const copyFile = useCallback((id: string, newParentId: string, newName?: string) => {
    const file = files.find(f => f.id === id);
    const newParent = files.find(f => f.id === newParentId);
    
    if (!file || !newParent || newParent.type !== "folder") return null;
    if (!newParent.permissions.write) return null;

    const copyWithChildren = (sourceId: string, targetParentId: string): VirtualFile[] => {
      const source = files.find(f => f.id === sourceId);
      if (!source) return [];

      const newId = `${source.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const copied: VirtualFile = {
        ...source,
        id: newId,
        name: newName && sourceId === id ? newName : source.name,
        parentId: targetParentId,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
      };

      const result = [copied];
      
      if (source.type === "folder") {
        const children = files.filter(f => f.parentId === sourceId);
        for (const child of children) {
          result.push(...copyWithChildren(child.id, newId));
        }
      }

      return result;
    };

    const copiedFiles = copyWithChildren(id, newParentId);
    setFiles(prev => [...prev, ...copiedFiles]);
    addToHistory({ type: "copy", fileId: id, details: `Copied to ${newParent.name}` });
    return copiedFiles[0];
  }, [files, addToHistory]);

  // Clipboard operations
  const cutToClipboard = useCallback((fileId: string) => {
    setClipboard({ fileId, operation: "cut" });
  }, []);

  const copyToClipboard = useCallback((fileId: string) => {
    setClipboard({ fileId, operation: "copy" });
  }, []);

  const pasteFromClipboard = useCallback((targetFolderId: string) => {
    if (!clipboard) return null;

    if (clipboard.operation === "copy") {
      const result = copyFile(clipboard.fileId, targetFolderId);
      return result;
    } else {
      const success = moveFile(clipboard.fileId, targetFolderId);
      if (success) {
        setClipboard(null);
        return files.find(f => f.id === clipboard.fileId) || null;
      }
    }
    return null;
  }, [clipboard, copyFile, moveFile, files]);

  // Favorites
  const addToFavorites = useCallback((fileId: string) => {
    setFavorites(prev => prev.includes(fileId) ? prev : [...prev, fileId]);
  }, []);

  const removeFromFavorites = useCallback((fileId: string) => {
    setFavorites(prev => prev.filter(id => id !== fileId));
  }, []);

  const isFavorite = useCallback((fileId: string) => {
    return favorites.includes(fileId);
  }, [favorites]);

  // Search
  const searchFiles = useCallback((query: string, options: { 
    includeContent?: boolean;
    includeHidden?: boolean;
    fileType?: "file" | "folder";
    extensions?: string[];
  } = {}) => {
    const { includeContent = true, includeHidden = false, fileType, extensions } = options;
    const lowerQuery = query.toLowerCase();
    
    return files.filter(f => {
      // Filter by visibility
      if (!includeHidden && f.isHidden) return false;
      
      // Filter by type
      if (fileType && f.type !== fileType) return false;
      
      // Filter by extension
      if (extensions && extensions.length > 0 && f.type === "file") {
        if (!f.extension || !extensions.includes(f.extension)) return false;
      }
      
      // Search in name
      if (f.name.toLowerCase().includes(lowerQuery)) return true;
      
      // Search in content
      if (includeContent && f.content && f.content.toLowerCase().includes(lowerQuery)) return true;
      
      return false;
    });
  }, [files]);

  // Get recent files
  const getRecentFiles = useCallback((limit = 10) => {
    return [...files]
      .filter(f => f.type === "file" && !f.isSystem)
      .sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime())
      .slice(0, limit);
  }, [files]);

  // Reset file system
  const resetFileSystem = useCallback(() => {
    setFiles(DEFAULT_FILES);
    setTrash([]);
    setHistory([]);
    setFavorites([]);
    setClipboard(null);
  }, []);

  // Check if name exists in folder
  const nameExistsInFolder = useCallback((name: string, parentId: string, excludeId?: string) => {
    return files.some(f => 
      f.parentId === parentId && 
      f.name.toLowerCase() === name.toLowerCase() &&
      f.id !== excludeId
    );
  }, [files]);

  // Get unique name
  const getUniqueName = useCallback((baseName: string, parentId: string, isFolder: boolean) => {
    let name = baseName;
    let counter = 1;
    
    while (nameExistsInFolder(name, parentId)) {
      if (isFolder) {
        name = `${baseName} (${counter})`;
      } else {
        const ext = baseName.includes('.') ? '.' + baseName.split('.').pop() : '';
        const nameWithoutExt = baseName.replace(ext, '');
        name = `${nameWithoutExt} (${counter})${ext}`;
      }
      counter++;
    }
    
    return name;
  }, [nameExistsInFolder]);

  return {
    // State
    files,
    trash,
    history,
    favorites,
    clipboard,
    
    // Getters
    getChildren,
    getFile,
    getFileByPath,
    getPath,
    getParents,
    getFolderSize,
    getRecentFiles,
    
    // CRUD
    createFile,
    createFolder,
    updateFile,
    renameFile,
    deleteFile,
    moveFile,
    copyFile,
    
    // Trash
    restoreFromTrash,
    emptyTrash,
    
    // Clipboard
    cutToClipboard,
    copyToClipboard,
    pasteFromClipboard,
    
    // Favorites
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    
    // Search
    searchFiles,
    
    // Utilities
    resetFileSystem,
    nameExistsInFolder,
    getUniqueName,
  };
};
