import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import "../src/app/globals.css";
import Link from 'next/link';
import axios from 'axios';
import { Booking } from '../types/types';

interface Props {
  bookings: Booking[];
}

const HomePage: React.FC<Props> = ({ bookings }) => {
  const [formData, setFormData] = useState({
    service: '',
    doctor_name: '',
    start_time: '',
    end_time: '',
    date: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('http://localhost:5000/api/bookings', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        setSuccess('Booking created successfully!');
        router.replace(router.asPath); // Refresh the page to show the new booking
      } else {
        setError(response.data.message || 'Error inserting booking');
      }
    } catch (error) {
      console.error(error); // Log the error to the console
      setError(error.response?.data?.message || 'Network error');
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-pink-300 flex flex-col md:flex-row md:space-x-20 justify-center items-center py-8">
      
      {/* New Booking Form */}
      <div className="w-full max-w-md mb-12">
        <h1 className="text-4xl font-bold mb-8 text-center text-pink-700">Book an appointment</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
          <div className="flex items-center space-x-2">
            <label className="block text-gray-700 font-semibold flex-grow">
              <span className="text-pink-700">Service:</span>
              <input
                type="text"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
              />
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <label className="block text-gray-700 font-semibold flex-grow">
              <span className="text-pink-700">Doctor Name:</span>
              <input
                type="text"
                name="doctor_name"
                value={formData.doctor_name}
                onChange={handleChange}
                required
                className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
              />
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <label className="block text-gray-700 font-semibold flex-grow">
              <span className="text-pink-700">Start Time:</span>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
                className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
              />
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <label className="block text-gray-700 font-semibold flex-grow">
              <span className="text-pink-700">End Time:</span>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
                className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
              />
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <label className="block text-gray-700 font-semibold flex-grow">
              <span className="text-pink-700">Date:</span>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500"
              />
            </label>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 text-white font-bold py-2 px-4 rounded-lg w-full transition-transform transform hover:scale-105"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Bookings List */}
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mt-12 mb-6 text-center text-pink-700">Bookings</h1>
        <ul className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => (
            <li 
              key={booking.id} 
              className="bg-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg duration-300"
            >
              <Link href={`/booking/${booking.id}`} className="text-pink-600 hover:text-pink-800">
                <div className="text-lg font-semibold mb-2">{booking.service}</div>
                <div className="text-md mb-2">Doctor: {booking.doctor_name}</div>
                <div className="text-sm text-gray-500">Date: {formatDate(booking.date)}</div>
                <div className="text-sm text-gray-500">Time: {booking.start_time} - {booking.end_time}</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await fetch('http://backend:5000/api/bookings');
    if (!res.ok) {
      throw new Error('Failed to fetch bookings');
    }
    const bookings: Booking[] = await res.json();
    return { props: { bookings } };
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return { props: { bookings: [] } }; // Return an empty array in case of error
  }
};

export default HomePage;
