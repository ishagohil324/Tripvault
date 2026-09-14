const express = require("express");

const Trip = require("../models/Trip");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// CREATE TRIP
// POST /api/trips
// ========================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      destination,
      startDate,
      endDate,
      description,
      rating,
    } = req.body;

    // Check required fields
    if (!title || !destination) {
      return res.status(400).json({
        message: "Title and destination are required",
      });
    }

    // Create trip
    const trip = await Trip.create({
      title,
      destination,
      startDate,
      endDate,
      description,
      rating,
      user: req.userId,
    });

    res.status(201).json({
      message: "Trip created successfully",
      trip,
    });

  } catch (error) {
    console.error("Create trip error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const trips = await Trip.find({
      user: req.userId,
    }).sort({
      createdAt: -1,
    });

    res.json({
      trips,
    });

  } catch (error) {
    console.error("Get trips error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    res.json({
      trip,
    });

  } catch (error) {
    console.error("Get trip error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      destination,
      startDate,
      endDate,
      description,
      rating,
    } = req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    // Check ownership
    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    // Update fields
    trip.title = title ?? trip.title;
    trip.destination = destination ?? trip.destination;
    trip.startDate = startDate ?? trip.startDate;
    trip.endDate = endDate ?? trip.endDate;
    trip.description = description ?? trip.description;
    trip.rating = rating ?? trip.rating;

    await trip.save();

    res.json({
      message: "Trip updated successfully",
      trip,
    });

  } catch (error) {
    console.error("Update trip error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


router.delete("/:id", authMiddleware, async (req, res) => {
  try {

    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    // Check ownership
    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    await Trip.deleteOne({
      _id: req.params.id,
      user: req.userId,
    });

    res.json({
      message: "Trip deleted successfully",
    });

  } catch (error) {
    console.error("Delete trip error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;