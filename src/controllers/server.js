var http = require("http");
var fs = require("fs");
var qs = require("qs");
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


var server = http.createServer(function (req, res) {
      // const data = fs.readFileSync("../views/home.html",'utf-8')
      // res.write(data);
      // return res.end();
      // vd   /student/1 => ["",students,1]
      // /delete/12121 => ["","delete", 12121]
      const url = req.url.split("/")[1];
      let data;
      switch (url) {
            case "students":
                  displayList(req, res);
                  break;
            case "create":
                  data = fs.readFileSync("../views/create.html");
                  res.write(data);
                  return res.end();

            case "createStudent":
                  let dataStudent = '';
                  req.on('data', function (chunk) {
                        dataStudent += chunk;
                  });
                  req.on('end', () => {
                        let student = qs.parse(dataStudent)
                        student.point = parseFloat(student.point);
                        Student.create(student).then(() => {
                              displayList(req, res)
                        })

                  })
                  break;
            case "delete":
                  deleteStudent(req, res)
                  break;

            case "edit":
                  editStudent(req, res)
                  break;
            default:
                  data = fs.readFileSync("../views/home.html", 'utf-8')
                  res.write(data);
                  return res.end();
      }

})

server.listen(3000, () => {
      console.log("server đang chạy");
})

let deleteStudent = function (req, res) {
      const idStudent = req.url.split("/")[2];
      Student.deleteOne({ _id: idStudent }).then(() => {
            displayList(req, res);
      })
}

let editStudent = function (req, res) {
      const idStudent = req.url.split("/")[2];
      Student.findOne({ _id: idStudent }).then((infoStudent) => {
            let data = fs.readFileSync("../views/edit.html", "utf-8");
            data = data.replace("{id}", infoStudent._id);
            data = data.replace("{name}", infoStudent.name);
            data = data.replace("{address}", infoStudent.address);
            data = data.replace("{point}", infoStudent.point);
            res.write(data);
            return res.end();
      })
}

let displayList = function (req, res) {
      Student.find().then((dataStudent) => {
            let students = dataStudent
            data = fs.readFileSync("../views/list.html", 'utf-8')
            let temp = "";
            students.forEach(function (element) {
                  temp += `<tr>
            <td>${element.id}</td>  
            <td>${element.name}</td>
            <td>${element.address}</td>
            <td>${element.point}</td>
            <td>
                  <button onclick="location.href='/edit/${element.id}'" type="button" class="btn btn-warning">Edit</button>
            </td>
            <td>
                  <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#delete${element.id}">Delete</button>
                  <div class="modal fade" id="delete${element.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                        <div class="modal-content">
                              <div class="modal-header">
                              <h5 class="modal-title" id="exampleModalLabel">Delete student</h5>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div class="modal-body">
                              Do you want to Delete student name is ${element.name} ?
                              </div>
                              <div class="modal-footer">
                              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                              <button type="button" class="btn btn-danger" onclick='location.href="/delete/${element.id}"'>Delete</button>
                              </div>
                        </div>
                        </div>
                        </div>
            </td>
            </tr>`
            })
            data = data.replace("{students}", temp);
            res.write(data);
            return res.end();
      })


}