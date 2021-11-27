const express = require("express");
const https = require("https");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extend: true}));

app.get("/", function(req, res){
  // res.send("I am running, status: ok");
  res.sendFile(__dirname + "/index.html");

});

app.post("/weatherinfo", function(req, res){
  console.log(req.body.cityName);
  // res.send("post request recieved");
  const city = req.body.cityName;
  const tempUnit = "metric";
  const apiKey = "d824926bc74e67c4c37c07d780d2a456";
  const url = "https://api.openweathermap.org/data/2.5/weather?units="+tempUnit+"&q="+city+"&appid="+apiKey;
  https.get(url, function(response){
    // console.log(response);
    response.on("data", function(data){
      var weatherData = JSON.parse(data);
      if (weatherData.message != "city not found")
      {
      var temp = weatherData.main.temp;
      var weatherDescription = weatherData.weather[0].description;
      var iconCode = weatherData.weather[0].icon;
      var iconURL = "http://openweathermap.org/img/wn/"+iconCode+"@2x.png";
      // var car = {"model": "X200", "color": "red", "fuel": "petrol", "engine":{"model":"690l", "size":"2l"}};
      res.write("<p>Weather descrition: " + weatherDescription + "</p>");
      res.write("<h1>Average temperature in "+city.toUpperCase()+" today is " + temp + " celcius</h1>");
      res.write("<img src=" +iconURL +">");
      res.send();
      }
      else {
        res.send("wrong City<br><a href='/'>Try again</a> ");
      }
    });
  });
});




app.listen(3000, function(){
  console.log("Server is running at port 3000");
});
