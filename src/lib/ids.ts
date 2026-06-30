let _toastId = 0;
let _logId = 0;

/** トーストの一意な ID を返す。カウンタはモジュールレベルで、再レンダリングしてもリセットされない。 */
export function nextToastId(): string {
  return `t${++_toastId}`;
}

/** ログエントリの一意な ID を返す。カウンタはモジュールレベルで、再レンダリングしてもリセットされない。 */
export function nextLogId(): string {
  return `l${++_logId}`;
}
