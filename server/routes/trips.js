const express = require("express");
const Trip = require("../models/Trip");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();


// ========================================
// UPLOAD TRIP PHOTO
// POST /api/trips/:id/upload
// ========================================

// ========================================
// UPLOAD TRIP PHOTO
// POST /api/trips/:id/upload
// ========================================

router.post(
  "/:id/upload",

  authMiddleware,

  // Handle Multer / Cloudinary errors
  (req, res, next) => {
    upload.single("image")(req, res, (error) => {

      if (error) {
        console.error(
          "================================"
        );

        console.error(
          "MULTER / CLOUDINARY ERROR:"
        );

        console.error(error);

        console.error(
          "ERROR MESSAGE:",
          error.message
        );

        console.error(
          "ERROR NAME:",
          error.name
        );

        console.error(
          "================================"
        );

        return res.status(500).json({
          message: "Image upload middleware failed",
          error:
            error.message ||
            JSON.stringify(error),
        });
      }

      next();
    });
  },

  // ======================================
  // ACTUAL UPLOAD ROUTE
  // ======================================

  async (req, res) => {

    try {

      console.log(
        "================================"
      );

      console.log(
        "UPLOAD ROUTE HIT"
      );

      console.log(
        "Trip ID:",
        req.params.id
      );

      console.log(
        "File:",
        req.file
      );

      console.log(
        "User ID:",
        req.userId
      );

      console.log(
        "================================"
      );


      // Find trip belonging to user
      const trip = await Trip.findOne({
        _id: req.params.id,
        user: req.userId,
      });


      if (!trip) {
        return res.status(404).json({
          message: "Trip not found",
        });
      }


      // Check file
      if (!req.file) {
        return res.status(400).json({
          message: "Please upload an image",
        });
      }


      // Cloudinary URL
      const imageUrl = req.file.path;


      // Add image
      trip.photos.push(imageUrl);


      // First image becomes cover
      if (!trip.coverImage) {
        trip.coverImage = imageUrl;
      }


      await trip.save();


      return res.status(200).json({
        message:
          "Photo uploaded successfully",

        imageUrl,

        trip,
      });

    } catch (error) {

      console.error(
        "PHOTO UPLOAD ERROR:",
        error
      );

      return res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  }
);


// ========================================
// CREATE TRIP
// POST /api/trips
// ========================================

router.post(
  "/",
  authMiddleware,

  async (req, res) => {
    try {

      const {
        title,
        destination,
        startDate,
        endDate,
        description,
        rating,
      } = req.body;


      // Required fields
      if (!title || !destination) {
        return res.status(400).json({
          message:
            "Title and destination are required",
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

        // Week 3
        coverImage: "",
        photos: [],
      });


      return res.status(201).json({
        message:
          "Trip created successfully",

        trip: trip,
      });

    } catch (error) {

      console.error(
        "Create trip error:",
        error
      );

      return res.status(500).json({
        message: "Server error",
      });
    }
  }
);


// ========================================
// GET ALL USER TRIPS
// GET /api/trips
// ========================================

router.get(
  "/",
  authMiddleware,

  async (req, res) => {
    try {

      const trips = await Trip.find({
        user: req.userId,
      }).sort({
        createdAt: -1,
      });


      return res.json({
        trips: trips,
      });

    } catch (error) {

      console.error(
        "Get trips error:",
        error
      );

      return res.status(500).json({
        message: "Server error",
      });
    }
  }
);


// ========================================
// GET SINGLE TRIP
// GET /api/trips/:id
// ========================================

router.get(
  "/:id",
  authMiddleware,

  async (req, res) => {
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


      return res.json({
        trip: trip,
      });

    } catch (error) {

      console.error(
        "Get trip error:",
        error
      );

      return res.status(500).json({
        message: "Server error",
      });
    }
  }
);


// ========================================
// UPDATE TRIP
// PUT /api/trips/:id
// ========================================

router.put(
  "/:id",
  authMiddleware,

  async (req, res) => {
    try {

      const {
        title,
        destination,
        startDate,
        endDate,
        description,
        rating,
      } = req.body;


      // Find trip + check ownership
      const trip = await Trip.findOne({
        _id: req.params.id,
        user: req.userId,
      });


      if (!trip) {
        return res.status(404).json({
          message: "Trip not found",
        });
      }


      // Update fields
      trip.title =
        title ?? trip.title;

      trip.destination =
        destination ?? trip.destination;

      trip.startDate =
        startDate ?? trip.startDate;

      trip.endDate =
        endDate ?? trip.endDate;

      trip.description =
        description ?? trip.description;

      trip.rating =
        rating ?? trip.rating;


      await trip.save();


      return res.json({
        message:
          "Trip updated successfully",

        trip: trip,
      });

    } catch (error) {

      console.error(
        "Update trip error:",
        error
      );

      return res.status(500).json({
        message: "Server error",
      });
    }
  }
);


// ========================================
// DELETE TRIP
// DELETE /api/trips/:id
// ========================================

router.delete(
  "/:id",
  authMiddleware,

  async (req, res) => {
    try {

      // Check ownership
      const trip = await Trip.findOne({
        _id: req.params.id,
        user: req.userId,
      });


      if (!trip) {
        return res.status(404).json({
          message: "Trip not found",
        });
      }


      await Trip.deleteOne({
        _id: req.params.id,
        user: req.userId,
      });


      return res.json({
        message:
          "Trip deleted successfully",
      });

    } catch (error) {

      console.error(
        "Delete trip error:",
        error
      );

      return res.status(500).json({
        message: "Server error",
      });
    }
  }
);


module.exports = router;