import React, { useState } from 'react';
import { Modal, Carousel } from 'antd';
import { useNavigate } from 'react-router-dom';

function Room({ room, fromdate, todate }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleBookNow = () => {
    if (!fromdate || !todate) {
      alert("Please select a date range first.");
      return;
    }
    navigate(`/book/${room._id}?fromdate=${fromdate}&todate=${todate}`);
  };

  return (
    <div className="row bs">
      <div className="col-md-4">
        <img src={room.imageurls[0]} className="smallimg" alt={room.name} />
      </div>

      <div className="col-md-7">
        <h1>{room.name}</h1>
        <p>Max Count : {room.maxcount}</p>
        <p>Phone Number : {room.phonenumber}</p>
        <p>Type : {room.type}</p>
        <div style={{ float: 'right' }}>
          <button className="btn btn-primary m-2" onClick={handleBookNow}>Book Now</button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>View Details</button>
        </div>
      </div>

      {/* Modal for View Details */}
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        title={room.name}
        width={800}
      >
        <Carousel autoplay dots arrows>
          {room.imageurls.map((url, index) => (
            <div key={index}>
              <img src={url} className="bigimg" alt={`Slide ${index + 1}`} />
            </div>
          ))}
        </Carousel>
        <div className="mt-3">
          <p>{room.description}</p>
        </div>
      </Modal>
    </div>
  );
}

export default Room;
