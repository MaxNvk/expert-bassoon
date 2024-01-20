export interface ITask {
  id: string;
  title: string;
  description: string;
  status: ETaskStatus;
}

export enum ETaskStatus {
  Open = 'open',
  Progress = 'progress',
  Done = 'done',
}
