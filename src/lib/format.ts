/** Date を `"Jan 1, 12:00"` 形式の文字列にフォーマット（月名は en-US ロケール）。 */
export function fmtLastSeen(date: Date): string {
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();
  const time = date.toTimeString().slice(0, 5);
  return `${month} ${day}, ${time}`;
}
