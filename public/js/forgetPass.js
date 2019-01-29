if (getCookie("token") === "") {
        
} else {
    window.location.href = "/";
}

$(function () {

    $(document).on('click', '#forgetPass-btn', function () {
        let data = getFormData($('#forgetPass_form'));

        let isErr = Object.values(err.forgetPass);
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
            url: "../password/forget",
            type: 'PUT',
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