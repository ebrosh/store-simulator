
/* AJX FORM */

$('#ForgottenPasswordForm').submit(function(event) {

    event.preventDefault();
    event.stopImmediatePropagation();

    //alert('ForgottenPassword form');

    //$('#ForgottenPassword').PopUp('hide');

    $.ajax({
        url: '/account/ajax_responder.asp',
        data: {
            a: 'forgotten_password',
            form_data: $(this).serialize()
        },
        type: 'POST',
        success: function(html) {

            //alert(html);

            var returnCode = html.split('%%html_split%%')[0];
            var returnMessage = html.split('%%html_split%%')[1];

            if (returnCode == 'TRUE') {

                alert(returnMessage);

                $('#ForgottenPassword').PopUp('hide');

                clearFormInputs("ForgottenPasswordForm");

            } else {

                alert('Oops! ' + returnMessage);
            }
        },
        error: function(html) {
            alert('Server ERROR returned');
        }
    });

    return false;

});

$('#AskAQuestion').submit(function(event) {

    event.preventDefault();
    event.stopImmediatePropagation();

    //alert('Submit ask a question form');

    $.ajax({
        url: '/includes/ajax_responder.asp',
        data: {
            a: 'ask_question',
            form_data: $(this).serialize()
        },
        type: 'POST',
        success: function(html) {

            var returnCode = html.split('%%html_split%%')[0];
            var returnMessage = html.split('%%html_split%%')[1];

            if (returnCode == 'TRUE') {

                //alert('Server TRUE returned');

                $('#AskQuestionProductComplete').PopUp('show');
                $('#AskQuestionProduct').PopUp('hide');

                clearFormInputs("AskAQuestion");

            } else {

                alert('Validation Error: ' + returnMessage);
            }
        },
        error: function(html) {
            alert('Server ERROR returned');
        }
    });


    return false;

});

$('#PriceMatch').submit(function(event) {

    event.preventDefault();
    event.stopImmediatePropagation();

    //alert('Submit price match form');

    $.ajax({
        url: '/includes/ajax_responder.asp',
        data: {
            a: 'price_match',
            form_data: $(this).serialize()
        },
        type: 'POST',
        success: function(html) {

            //alert('Server Success');
            
            var returnCode = html.split('%%html_split%%')[0];
            var returnMessage = html.split('%%html_split%%')[1];

            if (returnCode == 'TRUE') {

                //alert('Server TRUE returned');

                $('#PriceMatchProductComplete').PopUp('show');
                $('#PriceMatchProduct').PopUp('hide');

                clearFormInputs("PriceMatch");

            } else {

                alert('Validation Error: ' + returnMessage);

            }
        },
        error: function(html) {
            alert('Server ERROR returned');
        }
    });


    return false;

});


function clearFormInputs(formID) {

    // iterate over all of the inputs for the form
    // element that was passed in
    $('#' + formID + ' :input').each(function() {
        var type = this.type;
        var tag = this.tagName.toLowerCase(); // normalize case
        // it's ok to reset the value attr of text inputs,
        // password inputs, and textareas
        if (type == 'text' || type == 'password' || tag == 'textarea')
            this.value = "";
        // checkboxes and radios need to have their checked state cleared
        // but should *not* have their 'value' changed
        else if (type == 'checkbox' || type == 'radio')
            this.checked = false;
        // select elements need to have their 'selectedIndex' property set to -1
        // (this works for both single and multiple select elements)
        else if (tag == 'select')
            this.selectedIndex = -1;
    });
}
