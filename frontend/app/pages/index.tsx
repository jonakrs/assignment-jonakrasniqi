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
    // Handle invalid date
    return 'Invalid Date';
  }
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};


  return (
    <div className="min-h-screen bg-gray-100 flex flex-row space-x-20 justify-center items-center py-8">
      <div className="w-full max-w-md mb-12">
        <h1 className="text-3xl font-bold mb-8 text-center">New Booking</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Service:
              <input
                type="text"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Doctor Name:
              <input
                type="text"
                name="doctor_name"
                value={formData.doctor_name}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Start Time:
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              End Time:
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Date:
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </label>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Submit
          </button>
        </form>
      </div>

      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mt-12 mb-6 text-center">Bookings</h1>
        <ul className="bg-white p-6 rounded-lg shadow-md space-y-4">
          {bookings.map((booking) => (
            <li key={booking.id} className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
              <Link href={`/booking/${booking.id}`} className="text-blue-500 hover:underline">

                  <div>
                    <strong>Service:</strong> {booking.service}
                  </div>
                  <div>
                    <strong>Doctor:</strong> {booking.doctor_name}
                  </div>
                  <div>
                    <strong>Date:</strong> {formatDate(booking.date)}
                  </div>
                  <div>
                    <strong>Time:</strong> {booking.start_time} - {booking.end_time}
                  </div>

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
