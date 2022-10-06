const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post('/', function(req, res) {
  let query = req.body.city_name;
  query = query[0].toUpperCase() + query.slice(1);
  const appkey = "b3c39dcbf59bc704c9f13e97f388dc00";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + appkey + "&units=" + unit;
  https.get(url, function(response) {
    console.log(response.statusCode);
    response.on('data', function(data) {
      const weatherData = JSON.parse(data);
      const weatherDescription = weatherData.weather[0].description;
      const temp = weatherData.main.temp;
      const icon = weatherData.weather[0].icon;
      const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write("<p>The weather is currently " + weatherDescription + "");
      res.write("<h2>The temperature in " + query + " is " + temp + "</h2>");
      res.write(`<img src="${imageUrl}">`);
      res.send();
    })
  })
})

app.listen(3000, function() {
  console.log("Server is running on ", port);
})
