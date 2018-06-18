// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<hr><p>" + data[i].title + "</p>");
    $("#articles").append("<a href='https://www.reddit.com" + data[i].link + "'>" + data[i].link + "</a>");
    $("#articles").append("<p>Posted by: " + data[i].author + "</p>");
    $("#articles").append("<a class='btn addNoteBtn' data-id='" + data[i]._id + "'>Comments</a>");
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
      $("#notes").append("<h5>" + data.title + "</h5>");
      // If there's a note in the article
      if (data.notes) {
        for (var i = 0; i < data.notes.length; i++) {
          // Display the apropos information on the page
          $("#notes").append("<h6>" + data.notes[i].title + "</h6>");
          $("#notes").append("<span>" + data.notes[i].body + "</span>");
          $("#notes").append("<a class='deleteNoteBtn' data-articleId='" + thisId + "' data-id='" + data.notes[i]._id + "'><i class='far fa-times-circle'></i></a>");
        }
        // Place the title of the note in the title input
      }

      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' placeholder='Name'>");
      // A textarea to add a new note body
      $("#notes").append("<textarea class='materialize-textarea' id='bodyinput' name='body' placeholder='Comment'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<a class='btn' data-id='" + data._id + "' id='savenote'>Save Comment</a>");

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

