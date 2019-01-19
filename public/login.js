var validate;
var errRegister = { name: true, mobile: true, floor: true, flat: true, buiding: true, email: true, password: true };

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
    validate = function () {
        // var form = $("#register");
        // var data = getFormData(form);
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

});