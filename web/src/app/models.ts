export type User = {
  id: string;
  email: string;
  name: string;
};

export type Session = {
  token: string;
  user: User;
};

export type Task = {
  id: string;
  title: string;
  notes: string;
  done: boolean;
  createdAt: string;
};
