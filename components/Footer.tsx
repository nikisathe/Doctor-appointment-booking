
import React from 'react';
import { Link } from 'react-router-dom';
import { StethoscopeIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';


const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();

  return (
    <footer className="bg-neutral-800 text-neutral-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-white mb-4">
              <StethoscopeIcon className="w-8 h-8" />
              <span>DocBook</span>
            </Link>
            <p className="text-sm text-neutral-400">Your health, our priority. Book appointments with trusted doctors seamlessly.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/doctors" className="hover:text-white transition-colors">Find a Doctor</Link></li>
              {user && <li><Link to="/profile" className="hover:text-white transition-colors">My Appointments</Link></li>}
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Specializations</h3>
            <ul className="space-y-2">
              <li><Link to="/doctors?spec=Cardiology" className="hover:text-white transition-colors">Cardiology</Link></li>
              <li><Link to="/doctors?spec=Dermatology" className="hover:text-white transition-colors">Dermatology</Link></li>
              <li><Link to="/doctors?spec=Pediatrics" className="hover:text-white transition-colors">Pediatrics</Link></li>
              <li><Link to="/doctors?spec=Orthopedics" className="hover:text-white transition-colors">Orthopedics</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <p className="text-sm">123 Health St, Wellness City</p>
            <p className="text-sm">contact@docbook.com</p>
            <p className="text-sm">(123) 456-7890</p>
          </div>
        </div>
        <div className="mt-12 border-t border-neutral-700 pt-8 text-center text-sm text-neutral-400">
          <p>&copy; {2024} DocBook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
