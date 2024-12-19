const mongoose =require("mongoose");

mongoose.connect(`mongodb+srv://nikhilssharma2409:83a62qLgo3MeHE50@cluster0.ou5pr.mongodb.net/`)



const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_number: { type: String, required: true }, // Change this to String
  
});
module.exports=mongoose.model("user",userSchema);