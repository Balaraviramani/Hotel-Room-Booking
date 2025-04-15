import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import Error from '../components/Error';
import Swal from 'sweetalert2'; // ✅ Make sure it's 'Swal', not 'swal'

function Success() {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ This was missing

  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [booking, setBooking] = useState(null);


  useEffect(() => {
    if (!sessionId) return;

    let hasRun = false;

    const confirmBooking = async () => {
      if (hasRun) return;
      hasRun = true;

      try {
        const response = await axios.post('https://hotel-room-booking-1.onrender.com/api/bookings/confirm-booking', { session_id: sessionId });
        setBooking(response.data.booking);
        setLoading(false);

        Swal.fire({
          title: '🎉 Congratulations!',
          text: 'Your booking has been successfully completed.',
          icon: 'success',
          confirmButtonText: 'Okay'
        });
      } catch (err) {
        console.error("Error confirming booking:", err);
        setError(true);
        setLoading(false);
      }
    };

    confirmBooking();
  }, [sessionId]);

  if (loading) return <Loader />;
  if (error) return <Error />;

  return (
    <div className="m-5">
      <div className="bs">
        <h2>🎉 Booking Successful!</h2>
        <hr />
        <h4>Thank you for your booking, {booking.userid}</h4>
        <p><strong>Room:</strong> {booking.room}</p>
        <p><strong>From:</strong> {booking.fromdate}</p>
        <p><strong>To:</strong> {booking.todate}</p>
        <p><strong>Total Days:</strong> {booking.totaldays}</p>
        <p><strong>Total Amount:</strong> ₹{booking.totalamount}</p>
        <p><strong>Transaction ID:</strong> {booking.transactionId}</p>
  
        <button className="btn btn-primary mt-3" onClick={() => navigate('/home')}>
          ⬅️ Return to Home
        </button>
      </div>
    </div>
  );
}  

export default Success;
