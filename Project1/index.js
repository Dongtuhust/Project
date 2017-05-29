var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.set("views","./views");
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

var mongoose = require('mongoose');//modunle giao tiep voi mongodb lien ket vs database
mongoose.connect('mongodb://localhost:27017/story'); //ket noi vs database "story"
var dbMongo = mongoose.connection;
dbMongo.on('err',console.error.bind(console,'connect error')) //ket noi gap loi in ra 'connect error'
dbMongo.once('open',function(){
  console.log('Mongodb connect')
})   //ket noi thanh cong

var Schema = new mongoose.Schema({
     stories: [{
       story: String,
       title: String
     }]
});

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/story";

io.on("connection",function(socket){
	console.log("co ng ket noi");
  socket.on("yeu_cau",function(data){
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      db.collection("truyen").find().toArray(function(err, results) {
        if (err) throw err;
        var index = Math.floor(Math.random() * results[0].Stories.length);
        socket.emit('phan_hoi',results[0].Stories[index]);
        db.close();
      });
    });
  });
});

app.get("/",function(req,res){
  res.render("story")
});

