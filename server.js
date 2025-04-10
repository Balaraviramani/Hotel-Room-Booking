const express = require("express");
const cors = require("cors");  
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const app = express();

const dbConfig = require("./db");
const roomsRoute = require("./routes/roomsRoute");
const usersRoute = require("./routes/usersRoute");
const bookingsRoute = require('./routes/bookingsRoute')

app.use(express.json());
app.use(cors()); 
app.use("/api/rooms", roomsRoute);
app.use("/api/users" , usersRoute);
app.use("/api/bookings" , bookingsRoute)

app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
