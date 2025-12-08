import { useState, useEffect } from "react";
import { Package, Download, Star, CheckCircle, Trash2, RefreshCw, Send, Github, AlertCircle, Search, List, Plus, Shield, AlertTriangle, X } from "lucide-react";
import { 
  UUR_REAL_PACKAGES, 
  getUURAppHtml, 
  getInstalledUURApps, 
  installUURApp, 
  uninstallUURApp,
  isUURAppInstalled,
  addSubmission,
  getSubmissions,
  getOfficialList,
  getCustomLists,
  addCustomList,
  removeCustomList,
  getAllPackages,
  type InstalledUURApp,
  type UURList,
  type UURPackage
} from "@/lib/uurRepository";
import { toast } from "sonner";

interface UURAppProps {
  onClose: () => void;
}

type Tab = 'browse' | 'installed' | 'lists' | 'submit' | 'run';

export const UURApp = ({ onClose }: UURAppProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('browse');
  const [installedApps, setInstalledApps] = useState<InstalledUURApp[]>([]);
  const [installing, setInstalling] = useState<string | null>(null);
  const [runningApp, setRunningApp] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [allPackages, setAllPackages] = useState<UURPackage[]>([]);
  const [customLists, setCustomLists] = useState<UURList[]>([]);
  const [showImportWarning, setShowImportWarning] = useState(false);
  const [importData, setImportData] = useState({ url: '', name: '' });
  
  // Submit form
  const [submitForm, setSubmitForm] = useState({
    packageName: '',
    githubUrl: '',
    author: '',
    description: ''
  });

  useEffect(() => {
    setInstalledApps(getInstalledUURApps());
    setAllPackages(getAllPackages());
    setCustomLists(getCustomLists());
  }, []);

  const refreshPackages = () => {
    setAllPackages(getAllPackages());
    setCustomLists(getCustomLists());
    setInstalledApps(getInstalledUURApps());
  };

  const handleInstall = async (appId: string, listSource?: string) => {
    setInstalling(appId);
    await new Promise(r => setTimeout(r, 1500)); // Simulate install
    
    const pkg = allPackages.find(p => p.id === appId);
    if (installUURApp(appId, listSource)) {
      refreshPackages();
      toast.success(`Installed ${pkg?.name || appId}`);
    } else {
      toast.error("Installation failed");
    }
    setInstalling(null);
  };

  const handleUninstall = (appId: string) => {
    if (uninstallUURApp(appId)) {
      refreshPackages();
      toast.success("Package removed");
    }
  };

  const handleRunApp = (appId: string) => {
    setRunningApp(appId);
    setActiveTab('run');
  };

  const handleSubmit = () => {
    if (!submitForm.packageName || !submitForm.githubUrl || !submitForm.author) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (!submitForm.githubUrl.includes('github.com')) {
      toast.error("Please provide a valid GitHub URL");
      return;
    }

    const success = addSubmission({
      packageName: submitForm.packageName,
      githubUrl: submitForm.githubUrl,
      author: submitForm.author,
      description: submitForm.description
    });

    if (success) {
      toast.success("Submission received! It will be reviewed soon.");
      setSubmitForm({ packageName: '', githubUrl: '', author: '', description: '' });
    } else {
      toast.error("Submission failed");
    }
  };

  const handleImportList = () => {
    if (!importData.url || !importData.name) {
      toast.error("Please provide list URL and name");
      return;
    }

    // Parse the URL to create mock packages
    // In a real implementation, this would fetch from the URL
    const mockPackages: UURPackage[] = [
      {
        id: `${importData.name}-sample`,
        name: `${importData.name} Sample Package`,
        description: 'Sample package from imported list',
        version: '1.0.0',
        author: 'Community',
        category: 'app',
        downloads: 0,
        stars: 0,
        isOfficial: false,
        listSource: importData.name
      }
    ];

    const success = addCustomList({
      id: importData.name.toLowerCase().replace(/\s+/g, '-'),
      name: importData.name,
      url: importData.url,
      description: `Custom list imported from ${importData.url}`,
      packages: mockPackages
    });

    if (success) {
      toast.success(`List "${importData.name}" imported successfully`);
      setImportData({ url: '', name: '' });
      setShowImportWarning(false);
      refreshPackages();
    } else {
      toast.error("Failed to import list. It may already exist.");
    }
  };

  const handleRemoveList = (listId: string) => {
    if (removeCustomList(listId)) {
      toast.success("List removed");
      refreshPackages();
    }
  };

  const filteredPackages = allPackages.filter(pkg => 
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'browse', label: 'Browse', icon: Package },
    { id: 'installed', label: 'Installed', icon: CheckCircle },
    { id: 'lists', label: 'Lists', icon: List },
    { id: 'submit', label: 'Submit', icon: Send },
    ...(runningApp ? [{ id: 'run' as Tab, label: 'Running', icon: RefreshCw }] : [])
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Import Warning Modal */}
      {showImportWarning && (
        <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-slate-900 border border-red-500/50 rounded-xl overflow-hidden">
            <div className="bg-red-500/20 border-b border-red-500/30 p-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="font-bold text-red-400">Custom List Import Warning</h3>
              <button onClick={() => setShowImportWarning(false)} className="ml-auto p-1 hover:bg-red-500/20 rounded">
                <X className="w-5 h-5 text-red-400" />
              </button>
            </div>
            
            <div className="p-4 space-y-4 max-h-96 overflow-auto">
              <div className="p-4 bg-red-950/50 border border-red-500/30 rounded-lg text-sm text-red-200 space-y-3">
                <p className="font-bold text-red-400">⚠️ IMPORTANT: Read Before Proceeding</p>
                
                <p>
                  You are about to import a <strong>custom package list</strong> from an external source. 
                  This is an advanced feature intended for developers and power users.
                </p>
                
                <div className="space-y-2">
                  <p className="font-semibold text-red-300">What is a Package List?</p>
                  <p className="text-red-200/80">
                    A package list is a GitHub repository or URL that tells UUR where to download packages from. 
                    Custom lists are maintained by third parties and are <strong>NOT verified</strong> by the 
                    UrbanShade team.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="font-semibold text-red-300">Risks of Custom Lists:</p>
                  <ul className="list-disc list-inside space-y-1 text-red-200/80 text-xs">
                    <li>Packages may contain <strong>unverified or malicious code</strong></li>
                    <li>Packages are <strong>not reviewed</strong> for security or quality</li>
                    <li>The list maintainer could add harmful content at any time</li>
                    <li>Custom packages may conflict with official packages</li>
                    <li>No guarantee of compatibility with your system</li>
                    <li>Updates from custom lists are <strong>not monitored</strong></li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <p className="font-semibold text-red-300">Recommendations:</p>
                  <ul className="list-disc list-inside space-y-1 text-red-200/80 text-xs">
                    <li>Only import lists from sources you <strong>completely trust</strong></li>
                    <li>Review the list's GitHub repository before importing</li>
                    <li>Check the maintainer's reputation and history</li>
                    <li>Consider the age and activity of the repository</li>
                    <li>When in doubt, use only the <strong>Official Repository</strong></li>
                  </ul>
                </div>
                
                <p className="text-xs text-red-300/70 pt-2 border-t border-red-500/20">
                  By importing a custom list, you acknowledge these risks and take full responsibility 
                  for any packages installed from it. The UrbanShade team is not liable for any issues 
                  caused by third-party packages.
                </p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">List Name *</label>
                  <input
                    type="text"
                    value={importData.name}
                    onChange={(e) => setImportData(d => ({ ...d, name: e.target.value }))}
                    placeholder="My Custom List"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-slate-400 mb-1">GitHub Repository URL *</label>
                  <input
                    type="url"
                    value={importData.url}
                    onChange={(e) => setImportData(d => ({ ...d, url: e.target.value }))}
                    placeholder="https://github.com/user/uur-list"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowImportWarning(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportList}
                  disabled={!importData.name || !importData.url}
                  className="flex-1 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/30"
                >
                  I Understand, Import List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-cyan-400" />
          <div>
            <h1 className="font-bold text-cyan-400">UUR Manager</h1>
            <p className="text-xs text-slate-500">UrbanShade User Repository</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'browse' && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Package Grid */}
            <div className="grid gap-3">
              {filteredPackages.map(pkg => {
                const installed = isUURAppInstalled(pkg.id);
                const isInstalling = installing === pkg.id;
                
                return (
                  <div key={pkg.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-cyan-500/30 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold text-cyan-400">{pkg.name}</h3>
                          {pkg.isOfficial ? (
                            <span className="px-1.5 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded flex items-center gap-1">
                              <Shield className="w-2.5 h-2.5" /> OFFICIAL
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 text-[10px] bg-amber-500/20 text-amber-400 rounded">
                              {pkg.listSource || 'COMMUNITY'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{pkg.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>v{pkg.version}</span>
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" /> {pkg.downloads}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400" /> {pkg.stars}
                          </span>
                          <span>by {pkg.author}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {installed ? (
                          <>
                            <button
                              onClick={() => handleRunApp(pkg.id)}
                              className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/30"
                            >
                              Run
                            </button>
                            <button
                              onClick={() => handleUninstall(pkg.id)}
                              className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleInstall(pkg.id, pkg.listSource)}
                            disabled={isInstalling}
                            className="px-4 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg text-xs font-medium hover:bg-cyan-500/30 disabled:opacity-50 flex items-center gap-1.5"
                          >
                            {isInstalling ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                Installing...
                              </>
                            ) : (
                              <>
                                <Download className="w-3.5 h-3.5" />
                                Install
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'installed' && (
          <div className="space-y-4">
            {installedApps.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No packages installed yet</p>
                <p className="text-sm">Browse the repository to install packages</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {installedApps.map(app => (
                  <div key={app.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-100">{app.name}</h3>
                          <span className="text-xs text-slate-500">v{app.version}</span>
                          {app.source === 'official' ? (
                            <span className="px-1.5 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded">Official</span>
                          ) : (
                            <span className="px-1.5 py-0.5 text-[10px] bg-amber-500/20 text-amber-400 rounded">{app.listSource || 'Community'}</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          Installed {new Date(app.installedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRunApp(app.id)}
                          className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/30"
                        >
                          Run
                        </button>
                        <button
                          onClick={() => handleUninstall(app.id)}
                          className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'lists' && (
          <div className="space-y-6">
            {/* Official List */}
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                Official Repository (Recommended)
              </h3>
              <div className="p-4 bg-green-500/5 border border-green-500/30 rounded-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-green-400">{getOfficialList().name}</h4>
                      <span className="px-1.5 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded">VERIFIED</span>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{getOfficialList().description}</p>
                    <p className="text-xs text-slate-500">{getOfficialList().packages.length} packages available</p>
                  </div>
                  <div className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium">
                    Active
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Lists */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <List className="w-4 h-4 text-amber-400" />
                  Custom Lists
                </h3>
                <button
                  onClick={() => setShowImportWarning(true)}
                  className="px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-lg text-xs font-medium hover:bg-amber-500/30 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Import List
                </button>
              </div>
              
              {customLists.length === 0 ? (
                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl text-center">
                  <List className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No custom lists imported</p>
                  <p className="text-xs text-slate-600 mt-1">Import a list to access community packages</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customLists.map(list => (
                    <div key={list.id} className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-amber-400">{list.name}</h4>
                            <span className="px-1.5 py-0.5 text-[10px] bg-amber-500/20 text-amber-400 rounded">UNVERIFIED</span>
                          </div>
                          <p className="text-sm text-slate-400 mb-2">{list.description}</p>
                          <div className="text-xs text-slate-500 space-y-0.5">
                            <p>URL: {list.url}</p>
                            <p>{list.packages.length} packages • Added {new Date(list.addedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveList(list.id)}
                          className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'submit' && (
          <div className="max-w-lg mx-auto space-y-6">
            <div className="text-center mb-8">
              <Github className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-slate-100">Submit a Package</h2>
              <p className="text-sm text-slate-400 mt-2">
                Submit your GitHub repository for review. Approved packages will be added to UUR.
              </p>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-200">
                  <p className="font-medium">Submission Guidelines</p>
                  <ul className="mt-2 space-y-1 text-amber-200/80 text-xs">
                    <li>• Repository must be public on GitHub</li>
                    <li>• Include a README with installation instructions</li>
                    <li>• Package must be compatible with UrbanShade OS</li>
                    <li>• No malicious code or harmful content</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Package Name *</label>
                <input
                  type="text"
                  value={submitForm.packageName}
                  onChange={(e) => setSubmitForm(s => ({ ...s, packageName: e.target.value }))}
                  placeholder="my-awesome-package"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">GitHub URL *</label>
                <input
                  type="url"
                  value={submitForm.githubUrl}
                  onChange={(e) => setSubmitForm(s => ({ ...s, githubUrl: e.target.value }))}
                  placeholder="https://github.com/username/repo"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Author Name *</label>
                <input
                  type="text"
                  value={submitForm.author}
                  onChange={(e) => setSubmitForm(s => ({ ...s, author: e.target.value }))}
                  placeholder="Your name or username"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Description</label>
                <textarea
                  value={submitForm.description}
                  onChange={(e) => setSubmitForm(s => ({ ...s, description: e.target.value }))}
                  placeholder="Briefly describe what your package does..."
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50 resize-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-cyan-500/20 text-cyan-400 rounded-lg font-medium hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit for Review
              </button>
            </div>

            {/* Show pending submissions */}
            {getSubmissions().filter(s => s.status === 'pending').length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-slate-400 mb-3">Your Pending Submissions</h3>
                <div className="space-y-2">
                  {getSubmissions().filter(s => s.status === 'pending').map(sub => (
                    <div key={sub.packageName} className="p-3 bg-slate-800/50 rounded-lg text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-200">{sub.packageName}</span>
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs">Pending</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'run' && runningApp && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Running:</span>
                <span className="text-sm font-medium text-cyan-400">
                  {allPackages.find(p => p.id === runningApp)?.name || runningApp}
                </span>
              </div>
              <button
                onClick={() => { setRunningApp(null); setActiveTab('installed'); }}
                className="px-3 py-1 bg-slate-800 text-slate-400 rounded text-xs hover:bg-slate-700"
              >
                Close App
              </button>
            </div>
            <div 
              className="flex-1 rounded-lg overflow-hidden border border-slate-700"
              dangerouslySetInnerHTML={{ __html: getUURAppHtml(runningApp) || '<p style="padding: 20px; color: #888;">App not found</p>' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UURApp;
