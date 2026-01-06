export interface Report {
  id: number;
  registrationNumber: string;
  subject: string;
  marks: number;
  date: string;
}

export interface Subject {
  id: number;
  name: string;
}
