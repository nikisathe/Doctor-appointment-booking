
import React from 'react';
import { Link } from 'react-router-dom';
import { StethoscopeIcon } from '../components/Icons';
import { DOCTORS, SPECIALIZATIONS } from '../services/mockData';
import DoctorCard from '../components/DoctorCard';
import doctorImg from "../public/vecteezy_ai-generated-a-smiling-doctor-with-glasses-and-a-white-lab_41408858.png";



const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center">
    <div className="inline-block p-4 bg-primary-light text-primary rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-neutral-800 mb-2">{title}</h3>
    <p className="text-neutral-600">{description}</p>
  </div>
);

const Home: React.FC = () => {
  const featuredDoctors = DOCTORS.slice(0, 3);

  return (
    <div className="bg-neutral-50">
      {/* Hero Section */}
      <section className="bg-primary-light relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-800 leading-tight">
              Find Your Doctor & <br />
              <span className="text-primary">Book with Ease</span>
            </h1>
            <p className="mt-4 text-lg text-neutral-600 max-w-xl mx-auto md:mx-0">
              Access a network of trusted medical professionals. Schedule your appointments online, anytime, anywhere.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/doctors"
                className="inline-block px-8 py-3 text-lg font-semibold text-white bg-primary rounded-md hover:bg-primary-dark transition-all duration-300 shadow-lg"
              >
                Find a Doctor
              </Link>
              <Link
                to="/about"
                className="inline-block px-8 py-3 text-lg font-semibold text-primary bg-white rounded-md hover:bg-neutral-100 transition-all duration-300 shadow-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img src={doctorImg} alt="doctor" />
            <img 
  src="public/vecteezy_ai-generated-a-smiling-doctor-with-glasses-and-a-white-lab_41408858.png" 
  alt="Doctor and Patient" 
  className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto rounded-lg shadow-2xl object-cover mx-auto"
/>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800">Why Choose DocBook?</h2>
            <p className="mt-2 text-neutral-600">A better healthcare experience for everyone.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<StethoscopeIcon className="w-8 h-8"/>} 
              title="Expert Doctors" 
              description="Choose from a wide range of qualified and experienced medical professionals."
            />
            <FeatureCard 
              icon={<StethoscopeIcon className="w-8 h-8"/>} 
              title="Easy Online Booking" 
              description="Schedule your appointment in just a few clicks. No more waiting on the phone."
            />
            <FeatureCard 
              icon={<StethoscopeIcon className="w-8 h-8"/>} 
              title="Manage Appointments" 
              description="View your upcoming appointments, reschedule, or cancel with ease from your profile."
            />
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800">Our Featured Doctors</h2>
            <p className="mt-2 text-neutral-600">Meet some of our top-rated specialists.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDoctors.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
