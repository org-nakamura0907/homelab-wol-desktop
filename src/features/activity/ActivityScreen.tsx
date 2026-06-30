import { LogEntry } from "../../types/ui";

interface Props {
  log: LogEntry[];
  onClear: () => void;
}

/** アクティビティログをターミナル風の見た目で表示する画面。 */
export function ActivityScreen({ log, onClear }: Props) {
  const fmtTs = (ts: Date) => ts.toTimeString().slice(0, 8);

  return (
    <div className="activity-screen">
      <div className="terminal-header">
        <span>$ tail -f wol.log</span>
        {log.length > 0 && (
          <button className="clear-log-btn" onClick={onClear}>
            CLEAR
          </button>
        )}
      </div>
      <div className="terminal-log">
        {log.length === 0 ? (
          <div className="terminal-empty">
            No activity yet. Wake a device to get started.
            <span className="terminal-cursor" />
          </div>
        ) : (
          log.map((entry) => (
            <div key={entry.id} className={`log-entry ${entry.level}`}>
              <span className="log-ts">[{fmtTs(entry.ts)}]</span>
              <span className="log-msg">{entry.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
