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
                $('#name').val(name);
                $('#mobile').val(mobile);
            
            }).fail(function (xhr, status, error) {
            if (xhr.status === 0) {
                $('.alert').hide(500);
                $('#pass-msg').append(
                    '<div class="alert alert-danger alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Oops! </strong>Network error.</div>'
                );
                return;
            }

            setCookie("token", "", -1);
            window.location.href = "/login?action=login_required";
        });
    }

    $(document).on('click', '#update-btn', function () {
        let name = $('#name').val();
        let mob = $('#mobile').val();

        if (isText(name) && isMobile(mob)) {
            let data = {};
            data.name = name;
            data.mobile = mob;
            $.ajax({
                url: "../user",
                type: 'PUT',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (result) {
                    $('.alert').hide(500);
                    $('#list-msg').append(
                        '<div class="alert alert-success alert-dismissible fade show">' +
                        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>Congratulations! </strong> Your profile has been succesfully updated.' +
                        '</div>'
                    );
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

                    $('.alert').hide(500);
                    $('#list-msg').append(
                        '<div class="alert alert-danger alert-dismissible fade show">' +
                        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>Oops! </strong> ' + errMsg +
                        '</div>'
                    );
                }
            });
        } else if (!isText(name)) {
            $('.alert').hide(500);
            $('#list-msg').append(
                '<div class="alert alert-danger alert-dismissible fade show">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                '<strong>Oops! </strong>Invalid name' +
                '</div>'
            );
        } else {
            $('.alert').hide(500);
            $('#list-msg').append(
                '<div class="alert alert-danger alert-dismissible fade show">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                '<strong>Oops! </strong> Invalid Mobile number' +
                '</div>'
            );
        }
    });


    $(document).on('click', '#add-btn', function () {
        let email = $('#email').val();
        let mobile = $('#mobile1').val();
        let name = $('#name1').val();
        
        if (isEmail(email) && isMobile(mobile) && isText(name)) {
            let data = {};
            data.email = email;
            data.name = name;
            data.mobile = mobile;
            $.ajax({
                url: "../user/addMember",
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (result) {
                    $('.alert').hide(500);
                    $('#list-msg').append(
                        '<div class="alert alert-success alert-dismissible fade show">' +
                        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>Congratulations! </strong> User succesfully added.' +
                        '</div>'
                    );
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

                    $('.alert').hide(500);
                    $('#list-msg').append(
                        '<div class="alert alert-danger alert-dismissible fade show">' +
                        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>Oops! </strong> ' + errMsg +
                        '</div>'
                    );
                }
            });
        } else  {
            $('.alert').hide(500);
            $('#list-msg').append(
                '<div class="alert alert-danger alert-dismissible fade show">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                '<strong>Oops! </strong>Please fill correct credentials' +
                '</div>'
            );
        }
    });

});