import { Gavel, Ban, AlertTriangle, VolumeX, UserX, Play, Plus, Clock, X, Shield, Trash2, Download, Settings, Crown, Star, Sparkles, MessageSquare } from "lucide-react";
import { useState } from "react";
import { FakeModerationAction } from "../hooks/useDefDevState";
import { toast } from "sonner";

interface FakeModTabProps {
  fakeModerationActions: FakeModerationAction[];
  saveFakeModerationAction: (action: FakeModerationAction) => void;
  triggerFakeMod: (action: FakeModerationAction) => void;
  activeFakeMod: FakeModerationAction | null;
  dismissFakeMod: () => void;
}

const FakeModTab = ({ fakeModerationActions, saveFakeModerationAction, triggerFakeMod, activeFakeMod, dismissFakeMod }: FakeModTabProps) => {
  const [newAction, setNewAction] = useState<Partial<FakeModerationAction>>({ type: 'ban', reason: '', duration: '7 days' });
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const actionTypes = [
    { type: 'ban' as const, label: 'Ban', icon: Ban, color: 'red', description: 'Permanently or temporarily ban the user' },
    { type: 'warn' as const, label: 'Warning', icon: AlertTriangle, color: 'amber', description: 'Issue a formal warning' },
    { type: 'mute' as const, label: 'Mute', icon: VolumeX, color: 'orange', description: 'Prevent user from sending messages' },
    { type: 'kick' as const, label: 'Kick', icon: UserX, color: 'purple', description: 'Remove user from session' },
  ];

  const presetReasons = [
    { id: 'spam', reason: 'Spamming or flooding the chat', type: 'mute' as const, duration: '1 hour' },
    { id: 'harassment', reason: 'Harassment or toxic behavior', type: 'ban' as const, duration: '7 days' },
    { id: 'exploit', reason: 'Using exploits or hacks', type: 'ban' as const, duration: 'Permanent' },
    { id: 'language', reason: 'Inappropriate language', type: 'warn' as const, duration: '' },
    { id: 'rules', reason: 'Violating community guidelines', type: 'warn' as const, duration: '' },
    { id: 'impersonation', reason: 'Impersonating staff or other users', type: 'ban' as const, duration: '30 days' },
    { id: 'advertising', reason: 'Unauthorized advertising', type: 'mute' as const, duration: '24 hours' },
    { id: 'afk', reason: 'AFK/Inactivity during critical operation', type: 'kick' as const, duration: '' },
  ];

  const createAction = () => {
    if (!newAction.reason) {
      toast.error("Please enter a reason");
      return;
    }
    const action: FakeModerationAction = {
      id: `fake_${Date.now()}`,
      type: newAction.type || 'ban',
      reason: newAction.reason,
      duration: newAction.duration,
      timestamp: new Date().toISOString(),
    };
    saveFakeModerationAction(action);
    setNewAction({ type: 'ban', reason: '', duration: '7 days' });
    toast.success("Action created and saved");
  };

  const applyPreset = (preset: typeof presetReasons[0]) => {
    setNewAction({
      type: preset.type,
      reason: preset.reason,
      duration: preset.duration
    });
    setSelectedPreset(preset.id);
    toast.info(`Preset loaded: ${preset.reason}`);
  };

  const quickTrigger = (type: FakeModerationAction['type'], reason: string, duration?: string) => {
    const action: FakeModerationAction = {
      id: `quick_${Date.now()}`,
      type,
      reason,
      duration,
      timestamp: new Date().toISOString(),
    };
    triggerFakeMod(action);
  };

  const exportActions = () => {
    const blob = new Blob([JSON.stringify(fakeModerationActions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moderation-actions-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Actions exported");
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Active Fake Mod Popup - Enhanced */}
      {activeFakeMod && (
        <div className="absolute inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in">
          <div className={`max-w-lg w-full rounded-2xl border-2 overflow-hidden shadow-2xl ${
            activeFakeMod.type === 'ban' ? 'bg-gradient-to-b from-red-950 to-red-900/90 border-red-500' :
            activeFakeMod.type === 'warn' ? 'bg-gradient-to-b from-amber-950 to-amber-900/90 border-amber-500' :
            activeFakeMod.type === 'mute' ? 'bg-gradient-to-b from-orange-950 to-orange-900/90 border-orange-500' :
            'bg-gradient-to-b from-purple-950 to-purple-900/90 border-purple-500'
          }`}>
            {/* Header */}
            <div className={`p-4 text-center ${
              activeFakeMod.type === 'ban' ? 'bg-red-500/20' :
              activeFakeMod.type === 'warn' ? 'bg-amber-500/20' :
              activeFakeMod.type === 'mute' ? 'bg-orange-500/20' : 'bg-purple-500/20'
            }`}>
              {activeFakeMod.type === 'ban' && <Ban className="w-20 h-20 text-red-400 mx-auto mb-3 animate-pulse" />}
              {activeFakeMod.type === 'warn' && <AlertTriangle className="w-20 h-20 text-amber-400 mx-auto mb-3 animate-pulse" />}
              {activeFakeMod.type === 'mute' && <VolumeX className="w-20 h-20 text-orange-400 mx-auto mb-3 animate-pulse" />}
              {activeFakeMod.type === 'kick' && <UserX className="w-20 h-20 text-purple-400 mx-auto mb-3 animate-pulse" />}
              
              <h2 className="text-3xl font-black text-white mb-1 tracking-tight">
                {activeFakeMod.type === 'ban' ? 'YOU HAVE BEEN BANNED' :
                 activeFakeMod.type === 'warn' ? 'WARNING ISSUED' :
                 activeFakeMod.type === 'mute' ? 'YOU HAVE BEEN MUTED' : 'YOU HAVE BEEN KICKED'}
              </h2>
              <p className="text-white/60 text-sm">UrbanShade Moderation System</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="bg-black/30 rounded-xl p-4">
                <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Reason</p>
                <p className="text-white text-lg">{activeFakeMod.reason}</p>
              </div>

              {activeFakeMod.duration && (
                <div className="flex items-center gap-3 bg-black/30 rounded-xl p-4">
                  <Clock className="w-5 h-5 text-white/50" />
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider">Duration</p>
                    <p className="text-white font-bold">{activeFakeMod.duration}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-white/40">
                <Shield className="w-4 h-4" />
                <span>Action ID: {activeFakeMod.id}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
              <p className="text-center text-xs text-white/30 mb-3">
                ⚠️ [FAKE - DEF-DEV Testing Mode] ⚠️
              </p>
              <button 
                onClick={dismissFakeMod} 
                className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" /> Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-rose-900/30 to-pink-900/30 border-b border-rose-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30">
                <Gavel className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  FakeMod Control Panel
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-medium border border-rose-500/30">
                    <Sparkles className="w-3 h-3 inline mr-1" />MOD/OWNER
                  </span>
                </h2>
                <p className="text-xs text-slate-500">Test moderation actions without real consequences</p>
              </div>
            </div>
            <button 
              onClick={exportActions}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400"
              title="Export actions"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-slate-800/50">
          <h3 className="text-sm font-bold text-slate-400 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button 
              onClick={() => quickTrigger('ban', 'Suspicious activity detected', 'Permanent')}
              className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium transition-all flex flex-col items-center gap-1"
            >
              <Ban className="w-5 h-5" />
              Quick Ban
            </button>
            <button 
              onClick={() => quickTrigger('warn', 'Please follow community guidelines')}
              className="p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-medium transition-all flex flex-col items-center gap-1"
            >
              <AlertTriangle className="w-5 h-5" />
              Quick Warn
            </button>
            <button 
              onClick={() => quickTrigger('mute', 'Excessive messages', '30 minutes')}
              className="p-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm font-medium transition-all flex flex-col items-center gap-1"
            >
              <VolumeX className="w-5 h-5" />
              Quick Mute
            </button>
            <button 
              onClick={() => quickTrigger('kick', 'Session timeout')}
              className="p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 text-sm font-medium transition-all flex flex-col items-center gap-1"
            >
              <UserX className="w-5 h-5" />
              Quick Kick
            </button>
          </div>
        </div>

        {/* Create Action */}
        <div className="p-4 border-b border-slate-800/50 bg-slate-900/30">
          <h3 className="text-sm font-bold text-rose-400 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Custom Action
          </h3>
          
          {/* Action Type Selector */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {actionTypes.map(at => {
              const isSelected = newAction.type === at.type;
              return (
                <button
                  key={at.type}
                  onClick={() => setNewAction(p => ({ ...p, type: at.type }))}
                  className={`p-3 rounded-xl border-2 text-sm flex flex-col items-center gap-1 transition-all ${
                    isSelected 
                      ? at.type === 'ban' ? 'bg-red-500/20 border-red-500 text-red-400' 
                      : at.type === 'warn' ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                      : at.type === 'mute' ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                      : 'bg-purple-500/20 border-purple-500 text-purple-400'
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <at.icon className="w-5 h-5" />
                  <span className="font-medium">{at.label}</span>
                </button>
              );
            })}
          </div>

          {/* Preset Reasons */}
          <div className="mb-4">
            <p className="text-xs text-slate-500 mb-2">Preset Reasons:</p>
            <div className="flex flex-wrap gap-1">
              {presetReasons.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className={`px-2 py-1 rounded text-xs transition-all ${
                    selectedPreset === preset.id
                      ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                  }`}
                >
                  {preset.id}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Reason for action..."
              value={newAction.reason}
              onChange={e => { setNewAction(p => ({ ...p, reason: e.target.value })); setSelectedPreset(null); }}
              className="w-full p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-sm focus:border-rose-500/50 focus:outline-none transition-colors"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Duration (e.g. 7 days, Permanent)"
                value={newAction.duration}
                onChange={e => setNewAction(p => ({ ...p, duration: e.target.value }))}
                className="flex-1 p-3 bg-slate-800/50 border border-slate-700 rounded-xl text-sm focus:border-rose-500/50 focus:outline-none transition-colors"
              />
              <button 
                onClick={createAction} 
                className="px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 rounded-xl text-white font-bold flex items-center gap-2 transition-all shadow-lg shadow-rose-500/20"
              >
                <Plus className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </div>

        {/* Saved Actions */}
        <div className="p-4">
          <h3 className="text-sm font-bold text-slate-400 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Saved Actions ({fakeModerationActions.length})
            </span>
          </h3>
          
          {fakeModerationActions.length === 0 ? (
            <div className="text-center py-12 text-slate-600">
              <Gavel className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No saved moderation actions</p>
              <p className="text-xs text-slate-700 mt-1">Create custom actions above or use quick actions</p>
            </div>
          ) : (
            <div className="space-y-2">
              {fakeModerationActions.map(action => (
                <div 
                  key={action.id} 
                  className={`p-4 rounded-xl border transition-all hover:scale-[1.01] ${
                    action.type === 'ban' ? 'bg-red-500/5 border-red-500/30' :
                    action.type === 'warn' ? 'bg-amber-500/5 border-amber-500/30' :
                    action.type === 'mute' ? 'bg-orange-500/5 border-orange-500/30' :
                    'bg-purple-500/5 border-purple-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      action.type === 'ban' ? 'bg-red-500/20' :
                      action.type === 'warn' ? 'bg-amber-500/20' :
                      action.type === 'mute' ? 'bg-orange-500/20' : 'bg-purple-500/20'
                    }`}>
                      {action.type === 'ban' && <Ban className="w-4 h-4 text-red-400" />}
                      {action.type === 'warn' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                      {action.type === 'mute' && <VolumeX className="w-4 h-4 text-orange-400" />}
                      {action.type === 'kick' && <UserX className="w-4 h-4 text-purple-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold capitalize text-sm">{action.type}</span>
                        {action.duration && (
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {action.duration}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 truncate">{action.reason}</p>
                    </div>
                    <button 
                      onClick={() => triggerFakeMod(action)} 
                      className="p-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 rounded-xl text-green-400 transition-all"
                      title="Trigger this action"
                    >
                      <Play className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FakeModTab;