import { useState, useEffect } from "react";
import { User, Lock, Shield, Key, Save, Trash2, AlertTriangle, Check, Eye, EyeOff, Settings, Users, RefreshCw, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

export const AccountSettings = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [adminData, setAdminData] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "accounts">("profile");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const current = localStorage.getItem("urbanshade_current_user");
      const admin = localStorage.getItem("urbanshade_admin");
      const accs = localStorage.getItem("urbanshade_accounts");
      
      if (current) setCurrentUser(JSON.parse(current));
      if (admin) {
        const parsedAdmin = JSON.parse(admin);
        setAdminData(parsedAdmin);
        setNewUsername(parsedAdmin.username || parsedAdmin.name || "");
      }
      if (accs) setAccounts(JSON.parse(accs));
    } catch (e) {
      console.error("Failed to load account data:", e);
    }
  };

  const handleUpdateUsername = () => {
    setError("");
    setSuccess("");
    
    if (!newUsername.trim()) {
      setError("Username cannot be empty");
      return;
    }
    
    if (newUsername.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    try {
      if (adminData) {
        const updated = {
          ...adminData,
          username: newUsername.trim(),
          name: `Administrator (${newUsername.trim()})`
        };
        localStorage.setItem("urbanshade_admin", JSON.stringify(updated));
        setAdminData(updated);
        setSuccess("Username updated successfully");
        toast.success("Username updated");
      }
    } catch (e) {
      setError("Failed to update username");
    }
  };

  const handleChangePassword = () => {
    setError("");
    setSuccess("");

    if (adminData?.password && currentPassword !== adminData.password) {
      setError("Current password is incorrect");
      return;
    }

    if (newPassword && newPassword.length < 4) {
      setError("New password must be at least 4 characters or empty");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      if (adminData) {
        const updated = {
          ...adminData,
          password: newPassword
        };
        localStorage.setItem("urbanshade_admin", JSON.stringify(updated));
        setAdminData(updated);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setSuccess(newPassword ? "Password changed successfully" : "Password removed");
        toast.success(newPassword ? "Password changed" : "Password removed");
      }
    } catch (e) {
      setError("Failed to change password");
    }
  };

  const handleDeleteAccount = (accountId: string) => {
    if (!confirm("Are you sure you want to delete this account?")) return;
    
    try {
      const updated = accounts.filter(a => a.id !== accountId);
      localStorage.setItem("urbanshade_accounts", JSON.stringify(updated));
      setAccounts(updated);
      toast.success("Account deleted");
    } catch (e) {
      toast.error("Failed to delete account");
    }
  };

  const handleResetSystem = () => {
    if (!confirm("This will reset ALL system data including accounts, settings, and installed apps. Continue?")) return;
    if (!confirm("Are you ABSOLUTELY sure? This cannot be undone!")) return;
    
    const keys = Object.keys(localStorage).filter(k => k.startsWith("urbanshade_") || k.startsWith("settings_") || k.startsWith("icon_"));
    keys.forEach(k => localStorage.removeItem(k));
    
    toast.success("System reset. Reloading...");
    setTimeout(() => window.location.reload(), 1500);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "accounts", label: "Accounts", icon: Users },
  ];

  return (
    <div className="h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex">
      {/* Sidebar */}
      <div className="w-56 bg-black/20 border-r border-cyan-500/20 flex flex-col">
        <div className="p-4 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <Settings className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="font-bold">Account</h2>
              <p className="text-xs text-slate-500">Settings</p>
            </div>
          </div>
        </div>
        
        <div className="p-2 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                activeTab === tab.id 
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" 
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'rotate-90' : ''}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 max-w-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-3 animate-fade-in">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 animate-fade-in">
              <Check className="w-5 h-5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-2">Profile Settings</h2>
                <p className="text-slate-500">Manage your account information</p>
              </div>
              
              <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/30 flex items-center justify-center">
                    <User className="w-10 h-10 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{adminData?.username || adminData?.name || "Administrator"}</div>
                    <div className="text-slate-400">System Administrator</div>
                    <div className="text-xs text-cyan-500 mt-1 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Clearance Level 5
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-cyan-500 uppercase tracking-wider mb-2 font-medium">Username</label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                  </div>
                  
                  <button
                    onClick={handleUpdateUsername}
                    className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500/20 border border-cyan-500/40 rounded-xl text-cyan-400 hover:bg-cyan-500/30 transition-all font-medium"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-2">Security Settings</h2>
                <p className="text-slate-500">Manage your password and security options</p>
              </div>
              
              <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-cyan-400" />
                  Change Password
                </h3>
                
                <div className="space-y-4">
                  {adminData?.password && (
                    <div>
                      <label className="block text-xs text-cyan-500 uppercase tracking-wider mb-2 font-medium">Current Password</label>
                      <input
                        type={showPasswords ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      />
                    </div>
                  )}
                  
                  <div className="relative">
                    <label className="block text-xs text-cyan-500 uppercase tracking-wider mb-2 font-medium">New Password</label>
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Leave empty to remove password"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="absolute right-4 top-9 text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                      {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-cyan-500 uppercase tracking-wider mb-2 font-medium">Confirm Password</label>
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                  </div>

                  <p className="text-xs text-slate-500">Leave new password empty to remove password requirement</p>
                  
                  <button
                    onClick={handleChangePassword}
                    className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500/20 border border-cyan-500/40 rounded-xl text-cyan-400 hover:bg-cyan-500/30 transition-all font-medium"
                  >
                    <Lock className="w-4 h-4" />
                    Update Password
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/30">
                <h3 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Danger Zone
                </h3>
                
                <p className="text-slate-400 mb-4 text-sm">
                  Reset the entire system. This will delete all accounts, settings, and data.
                </p>
                
                <button
                  onClick={handleResetSystem}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 hover:bg-red-500/30 transition-all font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  Factory Reset
                </button>
              </div>
            </div>
          )}

          {/* Accounts Tab */}
          {activeTab === "accounts" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-2">User Accounts</h2>
                <p className="text-slate-500">Manage system user accounts</p>
              </div>
              
              {/* Admin Account */}
              <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <div className="font-bold text-white">{adminData?.username || "Administrator"}</div>
                      <div className="text-xs text-cyan-500">System Administrator • Level 5</div>
                    </div>
                  </div>
                  <span className="text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg font-medium border border-amber-500/30">Protected</span>
                </div>
              </div>

              {/* Other Accounts */}
              {accounts.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Other Accounts</h3>
                  {accounts.map((account) => (
                    <div key={account.id} className="p-5 rounded-2xl bg-slate-800/30 border border-slate-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center">
                            <User className="w-6 h-6 text-slate-400" />
                          </div>
                          <div>
                            <div className="font-bold text-white">{account.username || account.name}</div>
                            <div className="text-xs text-slate-500">{account.role || "User"} • Level {account.clearance || 1}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteAccount(account.id)}
                          className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/30"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {accounts.length === 0 && (
                <div className="text-center text-slate-500 py-12 rounded-2xl bg-slate-800/20 border border-slate-700/30">
                  <Users className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                  <p>No additional accounts</p>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
