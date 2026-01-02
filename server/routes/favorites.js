const express = require("express");
const {
  addFavorite,
  removeFavorite,
  getFavorites
} = require("../controllers/favoriteController");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

router.post("/", authMiddleware, addFavorite);
router.get("/", authMiddleware, getFavorites);
router.delete("/:hotelId", authMiddleware, removeFavorite);

module.exports = router;
