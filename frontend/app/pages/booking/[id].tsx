// pages/booking/[id].tsx
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { Booking } from '../../types/types';

interface Props {
  booking: Booking;
}

const BookingPage: React.FC<Props> = ({ booking }) => {
  return (
    <div className="relative min-h-screen bg-gray-100">
      <Link href="/" legacyBehavior>
        <p className="absolute top-4 cursor-pointer left-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Back to Home
        </p>
      </Link>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Booking Details</h1>
          <p className="text-lg mb-4">
            This Booking is with <strong>{booking.doctor_name}</strong> for <strong>{booking.service}</strong> and it ends on <strong>{booking.end_time}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const res = await fetch(`http://backend:5000/api/bookings/${id}`);
  const booking: Booking = await res.json();
  return { props: { booking } };
};

export default BookingPage;
