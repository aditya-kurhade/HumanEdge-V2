import React, { useState } from 'react';
import { TableIcon, XIcon } from './Icons';

export function FeedTableModal({ isOpen, onClose, feeds = [] }) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'GOOD' | 'BAD'

  if (!isOpen) return null;

  const filteredFeeds = feeds.filter((f) => {
    if (filter === 'ALL') return true;
    const status = String(f.field2 ?? '').toUpperCase();
    const isGood = status === '1' || status === 'GOOD' || status === 'CORRECT';
    return filter === 'GOOD' ? isGood : !isGood;
  });

  const exportCSV = () => {
    if (feeds.length === 0) return;
    const headers = ['Timestamp,Angle,Status,AccelX,AccelY,AccelZ,GyroX,GyroY,GyroZ'];
    const rows = feeds.map((f) =>
      [
        f.created_at || '',
        f.field1 || '',
        f.field2 || '',
        f.field3 || '',
        f.field4 || '',
        f.field5 || '',
        f.field6 || '',
        f.field7 || '',
        f.field8 || '',
      ].join(',')
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `humanedge_posture_telemetry_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl glass-card rounded-2xl border border-slate-700/80 shadow-2xl p-6 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <TableIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Raw ThingSpeak Telemetry Logs</h3>
              <p className="text-xs text-slate-400">Inspecting all 8 channel data fields (Last {feeds.length} records)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportCSV}
              className="text-xs px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center gap-2 my-3 text-xs flex-shrink-0">
          <span className="text-slate-400">Filter by Classification:</span>
          {['ALL', 'GOOD', 'BAD'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filter === item
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {item}
            </button>
          ))}
          <span className="ml-auto text-slate-400 font-mono text-[11px]">
            Showing {filteredFeeds.length} of {feeds.length} records
          </span>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto rounded-xl border border-slate-800/80 bg-slate-950/60 font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900/90 text-slate-400 sticky top-0 border-b border-slate-800 z-10">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Field 1 (Angle)</th>
                <th className="py-2.5 px-3">Field 2 (Status)</th>
                <th className="py-2.5 px-3">Field 3 (Ax)</th>
                <th className="py-2.5 px-3">Field 4 (Ay)</th>
                <th className="py-2.5 px-3">Field 5 (Az)</th>
                <th className="py-2.5 px-3">Field 6 (Gx)</th>
                <th className="py-2.5 px-3">Field 7 (Gy)</th>
                <th className="py-2.5 px-3">Field 8 (Gz)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredFeeds.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-slate-400">
                    No telemetry records found.
                  </td>
                </tr>
              ) : (
                filteredFeeds.map((feed, idx) => {
                  const status = String(feed.field2 ?? '').toUpperCase();
                  const isGood = status === '1' || status === 'GOOD' || status === 'CORRECT';
                  return (
                    <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-2 px-3 text-slate-300">
                        {feed.created_at ? new Date(feed.created_at).toLocaleTimeString() : `--`}
                      </td>
                      <td className="py-2 px-3 text-cyan-300 font-bold">{feed.field1 ?? '--'}°</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isGood ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {feed.field2 ?? '--'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-300">{feed.field3 ?? '--'}</td>
                      <td className="py-2 px-3 text-slate-300">{feed.field4 ?? '--'}</td>
                      <td className="py-2 px-3 text-slate-300">{feed.field5 ?? '--'}</td>
                      <td className="py-2 px-3 text-slate-400">{feed.field6 ?? '--'}</td>
                      <td className="py-2 px-3 text-slate-400">{feed.field7 ?? '--'}</td>
                      <td className="py-2 px-3 text-slate-400">{feed.field8 ?? '--'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
