import React, { useState, useEffect, useMemo } from 'react';
import { Doctor } from '../types';
import { doctorService, SPECIALIZATIONS } from '../services/mockData';
import DoctorCard from '../components/DoctorCard';
import { XCircleIcon } from '../components/Icons';

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('name:asc');

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      const data = await doctorService.getDoctors();
      setDoctors(data);
      setLoading(false);
    };
    fetchDoctors();
  }, []);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSortBy('name:asc');
    setSuggestions([]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      const filteredSuggestions = SPECIALIZATIONS.filter(spec =>
        spec.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (spec: string) => {
    setSearchTerm(spec);
    setSuggestions([]);
  };

  const processedDoctors = useMemo(() => {
    let results = doctors.filter(doctor => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    const [sortKey, sortOrder] = sortBy.split(':');

    results.sort((a, b) => {
      let valA, valB;
      if (sortKey === 'name') {
        valA = a.name;
        valB = b.name;
      } else if (sortKey === 'experience') {
        valA = a.experience;
        valB = b.experience;
      } else {
        return 0;
      }
      
      if (valA < valB) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (valA > valB) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return results;
  }, [doctors, searchTerm, sortBy]);
  
  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h1 className="text-3xl font-bold text-neutral-800 text-center">Find Your Specialist</h1>
            <p className="text-neutral-600 mt-2 text-center">Search for doctors by name or specialization.</p>
            <div className="mt-6 max-w-lg mx-auto relative">
                <input
                    type="text"
                    placeholder="E.g., 'Dr. Smith' or 'Cardiology'"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onBlur={() => setTimeout(() => setSuggestions([]), 150)} // Hide suggestions on blur
                    className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary transition"
                />
                {suggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-neutral-200 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
                        {suggestions.map(spec => (
                            <li 
                                key={spec} 
                                className="px-4 py-2 hover:bg-primary-light cursor-pointer"
                                onClick={() => handleSuggestionClick(spec)}
                            >
                                {spec}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
        
        <main>
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="w-full md:w-auto">
                        <p className="text-neutral-600 text-sm font-medium">
                        Showing <span className="font-bold text-primary">{processedDoctors.length}</span> of <span className="font-bold">{doctors.length}</span> doctors
                        </p>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="flex-grow">
                            <label htmlFor="sort-by" className="sr-only">Sort by</label>
                            <select
                                id="sort-by"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                            >
                                <option value="name:asc">Name (A-Z)</option>
                                <option value="name:desc">Name (Z-A)</option>
                                <option value="experience:desc">Experience (High-Low)</option>
                                <option value="experience:asc">Experience (Low-High)</option>
                            </select>
                        </div>
                        <button 
                            onClick={handleClearFilters}
                            className="p-2 text-neutral-500 hover:text-primary hover:bg-neutral-100 rounded-md transition-colors"
                            title="Clear all filters and search"
                        >
                            <XCircleIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                            <div className="flex items-start space-x-4">
                                <div className="w-24 h-24 rounded-full bg-neutral-200"></div>
                                <div className="flex-1 space-y-3">
                                    <div className="h-6 bg-neutral-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                                    <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="h-4 bg-neutral-200 rounded"></div>
                                <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
                            </div>
                             <div className="mt-6 h-10 bg-neutral-200 rounded"></div>
                        </div>
                    ))}
                </div>
            ) : processedDoctors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {processedDoctors.map(doctor => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-neutral-700">No Doctors Found</h3>
                    <p className="text-neutral-500 mt-2">Try adjusting your search criteria.</p>
                </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default Doctors;
