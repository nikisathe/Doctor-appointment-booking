
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  bio: string;
  education: string[];
  experience: number;
  pictureUrl: string;
  availability: { [date: string]: string[] }; // e.g., { "2024-08-20": ["09:00 AM", "10:00 AM"] }
}

export interface Review {
  id: string;
  doctorId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  time: string;
  userId: string;
  reminderSent?: boolean;
  status: 'upcoming' | 'completed' | 'cancelled';
  hasBeenReviewed?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Only used for registration/login simulation
}