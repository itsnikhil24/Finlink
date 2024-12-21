const mongoose = require("mongoose");

mongoose.connect(`mongodb+srv://nikhilssharma2409:83a62qLgo3MeHE50@cluster0.ou5pr.mongodb.net/`)



const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_number: { type: String, required: true }, // Change this to String
    Image: { type: String },
    is_on: { type: String, default: "0" },
    occupation:{type:String},
    current_status:{type:String},
    Financial_goal:{type:String}

},
    { timestamps: true });
module.exports = mongoose.model("user", userSchema);