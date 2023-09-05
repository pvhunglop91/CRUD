var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1:27017/nodejs')
    .then(() => console.log("Connect success"))

const schema = new mongoose.Schema({
    name: String,
    address: String,
    point: Number
})

//Student => students (mongo)
const Student = mongoose.model('Student', schema)

Student.find().then((data) => {
    console.log(data)
})

// Student.create({
//     name: "Thuong",
//     address: "QN",
//     point: 8
// }, {
//     name: "Thuong1",
//     address: "QNam",
//     point: 9
// }).then(() => console.log("Add success"))

// Student.deleteOne({ name: "Thuong" }).then(() => console.log("Delete success"))

Student.updateOne({ name: "Thuong" }, { point: 10 }).then(() => console.log("Update success"))

