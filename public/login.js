var validate, signIn;
var errRegister = { name: true, mobile: true, floor: true, flat: true, buiding: true, email: true, password: true };
var errRegister1 = { email1: true, password1: true };

function validationDisplay(status, field) {
    if (status == true) {
        errRegister[field] = false;
        $('#' + field).removeClass('is-invalid');
        $('#' + field).addClass('is-valid');
        $('#' + field + '_label').removeClass('text-danger');
        $('#' + field + '_label').addClass('text-success');
    } else {
        errRegister[field] = true;
        $('#' + field).removeClass('is-valid');
        $('#' + field).addClass('is-invalid');
        $('#' + field + '_label').removeClass('text-success');
        $('#' + field + '_label').addClass('text-danger');
    }
}

$(function () {
    if (getCookie("token") !== "") {
        window.location.href = "/";
    }

    validate = function () {
        var form = $("#register");
        var data1 = getFormData(form);
        let count = 0;
        for (let key in errRegister) {
            if (errRegister[key] === false)
                count++;
        }
        if (count < 7) {
            alert("please fill all the credentials correctly");
            return false;
        } else {
            return true;
        }

    }

    signIn = function () {
        if (errRegister1.email1 === true || errRegister1.password === true) {
            alert("please fill all the credentials correctly");
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
                    alert(errMsg);
                }
            });
            return true;
        }

    }

    $('#name').on('keyup', function () {
        let name = $('#name').val()
        if (name.length < 3) {
            validationDisplay(false, 'name');
        } else if (name.length > 30) {
            validationDisplay(false, 'name');
        } else {
            validationDisplay(true, 'name');
        }
    });

    $('#mobile').on('keyup', function () {
        let mobile = $('#mobile').val()
        if (isNaN(mobile)) {
            validationDisplay(false, 'mobile');
        } else if (mobile.length < 10) {
            validationDisplay(false, 'mobile');
        } else {
            validationDisplay(true, 'mobile');
        }
    });

    $('#floor').on('keyup', function () {
        let floor = $('#floor').val()
        if (isNaN(floor)) {
            validationDisplay(false, 'floor');
        } else {
            validationDisplay(true, 'floor');
        }
    });

    $('#flat').on('keyup', function () {
        let flat = $('#flat').val()
        if (isNaN(flat)) {
            validationDisplay(false, 'flat');
        } else {
            validationDisplay(true, 'flat');
        }
    });

    $('#building').on('keyup', function () {
        let building = $('#building').val()
        if (building.length < 3) {
            validationDisplay(false, 'building');
        } else if (building.length > 30) {
            validationDisplay(false, 'building');
        } else {
            validationDisplay(true, 'building');
        }
    });

    $('#email').on('keyup', function () {
        let email = $('#email').val()
        if (email != "" && email.lastIndexOf('.') != -1 && email.lastIndexOf('@') != -1 &&
            email.lastIndexOf('.') - email.lastIndexOf("@") > 2) {
            validationDisplay(true, 'email');
        } else {
            validationDisplay(false, 'email');
        }
    });

    $('#password').on('keyup', function () {
        let password = $('#password').val()
        if (password.length < 8) {
            validationDisplay(false, 'password');
        } else {
            validationDisplay(true, 'password');
        }
    });

    $('#email1').on('keyup', function () {
        let email = $('#email1').val()
        if (email != "" && email.lastIndexOf('.') != -1 && email.lastIndexOf('@') != -1 &&
            email.lastIndexOf('.') - email.lastIndexOf("@") > 2) {
            errRegister1['email1'] = false;
            $('#' + 'email1').removeClass('is-invalid');
            $('#' + 'email1').addClass('is-valid');
            $('#' + 'email1' + '_label').removeClass('text-danger');
            $('#' + 'email1' + '_label').addClass('text-success');
        } else {
            errRegister1['email1'] = true;
            $('#' + 'email1').removeClass('is-valid');
            $('#' + 'email1').addClass('is-invalid');
            $('#' + 'email1' + '_label').removeClass('text-success');
            $('#' + 'email1' + '_label').addClass('text-danger');
        }
    });

    $('#password1').on('keyup', function () {
        let password = $('#password1').val()
        if (password.length < 8) {
            errRegister1['password1'] = true;
            $('#' + 'password1').removeClass('is-valid');
            $('#' + 'password1').addClass('is-invalid');
            $('#' + 'password1' + '_label').removeClass('text-success');
            $('#' + 'password1' + '_label').addClass('text-danger');
        } else {
            errRegister1['password1'] = false;
            $('#' + 'password1').removeClass('is-invalid');
            $('#' + 'password1').addClass('is-valid');
            $('#' + 'password1' + '_label').removeClass('text-danger');
            $('#' + 'password1' + '_label').addClass('text-success');
        }
    });

});