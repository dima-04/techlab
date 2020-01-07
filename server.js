var express = require("express");
var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var axios = require("axios");
axios.get("https://www.nytimes.com/section/technology").then(function(response) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(response.data);

  // An empty array to save the data that we'll scrape
  var results = [];

  // With cheerio, find each p-tag with the "title" class
  // (i: iterator. element: the current element)
  $("li.css-ye6x8s").each(function(i, element) {

    // Save the text of the element in a "title" variable
    var title = $(element).find("h2").text();
    var summary = $(element).find("p").text();

    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have
    var link = $(element).find("a").attr("href");

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: title,
      link: link,
      summary:summary
    });
  });
  console.log(results);
});

//   app.get("/", function(req, res) {
//     res.send("Hello world");
//   });
  
//   // 2. At the "/all" path, display every entry in the animals collection
//   app.get("/all", function(req, res) {
//     // Query: In our database, go to the animals collection, then "find" everything
//     db.tech.find({}, function(error, found) {
//       // Log any errors if the server encounters one
//       if (error) {
//         console.log(error);
//       }
//       // Otherwise, send the result of this query to the browser
//       else {
//         res.json(found);
//       }
//     });
//   });

//   // Log the results once you've looped through each of the elements found with cheerio
  
// app.listen(3000, function() {
//   console.log("App running on port 3000!");
// });
