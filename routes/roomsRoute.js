const express = require("express");
const router = express.Router();
const Room = require("../models/rooms");

// ✅ Get all rooms
router.get("/getallrooms", async (req, res) => {
  try {
    const rooms = await Room.find({});
    console.log("✅ Fetched Rooms:", rooms.length); // Debug log
    res.status(200).json(rooms);
  } catch (error) {
    console.error("❌ Error Fetching Rooms:", error.message); // Improved logging
    res.status(500).json({ message: "Error fetching rooms", error: error.message });
  }
});

// ✅ Get room by ID
router.post("/getroombyid", async (req, res) => {
  const { roomid } = req.body;
  console.log("🔍 Searching for Room ID:", roomid);

  try {
    if (!roomid) {
      return res.status(400).json({ message: "Room ID is required" });
    }

    const room = await Room.findById(roomid);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    console.log("✅ Room Found:", room.name); // Debug log
    res.status(200).json(room);
  } catch (error) {
    console.error("❌ Error Fetching Room:", error.message);
    res.status(500).json({ message: "Error fetching room details", error: error.message });
  }
});

router.post('/addroom', async (req, res) => {

  try {
    const mernroom = new Room(req.body);
    await mernroom.save();
    res.send('Room Added Successfully');
  } catch (error) {
    return res.status(400).json({ error });
  }

})

module.exports = router;
