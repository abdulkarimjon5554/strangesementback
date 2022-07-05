const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
