const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/my_database");

connect.then(() => {
    console.log("Database connected Successfuly");
})
.catch(() => {
    console.log("Database cannot be connected");
});

const LoginSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    password: {
        type:String,
        required: true
    }
});

const collection = new mongoose.model("users", LoginSchema);

module.exports = collection;