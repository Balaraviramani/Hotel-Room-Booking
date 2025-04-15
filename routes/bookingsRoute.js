const express = require("express");
const router = express.Router();
const stripe = require("stripe")("sk_test_51Qyoj2GLsfv5VgOEH2Wv2YJoYAVzD7VgMIZgMKIIRRoiB4PBaczKgjAnNL0YvLkgzYqSVl8ycrqxj4myrTEogHGv00F9YxAX10"); // Replace with your real secret key

const Booking = require("../models/booking");
const Room = require("../models/rooms");


// Create Stripe session and return sessionId
router.post("/bookroom", async (req, res) => {
  const { room, fromdate, todate, totaldays, totalamount, userid } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: room.name,
            },
            unit_amount: totalamount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://hotel-room-booking-iqmv.vercel.app/success?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        roomid: room._id,
        userid,
        fromdate,
        todate,
        totaldays,
      },
    });

    res.send({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe session error:", error);
    res.status(500).json({ error: "Failed to create Stripe session" });
  }
});


// Confirm booking after successful payment
router.post("/confirm-booking", async (req, res) => {
  const { session_id } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const {
      roomid,
      fromdate,
      todate,
      totaldays,
      userid,
    } = session.metadata;

    const totalamount = session.amount_total / 100;
    const transactionId = session.payment_intent;

    // Prevent duplicate booking
    const existingBooking = await Booking.findOne({ transactionId });
    if (existingBooking) {
      return res.send({ success: true, booking: existingBooking });
    }

    const room = await Room.findById(roomid);
    if (!room) return res.status(404).json({ error: "Room not found" });

    // Create and save new booking
    const newBooking = new Booking({
      room: room.name,
      roomid,
      userid,
      fromdate,
      todate,
      totaldays,
      totalamount,
      transactionId,
    });

    const booking = await newBooking.save();

    // Update room's currentbookings
    room.currentbookings.push({
      bookingid: booking._id,
      fromdate,
      todate,
      userid,
      status: 'booked',
    });

    await room.save();

    res.send({ success: true, booking });

  } catch (error) {
    console.error("Booking confirmation failed:", error);
    res.status(500).json({ message: "Booking confirmation failed" });
  }
});


// Get bookings by user ID
router.post("/getbookingsbyuserid", async (req, res) => {
  const { userid } = req.body;

  try {
    const bookings = await Booking.find({ userid });
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ error });
  }
});


// Get all bookings (admin)
router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ error });
  }
});


// Cancel a booking
router.post('/cancelbooking', async (req, res) => {
  const { bookingid, roomid } = req.body;

  try {
    // Find and update booking status
    const booking = await Booking.findById(bookingid);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Remove the booking from room's currentbookings
    const room = await Room.findById(roomid);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    room.currentbookings = room.currentbookings.filter(
      (b) => b.bookingid.toString() !== bookingid
    );

    await room.save();

    res.send({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Cancel booking failed:", error);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
});

module.exports = router;