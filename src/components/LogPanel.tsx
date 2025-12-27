/**
 * LogPanel Component
 * Panel hiển thị logs với scroll UI dạng terminal
 */

import { useActivityLogs, useServerLogs, LogEntry } from '@/hooks/useLogs';
import { formatLogTime } from '@/utils/formatters';

interface LogPanelProps {
  type: 'activity' | 'server';
  title: string;
  maxHeight?: string;
}

export default function LogPanel({ type, title, maxHeight = '300px' }: LogPanelProps) {
  const activityQuery = useActivityLogs();
  const serverQuery = useServerLogs();

  const { data: logs, isLoading } = type === 'activity' ? activityQuery : serverQuery;

  const getLevelClass = (level?: string): string => {
    switch (level?.toLowerCase()) {
      case 'debug': return 'text-[#999999]';
      case 'info': return 'text-[#3b82f6]';
      case 'warning': return 'text-[#f59e0b]';
      case 'error': return 'text-[#ef4444]';
      case 'critical': return 'text-[#ef4444] font-semibold';
      default: return 'text-[#1a1a1a]';
    }
  };

  const getLevelBadge = (level?: string): string => {
    switch (level?.toLowerCase()) {
      case 'debug': return 'bg-[#f5f5f5] text-[#666666]';
      case 'info': return 'bg-[#dbeafe] text-[#1e40af]';
      case 'warning': return 'bg-[#fef3c7] text-[#92400e]';
      case 'error': return 'bg-[#fee2e2] text-[#991b1b]';
      case 'critical': return 'bg-[#fee2e2] text-[#991b1b]';
      default: return 'bg-[#f5f5f5] text-[#666666]';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-[#666666] uppercase tracking-wider">
          {title}
        </h3>
        <span className="text-xs text-[#999999]">
          {logs?.length ?? 0} mục
        </span>
      </div>

      {/* Terminal-style log container with scroll */}
      <div
        className="bg-[#1a1a1a] rounded-lg overflow-hidden font-mono text-xs"
        style={{ maxHeight }}
      >
        <div className="overflow-y-auto p-3" style={{ maxHeight: `calc(${maxHeight} - 0px)` }}>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-[#333333] rounded w-full" />
              ))}
            </div>
          ) : logs && logs.length > 0 ? (
            <div className="space-y-1">
              {logs.map((log: LogEntry, index: number) => (
                <div key={index} className="flex items-start gap-2 py-0.5">
                  {/* Timestamp */}
                  <span className="text-[#666666] flex-shrink-0 font-mono">
                    [{formatLogTime(log.timestamp || log.created_at)}]
                  </span>
                  {/* Level badge */}
                  {log.level && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] flex-shrink-0 ${getLevelBadge(log.level)}`}>
                      {log.level.toUpperCase()}
                    </span>
                  )}
                  {/* Message */}
                  <span className={`${getLevelClass(log.level)} break-all`}>
                    {log.message || log.action || JSON.stringify(log)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-[#666666] py-4">
              Chưa có nhật ký
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
