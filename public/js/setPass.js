$(function () {

    $(document).on('click', '#set-pass-btn', function () {
        if (getCookie("pass_token") === "") {
            window.location.href = "/login?action=login_required";
        }

        let data = getFormData($('#setPass_form'));

        var $inputs = $('#setPass_form :input');
        $inputs.each(function (index) {
            $(this).keyup()
        });

        let isErr = Object.values(err.set);
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

        let new_pass = data.password;

        data = {};
        data.newPassword = new_pass;
        $.ajaxSetup({
            headers: {
                'authorization': getCookie("pass_token")
            }
        });
        $.ajax({
            url: "/password/set",
            type: 'PUT',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (data) {
                $('#alert-removal').trigger('click');
                setTimeout(function () {
                    $('#message').append(
                        '<div id="inner-message" class="alert alert-success">' +
                        '<button id="alert-removal" type="button" class="close" data-dismiss="alert">&times;</button>' +
                        'Success' +
                        '</div>'
                    );
                }, 500);
                window.location.href = "/login";
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
                        'Network error' +
                        '</div>'
                    );
                }, 500);
            }
        });
    });


    $('#password_set').on('keyup', function () {
        let password = $('#password_set').val()
        if (password.length < 8) {
            validationDisplay(false, 'password', "set");
        } else {
            validationDisplay(true, 'password', "set");
        }
    });

    $('#conf_password_set').on('keyup', function () {
        let password = $('#conf_password_set').val()
        if (password !== $('#password_set').val()) {
            validationDisplay(false, 'conf_password', "set");
        } else {
            validationDisplay(true, 'conf_password', "set");
        }
    });

});