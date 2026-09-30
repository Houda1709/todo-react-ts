export type Task = {
  id: string; // UUID (avant : number)
  text: string;
  done: boolean;
};

export type Filter = "all" | "active" | "done";