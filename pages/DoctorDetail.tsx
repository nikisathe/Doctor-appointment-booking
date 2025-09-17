
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Doctor, Review } from '../types';
import { doctorService } from '../services/mockData';
import { appointmentService } from '../services/appointmentService';
import { CalendarIcon, ClockIcon, StarIcon, UserIcon } from '../components/Icons';
import { useAuth } from '../contexts/AuthContext';
import StarRating from '../components/StarRating';

type DoctorWithReviews = Doctor & { reviews: Review[] };

const DoctorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<DoctorWithReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return;
      setLoading(true);
      const data = await doctorService.getDoctorById(id);
      if (data) {
        setDoctor(data);
      }
      setLoading(false);
    };
    fetchDoctor();
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
        setBookingError('You must be logged in to book an appointment.');
        return;
    }
    if (!selectedDate || !selectedTime || !doctor) {
        setBookingError('Please select a date and time for your appointment.');
        return;
    }
    setBookingError('');
    setIsBooking(true);
    try {
        await appointmentService.bookAppointment({
            doctorId: doctor.id,
            doctorName: doctor.name,
            doctorSpecialization: doctor.specialization,
            date: selectedDate,
            time: selectedTime,
            userId: user.id,
        });
        setBookingSuccess(true);
    } catch (error) {
        setBookingError(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
        setIsBooking(false);
    }
  };

  const averageRating = useMemo(() => {
    if (!doctor || !doctor.reviews || doctor.reviews.length === 0) return 0;
    const total = doctor.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (total / doctor.reviews.length);
  }, [doctor]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 animate-pulse">
        <div className="bg-white shadow-xl rounded-lg p-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="w-48 h-48 rounded-full bg-neutral-200 mx-auto"></div>
              <div className="h-8 bg-neutral-200 rounded mt-4 w-3/4 mx-auto"></div>
              <div className="h-6 bg-neutral-200 rounded mt-2 w-1/2 mx-auto"></div>
            </div>
            <div className="md:w-2/3 space-y-6">
              <div className="h-6 bg-neutral-200 rounded w-full"></div>
              <div className="h-4 bg-neutral-200 rounded w-full"></div>
              <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
              <div className="h-12 bg-neutral-200 rounded mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return <div className="text-center py-20">Doctor not found.</div>;
  }

  const availableTimes = selectedDate ? doctor.availability[selectedDate] || [] : [];
  
  return (
    <div className="bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-10 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Doctor Info Column */}
            <div className="lg:col-span-1 text-center lg:border-r lg:pr-8">
              <img src={doctor.pictureUrl} alt={doctor.name} className="w-48 h-48 rounded-full object-cover mx-auto border-4 border-primary" />
              <h1 className="text-3xl font-bold text-neutral-800 mt-4">{doctor.name}</h1>
              <p className="text-xl text-primary font-semibold">{doctor.specialization}</p>
              <div className="flex items-center justify-center mt-2">
                <StarRating rating={averageRating} readOnly={true} iconSize="w-5 h-5" />
                <span className="ml-2 text-neutral-600">({doctor.reviews.length} reviews)</span>
              </div>
              <p className="text-sm text-neutral-600 mt-4 text-left">{doctor.bio}</p>
            </div>

            {/* Details and Booking Column */}
            <div className="lg:col-span-2">
              <div className="border-b pb-6">
                <h2 className="text-2xl font-bold text-neutral-800 mb-4">About Dr. {doctor.name.split(' ').pop()}</h2>
                <div className="space-y-4 text-neutral-700">
                    <p><strong>Experience:</strong> {doctor.experience} years</p>
                    <div>
                        <p><strong>Education:</strong></p>
                        <ul className="list-disc list-inside ml-4">
                            {doctor.education.map((edu, i) => <li key={i}>{edu}</li>)}
                        </ul>
                    </div>
                </div>
              </div>
              
              {/* Booking Section */}
              <div className="mt-6">
                <h2 className="text-2xl font-bold text-neutral-800 mb-4">Book an Appointment</h2>
                {bookingSuccess ? (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
                        <p className="font-bold">Appointment Booked!</p>
                        <p>Your appointment has been successfully scheduled. You can view it in your profile.</p>
                        <Link to="/profile" className="mt-2 inline-block text-sm font-semibold text-green-800 hover:underline">Go to My Appointments</Link>
                    </div>
                ) : (
                <>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="appointment-date" className="flex items-center text-sm font-medium text-neutral-700 mb-1">
                                <CalendarIcon className="w-4 h-4 mr-2 text-neutral-500" />
                                Select Date
                            </label>
                            <input
                                type="date"
                                id="appointment-date"
                                value={selectedDate}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    setSelectedTime('');
                                }}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                            />
                        </div>

                        {selectedDate && (
                            <div>
                                <label htmlFor="appointment-time" className="flex items-center text-sm font-medium text-neutral-700 mb-1">
                                    <ClockIcon className="w-4 h-4 mr-2 text-neutral-500" />
                                    Select Time
                                </label>
                                {availableTimes.length > 0 ? (
                                    <select
                                        id="appointment-time"
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                        className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white"
                                    >
                                        <option value="" disabled>Select an available time</option>
                                        {availableTimes.map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="text-neutral-500 text-sm mt-1 p-3 bg-neutral-100 rounded-md border">
                                        No available appointments on this date. Please select another day.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {bookingError && <p className="text-red-600 text-sm mt-4">{bookingError}</p>}
                    <button
                        onClick={handleBooking}
                        disabled={!selectedTime || isBooking}
                        className="w-full mt-6 px-6 py-3 text-lg font-semibold text-white bg-primary rounded-md hover:bg-primary-dark transition-colors disabled:bg-neutral-400 disabled:cursor-not-allowed"
                    >
                        {isBooking ? 'Booking...' : 'Confirm Appointment'}
                    </button>
                    {!user && (
                        <p className="text-center text-sm text-neutral-500 mt-4">
                            Please <Link to="/login" className="text-primary hover:underline">log in</Link> or <Link to="/signup" className="text-primary hover:underline">sign up</Link> to book an appointment.
                        </p>
                    )}
                </>
                )}
              </div>
            </div>
          </div>
          
          {/* Reviews Section */}
          <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold text-neutral-800 mb-6">Patient Reviews</h2>
            {doctor.reviews.length > 0 ? (
                <div className="space-y-6">
                    {doctor.reviews.map(review => (
                        <div key={review.id} className="bg-neutral-50 p-4 rounded-lg border">
                           <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-light text-primary rounded-full flex items-center justify-center">
                                        <UserIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-neutral-800">{review.userName}</p>
                                        <p className="text-xs text-neutral-500">{new Date(review.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <StarRating rating={review.rating} readOnly={true} iconSize="w-5 h-5"/>
                           </div>
                            <p className="text-neutral-600 mt-3">{review.comment}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-neutral-500">No reviews yet for this doctor.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;
