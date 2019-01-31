if (getCookie("token") === "") {

} else {
    window.location.href = "/";
}

$(function () {

    $(document).on('click', '#forgetPass-btn', function () {
        let data = getFormData($('#forgetPass_form'));

        var $inputs = $('#forgetPass_form :input');
        $inputs.each(function (index) {
            $(this).keyup()
        });

        let isErr = Object.values(err.forgetPass);
        let isValid = true;
        isErr.forEach(element => {
            if (element) {
                isValid = false;
            }
        });

        if (!isValid) {
            $('#alert-removal').trigger('click');
            setTimeout(function () {
                $('#message').append(
                    '<div id="inner-message" class="alert alert-danger">' +
                    '<button id="alert-removal" type="button" class="close" data-dismiss="alert">&times;</button>' +
                    'Please correctly fill all the credentials' +
                    '</div>'
                );
            }, 500);
            return;
        }

        $.ajax({
            url: "../password/forget",
            type: 'PUT',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $('#alert-removal').trigger('click');
                setTimeout(function () {
                    $('#message').append(
                        '<div id="inner-message" class="alert alert-success">' +
                        '<button id="alert-removal" type="button" class="close" data-dismiss="alert">&times;</button>' +
                        'Success' +
                        '</div>'
                    );
                }, 500);
            },
            error: function (xhr, textStatus, errorThrown) {
                var errMsg;
                if (xhr.status === 0) {
                    errMsg = "Network error.";
                } else {
                    errMsg = JSON.parse(xhr.responseText).message;
                    errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);

                    if (errMsg === 'Validation failed.') {
                        errMsg += '<br/>Incorrect ' + JSON.parse(xhr.responseText).errors.index.join(", ");
                    }
                }

                $('#alert-removal').trigger('click');
                setTimeout(function () {
                    $('#message').append(
                        '<div id="inner-message" class="alert alert-danger">' +
                        '<button id="alert-removal" type="button" class="close" data-dismiss="alert">&times;</button>' +
                        errMsg +
                        '</div>'
                    );
                }, 500);
            }
        });
    });

    $('#email_forgetPass').on('keyup', function () {
        let email = $('#email_forgetPass').val()
        if (email != "" && email.lastIndexOf('.') != -1 && email.lastIndexOf('@') != -1 &&
            email.lastIndexOf('.') - email.lastIndexOf("@") > 2) {
            validationDisplay(true, 'email', "forgetPass");
        } else {
            validationDisplay(false, 'email', "forgetPass");
        }
    });

});