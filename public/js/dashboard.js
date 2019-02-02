let expires, otpExpirer;

$(function () {
    $('#admin').hide();
    $(".guest").show();
    $(".logged").hide();
    if (getCookie("token") === "") {
        window.location.href = "/login";
    } else {
        $.ajaxSetup({
            headers: {
                'authorization': getCookie("token")
            }
        });
        $.get("../user", {},
            function (data, status, xhr) {
                console.log(data);
                if (data.results.user.lift_otp) {
                    $('#OTP').text(data.results.user.lift_otp.otp);
                    expires = new Date(data.results.user.lift_otp.expires) - new Date().getTime();
                    otpExpirer = setTimeout(function () {
                        $('#OTP').text('****')
                    }, expires);
                }

                // let name = data.results.user.name;

                // name = name.charAt(0).toUpperCase() + name.substr(1);

                // $(".username").text(name);

                // currentUserID = data.results.user._id;
            }).fail(function (xhr, status, error) {
                if (xhr.status === 0) {
                    $('#alert-removal').trigger('click');
                    setTimeout(function () {
                        $('#message').append(
                            '<div id="inner-message" class="alert alert-danger">' +
                            '<button id="alert-removal" type="button" class="close" data-dismiss="alert">&times;</button>' +
                            'Network error' +
                            '</div>'
                        );
                    }, 500);
                    return;
                }

                setCookie("token", "", -1);
                window.location.href = "/login";
            });
    }

    $(document).on('click', '#getOTP', function () {

        $.get("../getOTP", {},
            function (data, status, xhr) {
                console.log(data);
                clearTimeout(otpExpirer);
                expires = new Date(data.results.lift_otp.expires) - new Date().getTime();
                otpExpirer = setTimeout(function () {
                    $('#OTP').text('****')
                }, expires);
                $('#OTP').text(data.results.lift_otp.otp);

            }).fail(function (xhr, status, error) {
                if (xhr.status === 0) {
                    $('#alert-removal').trigger('click');
                    setTimeout(function () {
                        $('#message').append(
                            '<div id="inner-message" class="alert alert-danger">' +
                            '<button id="alert-removal" type="button" class="close" data-dismiss="alert">&times;</button>' +
                            'Network error' +
                            '</div>'
                        );
                    }, 500);
                    return;
                } else {
                    errMsg = JSON.parse(xhr.responseText).message;
                    errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);

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
    })
});