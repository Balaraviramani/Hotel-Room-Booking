import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Rooms from '../components/Rooms';
import Loader from '../components/Loader';
import Error from '../components/Error';
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

function formatDate(date) {
  return date.toLocaleDateString('en-GB').split('/').join('-'); // DD-MM-YYYY
}

function parseDate(dateStr) {
  const [day, month, year] = dateStr.split('-');
  return new Date(`${year}-${month}-${day}`);
}

function Homescreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fromdate, setfromdate] = useState();
  const [todate, settodate] = useState();
  const [duplicaterooms, setduplicaterooms] = useState([]);
  const [searchkey, setsearchkey] = useState('');
  const [type, settype] = useState('all');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = (await axios.get('/api/rooms/getallrooms')).data;
        setRooms(data);
        setduplicaterooms(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        console.error(error);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  function filterByDate(dates) {
    const from = dates[0].toDate();
    const to = dates[1].toDate();

    setfromdate(formatDate(from));
    settodate(formatDate(to));

    const tempRooms = [];

    for (const room of duplicaterooms) {
      let isAvailable = true;

      for (const booking of room.currentbookings) {
        const bookingFrom = parseDate(booking.fromdate);
        const bookingTo = parseDate(booking.todate);

        // Check overlap
        if (
          from <= bookingTo &&
          to >= bookingFrom
        ) {
          isAvailable = false;
          break;
        }
      }

      if (isAvailable) {
        tempRooms.push(room);
      }
    }

    setRooms(tempRooms);
  }

  function filterBySearch() {
    const tempRooms = duplicaterooms.filter((room) =>
      room.name.toLowerCase().includes(searchkey.toLowerCase())
    );

    setRooms(tempRooms);
  }

  function filterByType(e) {
    settype(e);
    if (e !== 'all') {
      const tempRooms = duplicaterooms.filter(
        (room) => room.type.toLowerCase() === e.toLowerCase()
      );
      setRooms(tempRooms);
    } else {
      setRooms(duplicaterooms);
    }
  }
  

  return (
    <div className="container">
      <div className='row mt-5 bs'>
        <div className='col-md-3'>
          <RangePicker format='DD-MM-YYYY' onChange={filterByDate} />
        </div>
      

      <div className='col-md-5'>
        <input type='text' className='form-control' placeholder='search rooms' 
        value={searchkey} onChange={
          (e) => {
            setsearchkey(e.target.value)}} onKeyUp={filterBySearch}
        />
      </div>

      <div className='col-md-3'>
      <select className='form-control' value={type} onChange={(e) => {filterByType(e.target.value)}}> 
        <option value='all'>All</option>
        <option value='delux'>Delux</option>
        <option value='non-delux'>Non-Delux</option>
      </select>
      </div>
      
      </div>

      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader />
        ) : (
          rooms.map((room) => (
            <div className="col-md-9 mt-2" key={`${room._id}-${fromdate}-${todate}`}>
              <Rooms room={room} fromdate={fromdate} todate={todate} />
            </div>
          ))
        )  }
      </div>
    </div>
  );
}
                               

export default Homescreen;
