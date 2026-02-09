$(document).ready(function() {
    $('#addBtn').click(function() {
        var task = $('#taskInput').val();
        if (task) {
            var listItem = $('<li></li>');
            var taskText = $('<span></span>').text(task);
            var deleteBtn = $('<button class="delete-btn">Delete</button>');
            
            listItem.append(taskText);
            listItem.append(' ');
            listItem.append(deleteBtn);
            $('#taskList').append(listItem);
            $('#taskInput').val('');
        }
    });
    
    $('#taskList').on('click', '.delete-btn', function() {
        $(this).parent().remove();
    });
});
