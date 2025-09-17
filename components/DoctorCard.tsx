
import React from 'react';
import { Link } from 'react-router-dom';
import { Doctor } from '../types';
import { StethoscopeIcon, ArrowRightIcon } from './Icons';

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex items-start space-x-4">
          <img src={doctor.pictureUrl} alt={doctor.name} className="w-24 h-24 rounded-full object-cover border-4 border-primary-light" />
          <div>
            <h3 className="text-xl font-bold text-neutral-800">{doctor.name}</h3>
            <p className="text-primary font-semibold">{doctor.specialization}</p>
            <p className="text-sm text-neutral-500 mt-1">{doctor.experience} years of experience</p>
          </div>
        </div>
        <p className="text-neutral-600 mt-4 text-sm line-clamp-3">{doctor.bio}</p>
      </div>
      <div className="bg-neutral-50 p-4 border-t border-neutral-200">
        <Link 
          to={`/doctors/${doctor.id}`} 
          className="group inline-flex items-center justify-center w-full text-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
        >
          Book Appointment
          <ArrowRightIcon className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;
