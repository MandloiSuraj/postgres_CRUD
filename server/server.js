const express = require("express");
const { Pool } = require("pg");
const infoRoutes = require("./routes/infoRoutes");
const app = express();
const PORT = 4000;
const cors = require("cors");

app.use(cors());

// Database configuration
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres", // Specify the correct database name
  password: "12345",
  port: 5432,
});


// Middleware to parse JSON bodies
app.use(express.json());

app.use("/api", infoRoutes);

// Connect to database
pool
  .connect()
  .then(() => console.log("Database connected"))
  .catch((error) => console.error("Error connecting to database:", error));



// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
