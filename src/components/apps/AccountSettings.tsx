import { useState, useEffect } from "react";
import { User, Lock, Shield, Key, Save, Trash2, AlertTriangle, Check, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const AccountSettings = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [adminData, setAdminData] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  
  // Edit states
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

    // Check current password (if user has one)
    if (adminData?.password && currentPassword !== adminData.password) {
      setError("Current password is incorrect");
      return;
    }

    // Validate new password
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
          password: newPassword // Can be empty
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
    
    // Clear all urbanshade data
    const keys = Object.keys(localStorage).filter(k => k.startsWith("urbanshade_") || k.startsWith("settings_") || k.startsWith("icon_"));
    keys.forEach(k => localStorage.removeItem(k));
    
    toast.success("System reset. Reloading...");
    setTimeout(() => window.location.reload(), 1500);
  };

  return (
    <div className="h-full bg-slate-900 text-white flex">
      {/* Sidebar */}
      <div className="w-48 bg-slate-800/50 border-r border-cyan-500/20 p-4">
        <div className="space-y-1">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "security", label: "Security", icon: Lock },
            { id: "accounts", label: "Accounts", icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeTab === tab.id 
                  ? "bg-cyan-500/20 text-cyan-400" 
                  : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2">
            <Check className="w-4 h-4" />
            {success}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-cyan-400">Profile Settings</h2>
            
            <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <User className="w-10 h-10 text-cyan-400" />
                </div>
                <div>
                  <div className="text-lg font-bold">{adminData?.username || adminData?.name || "Administrator"}</div>
                  <div className="text-sm text-slate-400">System Administrator</div>
                  <div className="text-xs text-cyan-600 mt-1">Clearance Level 5</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-cyan-600 mb-2 font-mono">USERNAME</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-cyan-300 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                
                <button
                  onClick={handleUpdateUsername}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/30 transition-colors"
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
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-cyan-400">Security Settings</h2>
            
            <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6">
              <h3 className="text-sm font-bold text-cyan-300 mb-4 flex items-center gap-2">
                <Key className="w-4 h-4" />
                Change Password
              </h3>
              
              <div className="space-y-4">
                {adminData?.password && (
                  <div className="relative">
                    <label className="block text-xs text-cyan-600 mb-2 font-mono">CURRENT PASSWORD</label>
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-cyan-300 focus:border-cyan-400 focus:outline-none pr-10"
                    />
                  </div>
                )}
                
                <div className="relative">
                  <label className="block text-xs text-cyan-600 mb-2 font-mono">NEW PASSWORD</label>
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Leave empty to remove password"
                    className="w-full px-4 py-2 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-cyan-300 placeholder-slate-500 focus:border-cyan-400 focus:outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-3 top-8 text-slate-500 hover:text-cyan-400"
                  >
                    {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                <div>
                  <label className="block text-xs text-cyan-600 mb-2 font-mono">CONFIRM PASSWORD</label>
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-cyan-300 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <p className="text-xs text-slate-500">Leave new password empty to remove password requirement</p>
                
                <button
                  onClick={handleChangePassword}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  Update Password
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-950/30 border border-red-500/30 rounded-lg p-6">
              <h3 className="text-sm font-bold text-red-400 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Danger Zone
              </h3>
              
              <p className="text-sm text-slate-400 mb-4">
                Reset the entire system. This will delete all accounts, settings, and data.
              </p>
              
              <button
                onClick={handleResetSystem}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Factory Reset
              </button>
            </div>
          </div>
        )}

        {/* Accounts Tab */}
        {activeTab === "accounts" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-cyan-400">User Accounts</h2>
            
            {/* Admin Account */}
            <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="font-bold">{adminData?.username || "Administrator"}</div>
                    <div className="text-xs text-cyan-600">System Administrator • Level 5</div>
                  </div>
                </div>
                <span className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded">Protected</span>
              </div>
            </div>

            {/* Other Accounts */}
            {accounts.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-400">Other Accounts</h3>
                {accounts.map((account) => (
                  <div key={account.id} className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <div className="font-bold">{account.username || account.name}</div>
                          <div className="text-xs text-slate-500">{account.role || "User"} • Level {account.clearance || 1}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {accounts.length === 0 && (
              <div className="text-center text-slate-500 py-8">
                No additional accounts
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
