import React, { useState } from 'react';
import { Modal, Carousel, Card, Button, Row, Col, Typography, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

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
    <>
      <Card
        hoverable
        bordered
        style={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        cover={
          <img
            alt={room.name}
            src={room.imageurls[0]}
            style={{ height: '250px', objectFit: 'cover', borderRadius: '16px 16px 0 0' }}
          />
        }
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={16}>
            <Title level={4}>{room.name}</Title>
            <Text>📞 {room.phonenumber}</Text><br />
            <Text>👥 Max Count: {room.maxcount}</Text><br />
            <Text>🏷️ Type: <Tag color="blue">{room.type}</Tag></Text>
          </Col>

          <Col xs={24} sm={8} className="d-flex flex-column align-items-end justify-content-between">
            <div>
              <Button type="primary" className="m-1" onClick={handleBookNow}>
                Book Now
              </Button>
              <Button type="default" className="m-1" onClick={() => setShowModal(true)}>
                View Details
              </Button>
            </div>
          </Col>
        </Row>
      </Card>
      <Modal
  open={showModal}
  onCancel={() => setShowModal(false)}
  footer={null}
  centered
  width={800}
  title={<Title level={4}>{room.name}</Title>}
>
  <Carousel
    autoplay
    dots
    arrows
    draggable
    swipeToSlide
  >
    {room.imageurls.map((url, index) => (
      <div key={index}>
        <img
          src={url}
          alt={`Room image ${index + 1}`}
          style={{
            width: '100%',
            height: '400px',
            objectFit: 'cover',
            borderRadius: '8px',
            transition: 'transform 0.3s ease'
          }}
        />
      </div>
    ))}
  </Carousel>

  <div className="mt-3">
    <Text>{room.description}</Text>
  </div>
</Modal>

    </>
  );
}

export default Room;
