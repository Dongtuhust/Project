var request = require('request');
var cheerio = require('cheerio');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/story";// đường dẫn tới database khởi tạo

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});
//tao collection truyen
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.createCollection("truyen", function(err, res) {
    if (err) throw err;
    console.log("Table created!");
    db.close();
  });
});
//kết nối mongodb
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/story')
var dbMongo = mongoose.connection;
dbMongo.on('error',console.error.bind(console,'connection error:'))
dbMongo.once('open',function(){
  console.log('MongoDb connect')
})

var Schema = new mongoose.Schema({
  Stories: [{
    story: String,
    title: String
  }]
})
var myobj = mongoose.model('Data', Schema)

var mangStories = [];
request("http://www.zuize.vn/cat/truyen-cuoi-dan-gian.html",function(error,response,body){
      if(error){
        console.log(error);
      }else {
        $ = cheerio.load(body);
        var ds = $(body).find("a.a-title");
        var n = ds.length;
        ds.each(function (i,e) {
          request(e["attribs"]["href"],function (error1,response1,body1) {
            if(error1){
              console.log(error1);
            }else {
                $ = cheerio.load(body1);
                var data= $(body1).find("div.padding-10-20").text();
                var ten = $(body1).find("h3.margin-bottom-0").text();
                var object = { story: data, title: ten };
                mangStories.push(object);
             }
             if(mangStories.length == n){
               MongoClient.connect(url, function(err, db) {
                   if (err) throw err;
                   myobj = {Stories: mangStories};
                   db.collection("truyen").insertOne(myobj, function(err1, res1) {
                   if (err1) throw err1;
                   console.log("1 record inserted");
                   db.close();
                 });
               });
             }
          });
        });
      }
   });


