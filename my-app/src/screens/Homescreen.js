import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Rooms from '../components/Rooms';
import Loader from '../components/Loader';
import Error from '../components/Error';
import { DatePicker, Input, Select, Row, Col, Typography } from 'antd';
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title } = Typography;

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
        const data = (await axios.get('https://hotel-room-booking-1.onrender.com/api/rooms/getallrooms')).data;
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

        if (from <= bookingTo && to >= bookingFrom) {
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

  function filterBySearch(e) {
    const keyword = e.target.value;
    setsearchkey(keyword);

    const tempRooms = duplicaterooms.filter((room) =>
      room.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setRooms(tempRooms);
  }

  function filterByType(value) {
    settype(value);

    if (value !== 'all') {
      const tempRooms = duplicaterooms.filter(
        (room) => room.type.toLowerCase() === value.toLowerCase()
      );
      setRooms(tempRooms);
    } else {
      setRooms(duplicaterooms);
    }
  }

  return (
    <div className="container mt-5">
      <Title level={3} className="text-center mb-4">Search Rooms</Title>

      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} md={6}>
          <RangePicker format="DD-MM-YYYY" onChange={filterByDate} className="w-100" />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Input
            placeholder="Search rooms"
            value={searchkey}
            onChange={filterBySearch}
            className="w-100"
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Select
            value={type}
            onChange={filterByType}
            className="w-100"
          >
            <Option value="all">All</Option>
            <Option value="delux">Delux</Option>
            <Option value="non-delux">Non-Delux</Option>
          </Select>
        </Col>
      </Row>

      <div className="row justify-content-center mt-4">
        {loading ? (
          <Loader />
        ) : error ? (
          <Error />
        ) : (
          rooms.map((room) => (
            <div className="col-md-9 mt-3" key={`${room._id}-${fromdate}-${todate}`}>
              <Rooms room={room} fromdate={fromdate} todate={todate} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Homescreen;
