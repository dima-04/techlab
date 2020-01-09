// $.getJSON("/api/articles", function(data) {
//   // For each one
//   for (var i = 0; i < data.length; i++) {
//     // Display the apropos information on the page
//     $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//   }
// });
// Whenever someone clicks scrapeButton
$(document).on("click", ".scrapeButton", function() {

  $.ajax({
    method: "post",
    url: "/api/articles/"
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
    });
});