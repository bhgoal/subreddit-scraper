// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p>" + data[i].title + "<br />" + data[i].link + "</p>");
    $("#articles").append("<button type='button' class='btn btn-primary addNoteBtn' data-id='" + data[i]._id + "'>Comments</button>");
  }
});


// Whenever someone clicks add note button
$(document).on("click", ".addNoteBtn", function() {
  var thisId = $(this).attr("data-id");
  getComments(thisId);
});

function getComments(thisId) {
  // Empty the notes from the note section
  $("#notes").empty();

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // If there's a note in the article
      if (data.notes) {
        for (var i = 0; i < data.notes.length; i++) {
          // Display the apropos information on the page
          $("#notes").append("<h3>" + data.notes[i].title + "</h3>");
          $("#notes").append("<p>" + data.notes[i].body + "</p>");
          $("#notes").append("<button type='button' class='btn btn-primary deleteNoteBtn' data-articleId='" + thisId + "' data-id='" + data.notes[i]._id + "'>Delete</button>");
        }
        // Place the title of the note in the title input
      }

      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

    });
};

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      getComments(thisId);
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click", ".deleteNoteBtn", function() {
  // Grab the id associated with the article from the submit button
  var articleId = $(this).attr("data-articleId");
  var commentId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + articleId + "/delete",
    data: {
      _id: commentId
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      getComments(articleId);
    });

});

