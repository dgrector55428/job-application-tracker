$(document).ready(function () {
    // load existing contacts on page load
    getContacts();

    //clear button for search
    $('.search').append('<button type="button" class="clearSearch btn btn-warning" style="color:#fff">Clear</button>')

    //click events
    $('#updateContact').on('click', newContact);
    $('#viewContacts').on('click', '.editContact', editContact);
    $('#viewContacts').on('click', '.deleteContact', deleteContact);
    $('.search').on('click', '.clearSearch', clearSearch);

    //datepicker
    var date_input = $('input[name="date"]'); //our date input has the name "date"
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    date_input.datepicker({
        format: 'mm/dd/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
    })

    function getContacts() {
        // ajax call to server to get jobs
        $.ajax({
            url: '/contacts',
            type: 'GET',
            success: function (data) {
                displayContacts(data);
            }, // end success
            error: function (jqXHR, exception) {
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                console.log(msg);

            }, //end ajax
            // display on DOM with buttons that allow edit of each
        })
    } // end getContacts

    // gets jobs from dB to display in table onload
    function displayContacts(data) {
        $('#viewContacts').empty();
        for (let i = 0; i < data.length; i++) {
            let newRow = $('<tr>');
            // using MediaStreamErrorEvent.js to parse date into a readable format
            // let convertedDate = data[i].date;
            // convertedDate = convertedDate.split('T')[0];

            //appending rows to DOM
            newRow.append('<td>' + data[i].id + '</td>');
            newRow.append('<td>' + data[i].name + '</td>');
            newRow.append('<td>' + data[i].company + '</td>');
            newRow.append('<td>' + data[i].position + '</td>');
            newRow.append('<td>' + data[i].email + '</td>');
            newRow.append('<td>' + data[i].phone + '</td>');
            newRow.append('<td>' + data[i].notes + '</td>');
            //edit row button
            newRow.append('<td><button type="button" class="editContact btn btn-success tableButton" value="' + data[i].id + '"><i class="fas fa-pencil-alt"></i></button></td>');
            //delete row button
            newRow.append('<td><button type="button" class="deleteContact btn btn-danger tableButton" value="' + data[i].id + '"><i class="fa fa-trash"></i></button></td>');

            $('#viewContacts').append(newRow);
        }
    }

    function newContact() {

        //setting variables
        let name = $('#name').val()
        let position = $('#position').val()
        let company = $('#company').val()
        let email = $('#email').val()
        let phone = $('#phone').val()
        let notes = $('#notes').val()


        if (checkInputs(name)) {
            let objectToSend = {
                name: name,
                position: position,
                company: company,
                email: email,
                phone: notes,
                notes: notes,
            };
            // call saveContact with the new obejct
            saveContact(objectToSend);

            $.ajax({
                type: 'PUT',
                url: '/contacts/update/',
                data: objectToUpdate,
                success: function (response) {
                    console.log('response', response);
                    getContacts();
                    $('#editContact').empty();
                    $('#updateContact').on('click', newContact); //end updateContact on click
                    $('#updateContact').off('click', updateContact);
                    $('#contactModalLabel').text('Add Job');
                    $('#updateContact').text('Add Job');

                    //clear inputs after job updated
                    $('#name').val('');
                    $('#position').val('');
                    $('#company').val('');
                    $('#email').val('');
                    $('#phone').val('');
                    $('#notes').val('');
                    $('#updateContact').val('');
                },
                error: function (jqXHR, exception) {
                    var msg = '';
                    if (jqXHR.status === 0) {
                        msg = 'Not connect.\n Verify Network.';
                    } else if (jqXHR.status == 404) {
                        msg = 'Requested page not found. [404]';
                    } else if (jqXHR.status == 500) {
                        msg = 'Internal Server Error [500].';
                    } else if (exception === 'parsererror') {
                        msg = 'Requested JSON parse failed.';
                    } else if (exception === 'timeout') {
                        msg = 'Time out error.';
                    } else if (exception === 'abort') {
                        msg = 'Ajax request aborted.';
                    } else {
                        msg = 'Uncaught Error.\n' + jqXHR.responseText;
                    }
                    console.log('erro new contact', msg);
                }, //end ajax
            });
        }
    }

    function saveContact(newContact) {

        $.ajax({
            url: '/contacts',
            type: 'POST',
            data: newContact,
            success: function (response) {
                console.log('got some jobs: ', response);
                getContacts();
                $('#name').val('').focus();
                $('#position').val('');
                $('#company').val('');
                $('#email').val('');
                $('#phone').val('');
                $('#notes').val('');
            }, // end success
            error: function (jqXHR, exception) {
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                alert(html(msg));
            }, //end ajax
        }); //end ajax
    }

    function updateContact() {

        let name = $('#name').val()
        let company = $('#company').val()
        let position = $('#position').val()
        let email = $('#email').val()
        let phone = $('#phone').val()
        let notes = $('#notes').val()


        if (checkInputs(name)) {
            let contactID = $(this).val();
            let objectToUpdate = {
                name: name,
                position: position,
                company: company,
                email: email,
                phone: phone,
                notes: notes,
            };
            $.ajax({
                type: 'PUT',
                url: '/contacts/update/' + contactID,
                data: objectToUpdate,
                success: function (response) {
                    getContacts();
                    $('#editContact').empty();
                    $('#updateContact').on('click', newContact);
                    $('#updateContact').off('click', updateContact);
                    $('#formLabel').text('Add Job');
                    $('#updateContact').text('Add Job');

                    $('#name').val('');
                    $('#contact').val('');
                    $('#email').val('');
                    $('#position').val('');
                    $('textarea').val('');
                    $('#date').val('');
                    $('#status').val('');
                    $('#filename').val('');
                    $('#updateContact').val('');
                },
                error: function (jqXHR, exception) {
                    var msg = '';
                    if (jqXHR.status === 0) {
                        msg = 'Not connect.\n Verify Network.';
                    } else if (jqXHR.status == 404) {
                        msg = 'Requested page not found. [404]';
                    } else if (jqXHR.status == 500) {
                        msg = 'Internal Server Error [500].';
                    } else if (exception === 'parsererror') {
                        msg = 'Requested JSON parse failed.';
                    } else if (exception === 'timeout') {
                        msg = 'Time out error.';
                    } else if (exception === 'abort') {
                        msg = 'Ajax request aborted.';
                    } else {
                        msg = 'Uncaught Error.\n' + jqXHR.responseText;
                    }
                    alert(html(msg));
                }, //end ajax
            });
        }
    }

    function editContact() {
        $('#contactModalLabel').text('Edit Contact');
        $('#updateContact').off('click', newContact); //end updateContact on click
        $('#updateContact').on('click', updateContact);

        let editDiv = $('#editContact');
        let contactID = $(this).val();
        // console.log('contactID from editContact, ', contactID);

        $.ajax({
            url: '/contacts/' + contactID,
            method: 'GET',
            success: function (response) {
                console.log('response ', response);
                $('#name').val(response[0].name).focus();
                $('#position').val(response[0].position);
                $('#company').val(response[0].company);
                $('#email').val(response[0].email);
                $('#phone').val(response[0].phone);
                $('#notes').val(response[0].notes);
                $('#updateContact').val(response[0].id);

                $('#contactModal').modal('show');
            },
            error: function (jqXHR, exception) {
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                swal(html(msg));
            }, //end ajax
        })
    }

    function deleteContact() {
        let id = $(this).val();
        console.log('id: ', id);
        $.ajax({
            type: 'DELETE',
            url: '/contacts/' + id,
            success: function (response) {
                console.log('response', response);
                getContacts();
            },
            error: function (error) {
                console.log('Error deleting job ', error);
            }

        });
    }

    // Write on keyup event of keyword input element
    $("#search").keyup(function () {
        var searchText = $(this).val().toLowerCase();
        // Show only matching TR, hide rest of them
        $.each($("#table tbody tr"), function () {
            if ($(this).text().toLowerCase().indexOf(searchText) === -1)
                $(this).hide();
            else
                $(this).show();
        });
    });

    function clearSearch() {
        window.location.reload();
    }

    function checkInputs(name) {
        if (name == '') {
            alert('Name can not be empty, please review required fields.');
            return false;
        } else {
            return true;
        }
    }

    $("#phone").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
        var curchr = this.value.length;
        var curval = $(this).val();
        if (curchr == 3 && e.which != 8 && e.which != 0) {
            $(this).val(curval + "-");
        } else if (curchr == 7 && e.which != 8 && e.which != 0) {
            $(this).val(curval + "-");
        }
        $(this).attr('maxlength', '12');
    });
});