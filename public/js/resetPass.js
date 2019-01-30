$(function () {
    if (getCookie("token") === "") {
        window.location.href = "/login?action=login_required";
    } else {
        $.ajaxSetup({
            headers: {
                'authorization': getCookie("token")
            }
        });
        $.get("../user", {},
            function (data, status, xhr) {
                console.log(data);
                let name = data.results.user.name;
                mobile = data.results.user.mobile;

                email = data.results.user.email;
                $('#name_update').val(name);
                $('#mobile_update').val(mobile);

            }).fail(function (xhr, status, error) {
                if (xhr.status === 0) {
                    alert("network error");
                    return;
                }

                setCookie("token", "", -1);
                window.location.href = "/login?action=login_required";
            });
    }

    $(document).on('click', '#reset-pass-btn', function () {
        let form = getFormData($('#resetPass_form'));

        let isErr = Object.values(err.reset);
        let isValid = true;
        isErr.forEach(element => {
            if (element) {
                isValid = false;
            }
        });

        if (!isValid) {
            alert("please correctly fill all the credentials");
            return;
        }

        let data = {};
        data.password = form.password;
        data.newPassword = form.new_password;

        $.ajax({
            url: "../password/reset",
            type: 'PUT',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                alert("Password successfully updated");
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
    });

    $('#password_reset').on('keyup', function () {
        let password = $('#password_reset').val()
        if (password.length < 8) {
            validationDisplay(false, 'password', "reset");
        } else {
            validationDisplay(true, 'password', "reset");
        }
    });

    $('#new_password_reset').on('keyup', function () {
        let password = $('#new_password_reset').val()
        if (password.length < 8) {
            validationDisplay(false, 'new_password', "reset");
        } else {
            validationDisplay(true, 'new_password', "reset");
        }
    });

    $('#conf_password_reset').on('keyup', function () {
        let password = $('#conf_password_reset').val()
        if (password !== $('#new_password_reset').val()) {
            validationDisplay(false, 'conf_password', "reset");
        } else {
            validationDisplay(true, 'conf_password', "reset");
        }
    });

});