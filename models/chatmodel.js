const mongoose = require("mongoose");

// mongoose.connect(`mongodb+srv://nikhilssharma2409:83a62qLgo3MeHE50@cluster0.ou5pr.mongodb.net/`)



const chatSchema = mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    message:{
     type: String,
     required: true
    }



},
    { timestamps: true });
module.exports = mongoose.model("chat", userSchema);