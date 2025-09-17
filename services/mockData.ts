import { Doctor, Review } from '../types';
import { reviewService } from './reviewService';

// Helper function to generate dynamic availability for the next 30 days
const generateFutureAvailability = (days = 30): { [date: string]: string[] } => {
  const availability: { [date: string]: string[] } = {};
  const today = new Date();
  const possibleTimes = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

  for (let i = 0; i < days; i++) {
    // Make doctors available on roughly 2/3 of days and not on weekends (Sunday=0, Saturday=6)
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayOfWeek = date.getDay();

    if (dayOfWeek !== 0 && dayOfWeek !== 6 && Math.random() > 0.33) {
      const dateString = date.toISOString().split('T')[0];

      // Randomly select a subset of times
      const times = possibleTimes
        .sort(() => 0.5 - Math.random()) // Shuffle
        .slice(0, Math.floor(Math.random() * 4) + 1); // Select 1 to 4 time slots
      
      if (times.length > 0) {
        // Sort times chronologically before adding
        times.sort((a, b) => {
            const timeA = new Date(`1970/01/01 ${a}`);
            const timeB = new Date(`1970/01/01 ${b}`);
            return timeA.getTime() - timeB.getTime();
        });
        availability[dateString] = times;
      }
    }
  }
  return availability;
};


export const DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Evelyn Reed',
    specialization: 'Cardiology',
    bio: 'Dr. Evelyn Reed is a board-certified cardiologist with over 15 years of experience in treating heart conditions. She is dedicated to providing compassionate and comprehensive care to her patients.',
    education: ['MD, Stanford University School of Medicine', 'Residency, Johns Hopkins Hospital'],
    experience: 15,
    pictureUrl: 'https://picsum.photos/seed/doc1/400/400',
    availability: generateFutureAvailability(),
  },
  {
    id: '2',
    name: 'Dr. Samuel Chen',
    specialization: 'Dermatology',
    bio: 'Dr. Samuel Chen specializes in medical and cosmetic dermatology. He is known for his patient-centric approach and expertise in skin cancer screening and treatment.',
    education: ['MD, Yale School of Medicine', 'Residency, UCSF Medical Center'],
    experience: 12,
    pictureUrl: 'https://picsum.photos/seed/doc2/400/400',
    availability: generateFutureAvailability(),
  },
  {
    id: '3',
    name: 'Dr. Anika Patel',
    specialization: 'Pediatrics',
    bio: 'A friendly and caring pediatrician, Dr. Anika Patel has a passion for children\'s health. She believes in building strong relationships with families to ensure the best care.',
    education: ['MD, Perelman School of Medicine', 'Residency, Children\'s Hospital of Philadelphia'],
    experience: 8,
    pictureUrl: 'https://picsum.photos/seed/doc3/400/400',
    availability: generateFutureAvailability(),
  },
  {
    id: '4',
    name: 'Dr. Marcus Thorne',
    specialization: 'Orthopedics',
    bio: 'Dr. Marcus Thorne is a leading orthopedic surgeon specializing in sports injuries and joint replacement. He utilizes the latest minimally invasive techniques for faster recovery.',
    education: ['MD, Columbia University', 'Residency, Hospital for Special Surgery'],
    experience: 20,
    pictureUrl: 'https://picsum.photos/seed/doc4/400/400',
    availability: generateFutureAvailability(),
  },
   {
    id: '5',
    name: 'Dr. Lena Petrova',
    specialization: 'Neurology',
    bio: 'Dr. Petrova is a neurologist with a focus on neurodegenerative disorders. Her research and clinical work aim to improve the quality of life for patients with complex neurological conditions.',
    education: ['MD, Harvard Medical School', 'Residency, Massachusetts General Hospital'],
    experience: 18,
    pictureUrl: 'https://picsum.photos/seed/doc5/400/400',
    availability: generateFutureAvailability(),
  },
  {
    id: '6',
    name: 'Dr. Kenji Tanaka',
    specialization: 'Gastroenterology',
    bio: 'Dr. Tanaka provides expert care for a wide range of digestive health issues. He is committed to preventive care and patient education to promote long-term wellness.',
    education: ['MD, Johns Hopkins University', 'Fellowship, Mayo Clinic'],
    experience: 14,
    pictureUrl: 'https://picsum.photos/seed/doc6/400/400',
    availability: generateFutureAvailability(),
  },
];

export const SPECIALIZATIONS = [...new Set(DOCTORS.map(d => d.specialization))].sort();

export const doctorService = {
  getDoctors: async (): Promise<Doctor[]> => {
    // Simulate API delay
    await new Promise(res => setTimeout(res, 500));
    return DOCTORS;
  },
  getDoctorById: async (id: string): Promise<(Doctor & { reviews: Review[] }) | undefined> => {
    await new Promise(res => setTimeout(res, 300));
    const doctor = DOCTORS.find(d => d.id === id);
    if (!doctor) {
        return undefined;
    }
    const reviews = await reviewService.getReviews(id);
    return { ...doctor, reviews };
  },
};