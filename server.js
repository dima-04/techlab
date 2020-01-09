var express = require("express");
var cheerio = require("cheerio");
var mongojs = require("mongojs");
var exphbs = require("express-handlebars");

var app = express();
var PORT = process.env.PORT || 3000;

// Use the express.static middleware to serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var databaseUrl = "techlab";
var collections = ["articles"];
var db = mongojs(databaseUrl, collections);

// Log any mongojs errors to console
db.on("error", function (error) {
  console.log("Database Error:", error);
});

// Makes HTTP request for HTML page
var axios = require("axios");

app.get("/", function (req, res) {
  db.articles.find().sort({ title: 1 }, function (error, found) {
    // Log any errors if the server encounters one
    if (error) {
      console.log(error);
      res.send(error);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.render("index", {articles: found});
    }
  });
});

app.post("/api/articles", function (req, res) {
  axios.get("https://www.nytimes.com/section/technology").then(function (response) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data);

    // An empty array to save the data that we'll scrape
    var results = [];

    // With cheerio, find each p-tag with the "title" class
    // (i: iterator. element: the current element)
    $("li.css-ye6x8s").each(function (i, element) {

      // Save the text of the element in a "title" variable
      var title = $(element).find("h2").text();
      var summary = $(element).find("p").text();

      // In the currently selected element, look at its child elements (i.e., its a-tags),
      // then save the values for any "href" attributes that the child elements may have
      var link = "https://www.nytimes.com/"+$(element).find("a").attr("href");

      // Save these results in an object that we'll push into the results array we defined earlier
      db.articles.save({
        title: title,
        link: link,
        summary: summary
      });
    });
    res.send("Articles Updated")
  });
});

app.get("/api/articles", function (req, res) {


  db.articles.find().sort({ title: 1 }, function (error, found) {
    // Log any errors if the server encounters one
    if (error) {
      console.log(error);
      res.send(error);
    }
    // Otherwise, send the result of this query to the browser
    else {
     res.send(found);
    }
  });
});


app.listen(PORT, function () {
  console.log(
    "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
    PORT,
    PORT
  );
});