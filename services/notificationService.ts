
import { Appointment, User } from '../types';

/**
 * Mocks sending an email reminder for an upcoming appointment.
 * In a real application, this would integrate with an email service provider.
 * @param user The user to whom the reminder will be sent.
 * @param appointment The appointment details.
 */
export const sendEmailReminder = (user: User, appointment: Appointment): void => {
  const appointmentDate = new Date(appointment.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const emailBody = `
--- Mock Email Reminder Sent ---
Recipient: ${user.email}
Subject: Appointment Reminder: Your appointment with ${appointment.doctorName} is tomorrow!

Hi ${user.name},

This is a friendly reminder for your upcoming appointment with ${appointment.doctorName} (${appointment.doctorSpecialization}).

  - Date: ${appointmentDate}
  - Time: ${appointment.time}

We look forward to seeing you. If you need to reschedule, please visit the appointments section of your profile.

Thank you,
The DocBook Team
--------------------------------
  `;

  console.log(emailBody.trim());
};
