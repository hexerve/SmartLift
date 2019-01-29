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

    $(document).on('click', '#update-btn', function () {
        let data = getFormData($('#update_form'));

        let isErr = Object.values(err.update);
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

        $.ajax({
            url: "../user",
            type: 'PUT',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                alert("Profile successfully updated");
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

    $('#name_update').on('keyup', function () {
        let name = $('#name_update').val()
        if (name.length < 3) {
            validationDisplay(false, 'name', "update");
        } else if (name.length > 30) {
            validationDisplay(false, 'name', "update");
        } else {
            validationDisplay(true, 'name', "update");
        }
    });

    $('#mobile_update').on('keyup', function () {
        let mobile = $('#mobile_update').val()
        if (isNaN(mobile)) {
            validationDisplay(false, 'mobile', "update");
        } else if (mobile.length < 10) {
            validationDisplay(false, 'mobile', "update");
        } else {
            validationDisplay(true, 'mobile', "update");
        }
    });

});