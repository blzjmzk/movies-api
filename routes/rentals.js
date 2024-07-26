const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

//crating new rental
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    console.error("Validation error:", error.details[0].message);
    return res.status(400).send(error.details[0].message);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let customer = await Customer.findById(req.body.customerId).session(
      session
    );
    if (!customer) {
      await session.abortTransaction();
      return res.status(400).send("Invalid customer.");
    }

    const movie = await Movie.findById(req.body.movieId).session(session);
    if (!movie) {
      await session.abortTransaction();
      return res.status(400).send("Invalid movie.");
    }

    if (movie.numberInStock === 0) {
      await session.abortTransaction();
      return res.status(400).send("Movie not in stock.");
    }

    let rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });

    await Movie.updateOne(
      { _id: movie._id },
      { $inc: { numberInStock: -1 } },
      { session }
    );

    await rental.save({ session });

    await session.commitTransaction();
    res.send(rental);
  } catch (ex) {
    console.error("Transaction failed:", ex);
    await session.abortTransaction();
    res.status(500).send("Something failed.");
  } finally {
    session.endSession();
  }
});

module.exports = router;
