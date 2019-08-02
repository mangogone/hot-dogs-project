/*
 Javascript code for the index page
 */

$(function () {

  var
    $list_body = $('#list-body'),
    $modal = $('#hotdog-form');

  /* Refresh hot-dog list from the database */

  function refresh () {

    // Call to the API
    $.getJSON('/api/hotdogs', function (data) {

      // First, empty the table data
      $('#list-body tr').remove();

      // For each hot dog returned by the API call, we create a new row in the table
      $.each(data, function (index, hotdog) {
        var row = $('<tr>'); // empty row
        $('<td>').html(hotdog.id).appendTo(row);  // index number
        $('<td>').html(hotdog.name).appendTo(row); // Name
        $('<td>').html(hotdog.description).appendTo(row); // Descsription
        // Edit and delete buttons
        $('<td>').html('<button id="edit-' + (hotdog.id) + '" class="btn btn-sm btn-success">Edit</button>').appendTo(row);
        $('<td>').html('<button id="delete-' + (hotdog.id) + '" class="btn btn-sm btn-danger">Delete!</button>').appendTo(row);
        // Add row to the table
        row.appendTo('#list-body');
      });
    });
  }

  /*
   Event handlers
   */

  // "Create" button
  $('#create-button').click(function() {
      // Update modal with hot dog data
      $modal.find('.modal-title').html('Create Hot Dog');  // Title
      $modal.find('#name').val('');  // Name field
      $modal.find('#description').val('');  // Description field
      $modal.find('#id').val('');  // Id field : empty
      $modal.find('#op').val('add');  // Op field : "add"
      $modal.find('#ok-button').html('Create');  // OK button
      // Open popup with add form
      $modal.modal();
  });

  // "Edit" button (delegated, because the list of buttons may change)
  $list_body.on('click', 'button[id^="edit-"]', function () {
    var id = $(this).attr('id').split('-')[1];  // Hot dog id
    console.log(id);
    // Call API to get hot dog details
    $.getJSON('/api/hotdogs/' + id, function (data) {
      // Update modal with hot dog data
      $modal.find('.modal-title').html('Edit Hot Dog #' + id);  // Title
      $modal.find('#name').val(data.name);  // Name field
      $modal.find('#description').val(data.description);  // Description field
      $modal.find('#id').val(id);  // Id field : hotdog id
      $modal.find('#op').val('edit');  // Op field : "edit"
      $modal.find('#ok-button').html('Edit');  // OK button
      // Open popup with edit form
      $modal.modal();
    });
  });

  // "Delete" button (delegated, because the list of buttons may change)
  $list_body.on('click', 'button[id^="delete-"]', function () {
    var id = $(this).attr('id').split('-')[1];  // Hot dog id
    // Call API to delete hot dog
    $.ajax('/api/hotdogs/' + id,
      {
        method:  'DELETE',
        success: function (data) {
          console.log(data);
          refresh();
        },
      });
  });

  // OK Button
  $('#ok-button').click(function () {
    $modal.modal('hide');  // Close modal
    if ($modal.find('#op').val() === 'add') {
      // Here we want to add a new hot dog
      // Call API with POST request. The body of the request is in "data"
      $.ajax('/api/hotdogs', {
        method:  'POST',
        data:    {
          name:        $modal.find('#name').val(),
          description: $modal.find('#description').val(),
        },
        success: function (data) {
          refresh();  // Refresh list
        },
      });
    } else {
      // Here we want to edit an existing hot dog
      var id = $modal.find('#id').val();
      // Call API with PUT request. The body of the request is in "data"
      $.ajax('/api/hotdogs/' + id, {
        method:  'PUT',
        data:    {
          name:        $modal.find('#name').val(),
          description: $modal.find('#description').val(),
        },
        success: function (data) {
          refresh();  // Refresh list
        },
      });

    }
  });

  /*
   Initial refresh
   */
  refresh();

});
