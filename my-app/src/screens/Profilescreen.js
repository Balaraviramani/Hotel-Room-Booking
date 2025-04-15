import React, { useEffect, useState } from 'react';
import { Tabs, message, Tag } from 'antd';
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';  // <-- Using useNavigate for better routing

const { TabPane } = Tabs;

function MyBookings() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        const response = await axios.post('/api/bookings/getbookingsbyuserid', {
          userid: user._id,
        });
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(true);
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  async function cancelBooking(bookingid, roomid) {
    try {
      setLoading(true);
      await axios.post('/api/bookings/cancelbooking', {
        bookingid,
        roomid,
      });

      Swal.fire('Congrats', 'Your booking has been cancelled', 'success');

      // Update bookings state to remove canceled booking without reloading the page
      setBookings(prevBookings => prevBookings.filter(booking => booking._id !== bookingid));

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      Swal.fire('Oops', 'Something went wrong!', 'error');
    }
  }

  return (
    <div className='row'>
      <div className='col-md-6'>
        {loading && <Loader />}
        {error && <Error />}
        {bookings.map((booking) => (
          <div className='bs' key={booking._id}>
            <h1>{booking.room}</h1>
            <p><b>Booking ID:</b> {booking._id}</p>
            <p><b>Check In:</b> {booking.fromdate}</p>
            <p><b>Check Out:</b> {booking.todate}</p>
            <p><b>Amount:</b> ₹{booking.totalamount}</p>
            <p><b>Status:</b> {booking.status === 'cancelled' ? (
              <Tag color="red">CANCELLED</Tag>
            ) : (
              <Tag color="green">CONFIRMED</Tag>
            )}</p>

            {booking.status === 'booked' && (
              <div className='text-right'>
                <button
                  className='btn btn-primary'
                  onClick={() => cancelBooking(booking._id, booking.roomid)}
                  disabled={loading}
                >
                  CANCEL BOOKING
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Profilescreen() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const navigate = useNavigate();  // <-- useNavigate for redirect

  useEffect(() => {
    if (!user) {
      navigate('/login');  // <-- Redirect to login if no user is found
    }
  }, [user, navigate]);

  return (
    <div className='ml-3 mt-3'>
      <Tabs defaultActiveKey='1'>
        <TabPane tab='Profile' key='1'>
          <p>My Profile</p>
          <br />
          <p>Name : {user.name}</p>
          <p>Email : {user.email}</p>
          <p>isAdmin : {user.isAdmin ? 'YES' : 'NO'}</p>
        </TabPane>

        <TabPane tab='Bookings' key='2'>
          <MyBookings />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Profilescreen;
