
import React from 'react';
import { StethoscopeIcon } from '../components/Icons';

const About: React.FC = () => {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-base font-semibold text-primary">Our Mission</p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
              Simplifying Healthcare Access for Everyone
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-neutral-600">
              At DocBook, we believe that accessing quality healthcare should be simple, transparent, and convenient. Our mission is to connect patients with trusted doctors and empower them to manage their health journey with ease.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-8">
              <div className="flex flex-col gap-y-8">
                <div className="flex gap-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
                      <StethoscopeIcon className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold leading-7 text-neutral-900">Patient-Centric Approach</h3>
                    <p className="mt-2 text-base leading-7 text-neutral-600">
                      We've designed our platform from the ground up with you in mind. From finding the right specialist to booking an appointment in seconds, every feature is built to make your experience seamless.
                    </p>
                  </div>
                </div>

                <div className="flex gap-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
                      <StethoscopeIcon className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold leading-7 text-neutral-900">Trusted Network of Doctors</h3>
                    <p className="mt-2 text-base leading-7 text-neutral-600">
                      We partner with a diverse network of highly-qualified and verified medical professionals across various specializations to ensure you receive the best possible care.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src="https://picsum.photos/seed/about/600/800"
                  alt="Team working"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
