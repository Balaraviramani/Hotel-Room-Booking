import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';
import { useParams, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

function Bookingscreen() {
  const { roomid } = useParams();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const fromdate = queryParams.get('fromdate');
  const todate = queryParams.get('todate');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [room, setRoom] = useState(null);

  const fromDateObj = new Date(fromdate.split('-').reverse().join('-'));
  const toDateObj = new Date(todate.split('-').reverse().join('-'));
  const totalDays = Math.ceil((toDateObj - fromDateObj) / (1000 * 60 * 60 * 24)) + 1;

  useEffect(() => {
    
    if(!localStorage.getItem('currentUser')) {
      window.location.href = '/login';
    }

    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.post('https://hotel-room-booking-1.onrender.com/api/rooms/getroombyid', { roomid });
        setRoom(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching room details:", err);
        setLoading(false);
        setError(true);
        Swal.fire('Error', 'Failed to fetch room details', 'error');
      }
    };

    fetchRoomDetails();
  }, [roomid]);

  if (loading) return <Loader />;
  if (error || !room) return <Error />;

  function formatDate(dateObj) {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  }

  async function proceedToBook() {
    const bookingDetails = {
      room,
      userid: JSON.parse(localStorage.getItem('currentUser'))._id,
      fromdate,
      todate,
      totalamount: room.rentperday * totalDays,
      totaldays: totalDays,
    };

    try {
      const res = await axios.post('https://hotel-room-booking-1.onrender.com/api/bookings/bookroom', bookingDetails);
      const sessionId = res.data.sessionId;

      const stripe = window.Stripe("pk_test_51Qyoj2GLsfv5VgOEMX14htOVSOnWxQvFFOaohkPaLYLyZuxZRh6CvLVFSayfFdPrsIS4C5kTGdAkmMFHye1XJ7Ka00eDvpBAja");
      console.log('window.Stripe:', window.Stripe);
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error("Error creating Stripe session:", err);
      Swal.fire("Payment Error", "Booking failed. Please try again.", "error");
    }
  }

  return (
    <div className='m-5'>
      <div className="row justify-content-center mt-5 bs">
        <div className="col-md-6">
          <h1>{room.name}</h1>
          <img src={room.imageurls[0]} className="bigimg" alt={room.name} />
        </div>

        <div className="col-md-6">
          <div style={{ textAlign: 'right' }}>
            <h1>Booking Details</h1>
            <hr />
            <b>
              <p>Name : {JSON.parse(localStorage.getItem('currentUser')).name}</p>
              <p>From date : {formatDate(fromDateObj)}</p>
              <p>To date : {formatDate(toDateObj)}</p>
              <p>Max Count: {room.maxcount}</p>
            </b>
          </div>

          <div style={{ textAlign: 'right' }}>
            <b>
              <h1>Amount</h1>
              <hr />
              <p>Total Days : {totalDays}</p>
              <p>Rent per day : ₹{room.rentperday}</p>
              <p>Total Amount : ₹{room.rentperday * totalDays}</p>
            </b>
          </div>

          <div style={{ float: 'right' }}>
            <button className="btn btn-primary" onClick={proceedToBook}>
              Proceed to Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bookingscreen;