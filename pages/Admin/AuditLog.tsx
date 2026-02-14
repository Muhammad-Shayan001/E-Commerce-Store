import React from 'react';
import { motion } from 'framer-motion';
import { History, Shield, ShieldCheck, User as UserIcon, Calendar, Info } from 'lucide-react';
import { useAppContext } from '../../App.js';
import AdminSidebar from './AdminSidebar.js';

const AdminAuditLog: React.FC = () => {
  const { auditLogs } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#090b0d] flex">
      <AdminSidebar />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tight uppercase">Audit Trail</h1>
          <p className="text-gray-500 text-sm font-medium">Immutable security logging of all administrative operations.</p>
        </div>

        <div className="bg-white dark:bg-white/5 rounded-[3.5rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Timestamp</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Admin</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Operation</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Target</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Security</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center space-x-3 text-xs font-bold text-gray-600 dark:text-gray-400">
                        <Calendar size={14} className="text-primary-500" />
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500">
                           <UserIcon size={14} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-tight">{log.adminId}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                       <span className="px-3 py-1 bg-primary-500/10 text-primary-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                          {log.action}
                       </span>
                    </td>
                    <td className="px-10 py-6">
                       <p className="text-xs font-bold leading-relaxed max-w-[200px] truncate">{log.details}</p>
                       <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">{log.resource}</p>
                    </td>
                    <td className="px-10 py-6">
                       <div className="flex items-center text-emerald-500 space-x-2">
                          <ShieldCheck size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {auditLogs.length === 0 && (
            <div className="py-32 text-center bg-gray-50/50 dark:bg-white/[0.02]">
              <Shield className="mx-auto mb-6 text-gray-200" size={48} />
              <h3 className="text-xl font-black tracking-tight uppercase mb-2">No Security Logs</h3>
              <p className="text-gray-500 font-medium">Perform admin actions to generate an audit trail.</p>
            </div>
          )}
        </div>
        
        <div className="mt-12 p-8 bg-primary-500/10 rounded-[3rem] border border-primary-500/20 flex items-center space-x-6">
            <div className="w-16 h-16 bg-primary-500 text-white rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-lg">
                <Shield size={32} />
            </div>
            <div>
                <h4 className="text-lg font-black uppercase tracking-tight text-primary-700 dark:text-primary-400 mb-1">Architectural Resilience</h4>
                <p className="text-sm text-primary-600/80 font-medium leading-relaxed">This audit trail is locally immutable within the current session. In production, logs are streamed directly to an external SIEM for multi-layered forensic security.</p>
            </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAuditLog;