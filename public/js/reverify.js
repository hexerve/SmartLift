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
                    alert("Network error");
                    return;
                }

                setCookie("token", "", -1);
                window.location.href = "/login?action=login_required";
            });
    }

    $(document).on('click', '#reverify-btn', function () {
        let data = getFormData($('#reverify_form'));

        let isErr = Object.values(err.reverify);
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
            url: "../reverify",
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                alert("success");
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

    $('#email_reverify').on('keyup', function () {
        let email = $('#email_reverify').val()
        if (email != "" && email.lastIndexOf('.') != -1 && email.lastIndexOf('@') != -1 &&
            email.lastIndexOf('.') - email.lastIndexOf("@") > 2) {
            validationDisplay(true, 'email', "reverify");
        } else {
            validationDisplay(false, 'email', "reverify");
        }
    });

});