const mongoose = require("mongoose");

const requestSchema = mongoose.Schema(
  {
    request_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    occupation: { type: String, required: true },
    current_status: { type: String, required: true },
    financial_goal: { type: String, required: true },
    Image: { type: String }, // Store image path
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
