// routes/bookingRoute.js
const express = require("express");
const router = express.Router();
const stripe = require("stripe")("sk_test_51Qyoj2GLsfv5VgOEH2Wv2YJoYAVzD7VgMIZgMKIIRRoiB4PBaczKgjAnNL0YvLkgzYqSVl8ycrqxj4myrTEogHGv00F9YxAX10"); // Replace with your real secret key
const Booking = require("../models/booking");
const Room = require("../models/rooms");

 

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
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/cancel`,
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

router.post("/confirm-booking", async (req, res) => {
  const { session_id } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const { roomid, fromdate, todate, totaldays, userid } = session.metadata;
    const totalamount = session.amount_total / 100;
    const transactionId = session.payment_intent;

    // ✅ Prevent duplicate booking
    const existingBooking = await Booking.findOne({ transactionId });
    if (existingBooking) {
      return res.send({ success: true, booking: existingBooking });
    }

    const room = await Room.findById(roomid);

    // Create and save booking
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
    console.error("Booking confirmation error:", error);
    res.status(500).json({ error: "Booking confirmation failed" });
  }
});


router.post("/getbookingsbyuserid", async (req, res) => {
  const  userid  = req.body.userid;

  try {
    const bookings = await Booking.find({ userid : userid});

    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ error });
  }
});



router.post('/confirm-booking', async (req, res) => {
  const { session_id } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    const customer_email = session.customer_email;
    const metadata = session.metadata;

    const existingBooking = await Booking.findOne({ transactionId: session.payment_intent });

    if (existingBooking) {
      return res.json({ booking: existingBooking });
    }

    const newBooking = new Booking({
      room: metadata.room,
      roomid: metadata.roomid,
      userid: metadata.userid,
      fromdate: metadata.fromdate,
      todate: metadata.todate,
      totalamount: session.amount_total / 100,
      totaldays: metadata.totaldays,
      transactionId: session.payment_intent,
    });

    const savedBooking = await newBooking.save();

    res.status(200).json({ booking: savedBooking });

  } catch (error) {
    console.error('Booking confirmation failed:', error);
    res.status(500).json({ message: 'Booking confirmation failed' });
  }
});

router.get('/getallbookings', async(req, res) =>{
    try {
      const bookings =await Booking.find()
      res.send(bookings)
    } catch (error) {
      return res.status(400).json({ error});
    }
});


module.exports = router;
