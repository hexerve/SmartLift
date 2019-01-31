var validate, signIn;

$(function () {
    if (getCookie("token") !== "") {
        window.location.href = "/";
    }

    validate = function () {
        var $inputs = $('#register :input');
        $inputs.each(function (index) {
            $(this).keyup()
        });

        let isErr = Object.values(err.register);
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
            return false;
        } else {
            return true;
        }

    }

    signIn = function () {
        var $inputs = $('#login :input');
        $inputs.each(function (index) {
            $(this).keyup()
        });

        let isErr = Object.values(err.login);
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
            return false;
        } else {
            $.ajax({
                url: "/login",
                type: 'POST',
                data: JSON.stringify(getFormData($('#login'))),
                contentType: 'application/json',
                success: function (data) {
                    setCookie("token", data.results.token, 1);
                    window.location.href = "/";
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
            return true;
        }

    }

    $('#name_register').on('keyup', function () {
        let name = $('#name_register').val()
        if (name.length < 3) {
            validationDisplay(false, 'name', "register");
        } else if (name.length > 30) {
            validationDisplay(false, 'name', "register");
        } else {
            validationDisplay(true, 'name', "register");
        }
    });

    $('#mobile_register').on('keyup', function () {
        let mobile = $('#mobile_register').val()
        if (isNaN(mobile)) {
            validationDisplay(false, 'mobile', "register");
        } else if (mobile.length < 10) {
            validationDisplay(false, 'mobile', "register");
        } else {
            validationDisplay(true, 'mobile', "register");
        }
    });

    $('#floor_register').on('keyup', function () {
        let floor = $('#floor_register').val()
        if (isNaN(floor)) {
            validationDisplay(false, 'floor', "register");
        } else {
            validationDisplay(true, 'floor', "register");
        }
    });

    $('#flat_register').on('keyup', function () {
        let flat = $('#flat_register').val()
        if (isNaN(flat)) {
            validationDisplay(false, 'flat', "register");
        } else {
            validationDisplay(true, 'flat', "register");
        }
    });

    $('#building_register').on('keyup', function () {
        let building = $('#building_register').val()
        if (building.length < 3) {
            validationDisplay(false, 'building', "register");
        } else if (building.length > 30) {
            validationDisplay(false, 'building', "register");
        } else {
            validationDisplay(true, 'building', "register");
        }
    });

    $('#email_register').on('keyup', function () {
        let email = $('#email_register').val()
        if (email != "" && email.lastIndexOf('.') != -1 && email.lastIndexOf('@') != -1 &&
            email.lastIndexOf('.') - email.lastIndexOf("@") > 2) {
            validationDisplay(true, 'email', "register");
        } else {
            validationDisplay(false, 'email', "register");
        }
    });

    $('#password_register').on('keyup', function () {
        let password = $('#password_register').val()
        if (password.length < 8) {
            validationDisplay(false, 'password', "register");
        } else {
            validationDisplay(true, 'password', "register");
        }
    });


    $('#email_login').on('keyup', function () {
        let email = $('#email_login').val()
        if (email != "" && email.lastIndexOf('.') != -1 && email.lastIndexOf('@') != -1 &&
            email.lastIndexOf('.') - email.lastIndexOf("@") > 2) {
            validationDisplay(true, 'email', "login");
        } else {
            validationDisplay(false, 'email', "login");
        }
    });

    $('#password_login').on('keyup', function () {
        let password = $('#password_login').val()
        if (password.length < 8) {
            validationDisplay(false, 'password', "login");
        } else {
            validationDisplay(true, 'password', "login");
        }
    });

});