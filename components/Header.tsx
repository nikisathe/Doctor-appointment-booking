
import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { StethoscopeIcon, UserIcon, MenuIcon, XIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';


const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false); // Close menu on logout
    navigate('/');
  };

  const closeMenu = () => setIsMenuOpen(false);

  const navLinkClasses = 'text-neutral-600 hover:text-primary transition-colors duration-200';
  const activeNavLinkClasses = 'text-primary font-semibold';
  
  const mobileNavLinkClasses = 'block py-2 px-4 text-lg text-neutral-700 hover:bg-primary-light hover:text-primary rounded-md';
  const activeMobileNavLinkClasses = 'bg-primary-light text-primary font-semibold';


  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" onClick={closeMenu} className="flex items-center space-x-2 text-2xl font-bold text-primary">
              <StethoscopeIcon className="w-8 h-8" />
              <span>DocBook</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:space-x-8">
            <NavLink to="/" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`} end>Home</NavLink>
            <NavLink to="/doctors" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Find a Doctor</NavLink>
            <NavLink to="/about" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>About</NavLink>
            <NavLink to="/contact" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Contact</NavLink>
          </nav>

          {/* Desktop Auth Links */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
               <div className="relative group">
                <NavLink to="/profile" className="flex items-center space-x-2 text-neutral-600 hover:text-primary transition-colors">
                  <UserIcon className="w-6 h-6" />
                  <span className="hidden sm:inline">{user.name}</span>
                </NavLink>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                   <button 
                     onClick={handleLogout} 
                     className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                   >
                     Logout
                   </button>
                 </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-neutral-600 hover:text-primary">Sign In</Link>
                <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors">Sign Up</Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-600 hover:text-primary hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden absolute top-20 left-0 w-full bg-white shadow-lg z-40">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             <NavLink to="/" onClick={closeMenu} className={({ isActive }) => `${mobileNavLinkClasses} ${isActive ? activeMobileNavLinkClasses : ''}`} end>Home</NavLink>
             <NavLink to="/doctors" onClick={closeMenu} className={({ isActive }) => `${mobileNavLinkClasses} ${isActive ? activeMobileNavLinkClasses : ''}`}>Find a Doctor</NavLink>
             <NavLink to="/about" onClick={closeMenu} className={({ isActive }) => `${mobileNavLinkClasses} ${isActive ? activeMobileNavLinkClasses : ''}`}>About</NavLink>
             <NavLink to="/contact" onClick={closeMenu} className={({ isActive }) => `${mobileNavLinkClasses} ${isActive ? activeMobileNavLinkClasses : ''}`}>Contact</NavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-neutral-200">
            {user ? (
              <div className="px-5">
                <div className="flex items-center">
                  <UserIcon className="w-8 h-8 text-neutral-500" />
                  <div className="ml-3">
                    <div className="text-base font-medium text-neutral-800">{user.name}</div>
                    <div className="text-sm font-medium text-neutral-500">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link to="/profile" onClick={closeMenu} className={mobileNavLinkClasses}>My Profile</Link>
                  <button onClick={handleLogout} className={`${mobileNavLinkClasses} w-full text-left`}>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-2 space-y-2">
                 <Link to="/login" onClick={closeMenu} className="block w-full text-center px-4 py-2 text-base font-medium text-white bg-primary rounded-md hover:bg-primary-dark">Sign In</Link>
                 <Link to="/signup" onClick={closeMenu} className="block w-full text-center px-4 py-2 text-base font-medium text-primary bg-primary-light rounded-md hover:bg-primary/20">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
