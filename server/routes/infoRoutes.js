// routes/infoRoutes.js
const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

// Database configuration
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "12345",
  port: 5432,
});

// Create a new info entry
router.post("/infoadd", async (req, res) => {
  try {
    const { name, email } = req.body;
    const query = "INSERT INTO info (name, email) VALUES ($1, $2) RETURNING *";
    const values = [name, email];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating info entry:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
});

// Get all info entries
router.get("/info", async (req, res) => {
  try {
    const query = "SELECT * FROM info";
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching info entries:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
});

// Remove an info entry by ID
router.delete("/info/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = "DELETE FROM info WHERE id = $1";

    const result = await pool.query(query, [id]);
    res.json({ message: "Info entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting info entry:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
});

// update the data by ID
router.put("/info/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const query =
      "UPDATE info SET name = $1, email = $2 WHERE id = $3 RETURNING *";
    const values = [name, email, id];
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Info entry not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating info entry:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
});

module.exports = router;
