
import React, { useState, useEffect, useMemo } from 'react';
import { Appointment, Review } from '../types';
import { CalendarIcon, UserIcon, ClockIcon } from '../components/Icons';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { sendEmailReminder } from '../services/notificationService';
import { appointmentService } from '../services/appointmentService';
import { reviewService } from '../services/reviewService';
import ReviewModal from '../components/ReviewModal';

const AppointmentCard: React.FC<{
    appointment: Appointment;
    onCancel: (id: string) => void;
    onReview: (appointment: Appointment) => void;
}> = ({ appointment, onCancel, onReview }) => (
  <div className={`bg-white p-4 rounded-lg shadow-sm border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${appointment.status === 'cancelled' ? 'opacity-60' : ''}`}>
    <div>
      <p className="font-bold text-lg text-primary">{appointment.doctorName}</p>
      <p className="text-neutral-600">{appointment.doctorSpecialization}</p>
      <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
        <span className="flex items-center gap-1.5">
          <CalendarIcon className="w-4 h-4" />
          {new Date(appointment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
        <span className="flex items-center gap-1.5">
          <ClockIcon className="w-4 h-4" />
          {appointment.time}
        </span>
      </div>
    </div>
    <div className="flex gap-2 w-full sm:w-auto">
      {appointment.status === 'upcoming' && (
        <button
          onClick={() => onCancel(appointment.id)}
          className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors w-full sm:w-auto"
        >
          Cancel
        </button>
      )}
      {appointment.status === 'completed' && !appointment.hasBeenReviewed && (
        <button
           onClick={() => onReview(appointment)}
           className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-md hover:opacity-90 transition-colors w-full sm:w-auto"
        >
          Leave a Review
        </button>
      )}
       {appointment.status === 'completed' && appointment.hasBeenReviewed && (
        <p className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md w-full sm:w-auto text-center">Reviewed</p>
      )}
      {appointment.status === 'cancelled' && (
        <p className="px-4 py-2 text-sm font-medium text-neutral-600 bg-neutral-200 rounded-md w-full sm:w-auto text-center">Cancelled</p>
      )}
    </div>
  </div>
);

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const fetchAppointments = async () => {
    if (user) {
        const userAppointments = await appointmentService.getAppointments(user.id);
        setAppointments(userAppointments);
    }
  };

  useEffect(() => {
    if (!user) {
      setAppointments([]);
      return;
    }
  
    const fetchAndProcessAppointments = async () => {
      // 1. Fetch fresh data
      const userAppointments = await appointmentService.getAppointments(user.id);
  
      // 2. Check for reminders on a copy of the data
      const appointmentsCopy = [...userAppointments];
      const now = new Date();
      const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const updatePromises: Promise<any>[] = [];
  
      appointmentsCopy.forEach((apt, index) => {
        if (!apt.reminderSent && apt.status === 'upcoming') {
          const appointmentDateTime = appointmentService.getAppointmentDateTime(apt);
          if (appointmentDateTime > now && appointmentDateTime <= twentyFourHoursFromNow) {
            sendEmailReminder(user, apt);
            const updatedApt = { ...apt, reminderSent: true };
            appointmentsCopy[index] = updatedApt; // Update local copy for immediate UI update
            updatePromises.push(appointmentService.updateAppointment(updatedApt));
          }
        }
      });
  
      // 3. Set state with the (potentially updated) data
      setAppointments(appointmentsCopy);
  
      // 4. Persist changes in the background
      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
      }
    };
  
    fetchAndProcessAppointments();
    
  }, [user]);


  const handleCancelAppointment = async (appointmentId: string) => {
    if(window.confirm('Are you sure you want to cancel this appointment?')) {
        await appointmentService.cancelAppointment(appointmentId);
        fetchAppointments(); // Re-fetch to update the list
    }
  };

  const handleOpenReviewModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsReviewModalOpen(true);
  };
  
  const handleCloseReviewModal = () => {
    setSelectedAppointment(null);
    setIsReviewModalOpen(false);
  };

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (user && selectedAppointment) {
        const review: Omit<Review, 'id' | 'date'> = {
            doctorId: selectedAppointment.doctorId,
            userId: user.id,
            userName: user.name,
            rating,
            comment,
        };
        await reviewService.addReview(review);
        await appointmentService.markAppointmentAsReviewed(selectedAppointment.id);
        fetchAppointments(); // Re-fetch to update UI
        handleCloseReviewModal();
    }
  };

  const { upcomingAppointments, pastAppointments } = useMemo(() => {
    const upcoming = appointments.filter(a => a.status === 'upcoming').sort((a,b) => appointmentService.getAppointmentDateTime(a).getTime() - appointmentService.getAppointmentDateTime(b).getTime());
    const past = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled').sort((a,b) => appointmentService.getAppointmentDateTime(b).getTime() - appointmentService.getAppointmentDateTime(a).getTime());
    return { upcomingAppointments: upcoming, pastAppointments: past };
  }, [appointments]);


  if (!user) {
    return <div className="text-center py-20">Please log in to view your profile.</div>;
  }

  return (
    <>
      <div className="bg-neutral-50 min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex items-center gap-6">
                <div className="bg-primary-light p-4 rounded-full">
                  <UserIcon className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-neutral-800">{user.name}</h1>
                  <p className="text-neutral-500">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-neutral-800 mb-6 border-b pb-4">
                Upcoming Appointments
              </h2>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map(apt => (
                    <AppointmentCard key={apt.id} appointment={apt} onCancel={handleCancelAppointment} onReview={handleOpenReviewModal} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                  <p className="text-neutral-500">You have no upcoming appointments.</p>
                  <Link to="/doctors" className="mt-4 inline-block px-6 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors">
                    Book an Appointment
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-neutral-800 mb-6 border-b pb-4">
                Past Appointments
              </h2>
              {pastAppointments.length > 0 ? (
                <div className="space-y-4">
                  {pastAppointments.map(apt => (
                    <AppointmentCard key={apt.id} appointment={apt} onCancel={handleCancelAppointment} onReview={handleOpenReviewModal} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                  <p className="text-neutral-500">You have no past appointment history.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {selectedAppointment && (
        <ReviewModal
            isOpen={isReviewModalOpen}
            onClose={handleCloseReviewModal}
            onSubmit={handleReviewSubmit}
            doctorName={selectedAppointment.doctorName}
        />
      )}
    </>
  );
};

export default Profile;