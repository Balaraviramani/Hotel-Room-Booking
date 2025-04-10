import React, { useEffect, useState } from 'react'
import { Tabs } from 'antd';
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';
import Swal from 'sweetalert2';

function Adminscreen() {

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
        if (!currentUser || !currentUser.isAdmin) {
            window.location.href = '/home';
        }
    }, []);
    
    return (
        <div className='mt-3 ml-3 mr-3 bs '>
            <h2 className='text-center' style={{ fontSize: '30px' }}><b>Admin</b></h2>
            <Tabs
                defaultActiveKey="1"
                items={[
                    { key: '1', label: 'Bookings', children: <Bookings /> },
                    { key: '2', label: 'Rooms', children: <Rooms /> },
                    { key: '3', label: 'Add Rooms', children: <AddRoom /> },
                    { key: '4', label: 'Users', children: <Users /> },
                ]}
            />
        </div>
    )
}

// Rooms List Component

export function Rooms() {
    const [rooms, setrooms] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const { data } = await axios.get('/api/rooms/getallrooms');
                setrooms(data);
                setloading(false);
            } catch (error) {
                console.log(error);
                setloading(false);
                seterror(error);
            }
        };

        fetchRooms();
    }, []);

    return (
        <div className='row'>
            <div className='col-md-12'>
                <h1>Rooms</h1>
                {loading && <Loader />}
                <table className='table table-bordered table-dark'>
                    <thead className='bs'>
                        <tr>
                            <th>Room Id</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Rent per day</th>
                            <th>Max Count </th>
                            <th>Phone Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.length > 0 && rooms.map(room => (
                            <tr key={room._id}>
                                <td>{room._id}</td>
                                <td>{room.name}</td>
                                <td>{room.type}</td>
                                <td>{room.rentperday}</td>
                                <td>{room.maxcount}</td>
                                <td>{room.phonenumber}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// Bookings List Component

export function Bookings() {
    const [bookings, setbookings] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await axios.get('/api/bookings/getallbookings');
                setbookings(data);
                setloading(false);
            } catch (error) {
                console.log(error);
                setloading(false);
                seterror(error);
            }
        };

        fetchBookings();
    }, []);

    return (
        <div className='row'>
            <div className='col-md-12'>
                <h1>Bookings</h1>
                {loading && <Loader />}
                <table className='table table-bordered table-dark'>
                    <thead className='bs'>
                        <tr>
                            <th>Booking Id</th>
                            <th>User Id</th>
                            <th>Room</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length > 0 && bookings.map(booking => (
                            <tr key={booking._id}>
                                <td>{booking._id}</td>
                                <td>{booking.userid}</td>
                                <td>{booking.room}</td>
                                <td>{booking.fromdate}</td>
                                <td>{booking.todate}</td>
                                <td>{booking.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// User List Component

export function Users() {
    const [users, setusers] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get('/api/users/getallusers');
                setusers(data);
                setloading(false);
            } catch (error) {
                console.log(error);
                setloading(false);
                seterror(error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className='row'>
            <div className='col-md-12'>
                <h1>Users</h1>
                {loading && <Loader />}
                <table className='table table-dark table-bordered'>
                    <thead>
                        <tr>
                            <th>User Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Is Admin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 && users.map(user => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// Add Room Component

export function AddRoom() {
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState();
    const [name, setname] = useState('');
    const [rentperday, setrentperday] = useState('');
    const [maxcount, setmaxcount] = useState('');
    const [description, setdescription] = useState('');
    const [phonenumber, setphonenumber] = useState('');
    const [type, settype] = useState('');
    const [imageurl1, setimageurl1] = useState('');
    const [imageurl2, setimageurl2] = useState('');
    const [imageurl3, setimageurl3] = useState('');

    async function addRoom() {
        const newroom = {
            name,
            rentperday,
            maxcount,
            description,
            phonenumber,
            type,
            imageurls: [imageurl1, imageurl2, imageurl3] // 👈 THIS is the key change
        };
    
        try {
            setloading(true);
            const result = await axios.post('/api/rooms/addroom', newroom);
            console.log(result.data);
            setloading(false);
            Swal.fire('Success', 'Room added successfully', 'success').then(() => {
                window.location.href = '/home'; 
              });
              
        } catch (error) {
            console.log(error);
            setloading(false);
            Swal.fire('Error', 'Failed to add room', 'error');
        }
    }
    
    return (
        <div className='row'>
            <div className='col-md-5'>
           
            <h1> Add Room</h1>
            {loading && <Loader />}  
            
                <input type='text' className='form-control' placeholder='Room Name'
                    value={name} onChange={(e) => { setname(e.target.value) }} />
                <input type='text' className='form-control' placeholder='rent per day'
                    value={rentperday} onChange={(e) => (setrentperday(e.target.value))} />
                <input type='text' className='form-control' placeholder='max count'
                    value={maxcount} onChange={(e) => (setmaxcount(e.target.value))} />
                <input type='text' className='form-control' placeholder='description'
                    value={description} onChange={(e) => (setdescription(e.target.value))} />
                <input type='text' className='form-control' placeholder='phone number'
                    value={phonenumber} onChange={(e) => (setphonenumber(e.target.value))} />
            </div>
            <div>
                <input type='text' className='form-control' placeholder='type'
                    value={type} onChange={(e) => { settype(e.target.value) }} />
                <input type='text' className='form-control' placeholder='image URL 1'
                    value={imageurl1} onChange={(e) => { setimageurl1(e.target.value) }} />
                <input type='text' className='form-control' placeholder='image URL 2'
                    value={imageurl2} onChange={(e) => { setimageurl2(e.target.value) }} />
                <input type='text' className='form-control' placeholder='image URL 3'
                    value={imageurl3} onChange={(e) => { setimageurl3(e.target.value) }} />

                <button className='btn btn-primary mt-3' onClick={addRoom}>Add Room</button>
            </div>
        </div>
    )
}

export default Adminscreen;
