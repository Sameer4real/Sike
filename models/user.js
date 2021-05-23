const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordCheck: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Users = mongoose.model("user", userSchema);
module.exports = Users;
