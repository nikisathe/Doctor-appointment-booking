
import { Appointment, Review } from '../types';

const APPOINTMENTS_KEY = 'docbook_appointments';

const getInitialAppointments = (): Appointment[] => {
    // A past date for a completed appointment
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 7);
    const pastDateString = pastDate.toISOString().split('T')[0];

    // A future date for an upcoming appointment
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const futureDateString = futureDate.toISOString().split('T')[0];
    
    // An appointment for tomorrow to test reminders
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];

    return [
        { 
            id: 'seed_apt_1', 
            doctorId: '1', 
            doctorName: 'Dr. Evelyn Reed', 
            doctorSpecialization: 'Cardiology', 
            date: pastDateString, 
            time: '10:00 AM', 
            userId: 'user1', // Example user id
            status: 'completed',
            hasBeenReviewed: false,
        },
        { 
            id: 'seed_apt_2', 
            doctorId: '3', 
            doctorName: 'Dr. Anika Patel', 
            doctorSpecialization: 'Pediatrics', 
            date: futureDateString, 
            time: '09:00 AM', 
            userId: 'user1',
            status: 'upcoming'
        },
        { 
            id: 'seed_apt_3', 
            doctorId: '2', 
            doctorName: 'Dr. Samuel Chen', 
            doctorSpecialization: 'Dermatology', 
            date: tomorrowString, 
            time: '02:00 PM', 
            userId: 'user1',
            status: 'upcoming'
        },
    ];
};

const getAppointmentDateTime = (appointment: Appointment): Date => {
    const [year, month, day] = appointment.date.split('-').map(Number);
    const [time, period] = appointment.time.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period.toUpperCase() === 'PM' && hours < 12) {
        hours += 12;
    }
    if (period.toUpperCase() === 'AM' && hours === 12) { // Handle 12 AM (midnight)
        hours = 0;
    }
    
    return new Date(year, month - 1, day, hours, minutes);
};

const appointmentService = {

    getAppointmentDateTime,

    async getAppointments(userId: string): Promise<Appointment[]> {
        let appointments: Appointment[] = [];
        try {
            const storedAppointments = localStorage.getItem(APPOINTMENTS_KEY);
            if (!storedAppointments) {
                // Seed data for a "user1" if storage is empty
                 const initialData = getInitialAppointments();
                 localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(initialData));
                 appointments = initialData;
            } else {
                appointments = JSON.parse(storedAppointments);
            }
        } catch (e) {
            console.error("Failed to parse appointments from localStorage", e);
            return [];
        }

        // Automatically update status of appointments
        const now = new Date();
        let dataUpdated = false;
        const updatedAppointments = appointments.map(apt => {
            if (apt.status === 'upcoming' && getAppointmentDateTime(apt) < now) {
                apt.status = 'completed';
                dataUpdated = true;
            }
            return apt;
        });

        if (dataUpdated) {
            localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(updatedAppointments));
        }

        return updatedAppointments.filter(apt => apt.userId === userId);
    },

    async bookAppointment(newAppointmentData: Omit<Appointment, 'id' | 'status'>): Promise<Appointment> {
        const storedAppointments = localStorage.getItem(APPOINTMENTS_KEY) || '[]';
        const appointments: Appointment[] = JSON.parse(storedAppointments);

        const newAppointment: Appointment = {
            ...newAppointmentData,
            id: Date.now().toString(),
            status: 'upcoming',
        };

        appointments.push(newAppointment);
        localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
        return newAppointment;
    },

    async cancelAppointment(appointmentId: string): Promise<void> {
        const storedAppointments = localStorage.getItem(APPOINTMENTS_KEY) || '[]';
        let appointments: Appointment[] = JSON.parse(storedAppointments);
        const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);
        if (appointmentIndex > -1) {
            appointments[appointmentIndex].status = 'cancelled';
            localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
        }
    },

    async updateAppointment(appointmentToUpdate: Appointment): Promise<Appointment> {
        const storedAppointments = localStorage.getItem(APPOINTMENTS_KEY) || '[]';
        let appointments: Appointment[] = JSON.parse(storedAppointments);
        const index = appointments.findIndex(apt => apt.id === appointmentToUpdate.id);
        if (index > -1) {
            appointments[index] = appointmentToUpdate;
            localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
        }
        return appointmentToUpdate;
    },

    async markAppointmentAsReviewed(appointmentId: string): Promise<void> {
        const storedAppointments = localStorage.getItem(APPOINTMENTS_KEY) || '[]';
        let appointments: Appointment[] = JSON.parse(storedAppointments);
        const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);
        if (appointmentIndex > -1) {
            appointments[appointmentIndex].hasBeenReviewed = true;
            localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
        }
    },
};

export { appointmentService };