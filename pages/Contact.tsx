
import React from 'react';

const Contact: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you shortly.');
    // In a real app, you would handle form submission here
    e.currentTarget.reset();
  };

  return (
    <div className="bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-neutral-900">Get in Touch</h1>
            <p className="mt-3 text-lg text-neutral-600">
              We'd love to hear from you! Please fill out the form below.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-10">
            <div className="grid grid-cols-1 gap-y-6">
              <div>
                <label htmlFor="full-name" className="block text-sm font-medium text-neutral-700">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="full-name"
                    id="full-name"
                    autoComplete="name"
                    required
                    className="block w-full rounded-md border-neutral-300 py-3 px-4 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-neutral-300 py-3 px-4 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-700">
                  Message
                </label>
                <div className="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="block w-full rounded-md border-neutral-300 py-3 px-4 shadow-sm focus:border-primary focus:ring-primary"
                    defaultValue={''}
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full justify-center rounded-md border border-transparent bg-primary py-3 px-6 text-base font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Send Message
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
