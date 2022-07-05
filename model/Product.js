const mongoose = require("mongoose");
const ProductSchema = mongoose.Schema({
  name: { type: Object, required: true },
  image: [
    {
      type: Object,
      required: true,
    },
  ],
  fulltext: { type: Object, required: true },
  price: {
    type: Number,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Product", ProductSchema);
