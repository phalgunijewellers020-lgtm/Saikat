import React, { useState, useEffect } from 'react';
import { History, Shield, RefreshCw } from 'lucide-react';
import { ActivityLog } from '../../types/database';
import { DB } from '../../lib/supabase';

export const AdminActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  const loadLogs = async () => {
    const data = await DB.getLogs();
    setLogs(data);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-serif-display font-medium text-white">
            Studio Security & Activity Audit Log
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Immutable tracking of actions performed across the Saikat Photography CMS.
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="bg-white/10 hover:bg-white/15 text-white text-xs font-semibold px-3.5 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Audit Trail</span>
        </button>
      </div>

      <div className="bg-[#0B0B0B] rounded-lg border border-white/10 overflow-hidden shadow">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-neutral-400 uppercase tracking-wider text-[10px] bg-white/[0.02]">
              <th className="py-3 px-4 font-semibold">Timestamp</th>
              <th className="py-3 px-4 font-semibold">Admin Account</th>
              <th className="py-3 px-4 font-semibold">Action</th>
              <th className="py-3 px-4 font-semibold">Module</th>
              <th className="py-3 px-4 font-semibold">Event Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-neutral-300">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-4 font-mono text-[11px] text-neutral-400 whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString()}
                </td>
                <td className="py-3 px-4 font-medium text-white">
                  {log.admin_email}
                </td>
                <td className="py-3 px-4 text-[#D91B24] font-semibold">
                  {log.action}
                </td>
                <td className="py-3 px-4 text-neutral-300">
                  {log.entity}
                </td>
                <td className="py-3 px-4 text-neutral-400">
                  {log.details || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminActivityLogs;
