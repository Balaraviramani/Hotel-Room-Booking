const mongoose = require("mongoose");

const mongoURL =
  "mongodb+srv://lama:lama@cluster0.za63g.mongodb.net/mern-rooms?retryWrites=true&w=majority&appName=Cluster0";


mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const connection = mongoose.connection;

connection.on("error", (err) => {
  console.log(" MongoDB Connection Failed:", err.message);
});

connection.on("connected", () => {
  console.log("MongoDB Connected Successfully");
});

module.exports = mongoose;
