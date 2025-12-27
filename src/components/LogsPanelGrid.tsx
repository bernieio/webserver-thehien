/**
 * LogsPanelGrid Component
 * 3 panel ngang: INFO, WARNING, DEBUG với scroll terminal-style
 */

import { useLogs, LogEntry } from '@/hooks/useLogs';
import { formatLogTime } from '@/utils/formatters';

interface LogsPanelGridProps {
  startDate: string;
  endDate: string;
}

export default function LogsPanelGrid({ startDate, endDate }: LogsPanelGridProps) {
  const levels = ['info', 'warning', 'debug'] as const;
  const levelLabels = { info: 'INFO', warning: 'WARNING', debug: 'DEBUG' };
  const levelColors = {
    info: { bg: 'bg-[#dbeafe]', text: 'text-[#1e40af]', border: 'border-[#3b82f6]' },
    warning: { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]', border: 'border-[#f59e0b]' },
    debug: { bg: 'bg-[#f5f5f5]', text: 'text-[#666666]', border: 'border-[#999999]' },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {levels.map((level) => (
        <LogLevelPanel
          key={level}
          level={level}
          label={levelLabels[level]}
          colors={levelColors[level]}
          startDate={startDate}
          endDate={endDate}
        />
      ))}
    </div>
  );
}

function LogLevelPanel({
  level,
  label,
  colors,
  startDate,
  endDate,
}: {
  level: string;
  label: string;
  colors: { bg: string; text: string; border: string };
  startDate: string;
  endDate: string;
}) {
  const { data, isLoading } = useLogs({
    start_date: startDate,
    end_date: endDate,
    level,
    page: 1,
    page_size: 100,
  });

  const logs = data?.items ?? [];

  return (
    <div className={`card border-t-4 ${colors.border}`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
          {label}
        </span>
        <span className="text-xs text-[#999999]">{logs.length} mục</span>
      </div>

      <div className="bg-[#1a1a1a] rounded-lg overflow-hidden font-mono text-xs" style={{ height: '300px' }}>
        <div className="overflow-y-auto h-full p-3">
          {isLoading ? (
            <div className="text-[#666666]">Đang tải...</div>
          ) : logs.length > 0 ? (
            <div className="space-y-1">
              {logs.map((log: LogEntry, i: number) => (
                <div key={i} className="flex gap-2 py-0.5">
                  <span className="text-[#666666] flex-shrink-0">
                    [{formatLogTime(log.timestamp || log.created_at)}]
                  </span>
                  <span className="text-[#e5e5e5] break-all">
                    {log.message || log.action}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[#666666] text-center py-4">Không có nhật ký</div>
          )}
        </div>
      </div>
    </div>
  );
}
