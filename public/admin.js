var display, revoke, activate, deactivate, changeStatus;

$(function () {
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
                if (data.results.user.isAdmin === false) {
                    window.location = '/';
                }
                // let name = data.results.user.name;

                // name = name.charAt(0).toUpperCase() + name.substr(1);

                // $(".username").text(name);

                // currentUserID = data.results.user._id;
                $.get("../adminAcesss/stats", {},
                    function (data, status, xhr) {
                        console.log(data);
                        let users = data.results;
                        if (users.length > 0) {
                            $('#stats').append(
                                '<div id="accordion-stats">' +
                                '</div>'
                            )

                            for (let i = 0; i < users.length; i++) {
                                let rentAgreement = users[i].rentAgreement.split('.');
                                let proof = '', proofLink = '', verifyButton = '';
                                if(!users[i].isVerified){
                                    verifyButton = '<button type="button" id="verify_' + users[i]._id + '")" class="btn btn-secondary float-md-right verify">Verify</button>';
                                }

                                if ((rentAgreement[rentAgreement.length - 1]).toLowerCase() === "pdf") {
                                    proofLink = 'document: <a href="http://localhost:3000/pdf/' + users[i].rentAgreement + '" target="_blank"> click here to open</a>';
                                    proof = '<object data="http://localhost:3000/pdf/' + users[i].rentAgreement + '" type="application/pdf" width="100%" height="800px">' +
                                        '<p>It appears you don\'t have a PDF plugin for this browser.' +
                                        'No biggie... you can <a href="' + users[i].rentAgreement + '">click here to' +
                                        'download the PDF file.</a></p>' +
                                        '</object>';
                                } else {
                                    proofLink = 'document: <a href="assets/' + users[i].rentAgreement + '" target="_blank"> click here to open</a>';
                                    proof = '<img src="assets/' + users[i].rentAgreement + '" class="img-fluid" />'
                                }

                                $('#accordion-stats').append(
                                    '<div class="card" id="card_' + users[i]._id + '">' +
                                    '<div class="card-header" id="heading' + i + '">' +
                                    '<h5 class="mb-0 collapsed" data-toggle="collapse" data-target="#collapse' + i + '" aria-expanded="false"' +
                                    'aria-controls="collapse' + i + '">' +
                                    users[i].email +
                                    verifyButton +
                                    '</h5>' +
                                    '</div>' +
                                    '<div id="collapse' + i + '" class="collapse" aria-labelledby="heading' + i + '" data-parent="#accordion">' +
                                    '<div class="card-body">' +
                                    '<div class="row">' +
                                    '<div class="col-md-4">' +
                                    users[i].email +
                                    '</div>' +
                                    '<div class="col-md-4">' +
                                    users[i].name +
                                    '</div>' +
                                    '<div class="col-md-4">' +
                                    users[i].mobile +
                                    '</div>' +
                                    '<div class="col-md-4">' +
                                    'flat: ' + users[i].address.flat +
                                    '</div>' +
                                    '<div class="col-md-4">' +
                                    'floor: ' + users[i].address.floor +
                                    '</div>' +
                                    '<div class="col-md-4">' +
                                    'building: ' + users[i].address.building +  
                                    '</div>' +
                                    '<div class="col-md-12">' +
                                    proofLink +
                                    '</div>' +
                                    '</div>' +
                                    proof +
                                    '</div>' +
                                    '</div>' +
                                    '</div>'
                                );
                            }
                        }
                    }).fail(function (xhr, status, error) {
                        if (xhr.status === 0) {
                            $('.alert').hide(500);
                            $('#search-msg').append(
                                '<div class="alert alert-danger alert-dismissible fade show">' +
                                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                                '<strong>Oops! </strong>Network error.</div>'
                            );
                            return;
                        }
                    });
            }).fail(function (xhr, status, error) {
                if (xhr.status === 0) {
                    $('.alert').hide(500);
                    // $('#pass-msg').append(
                    //     '<div class="alert alert-danger alert-dismissible fade show">' +
                    //     '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    //     '<strong>Oops! </strong>Network error.</div>'
                    // );
                    alert("no network access");
                    return;
                }

                setCookie("token", "", -1);
                window.location.href = "/login";
            });
    }

    // $.get("../adminAcesss/user/verification", {},
    //     function (data, status, xhr) {
    //         console.log(data);
    //         let users = data.results;
    //         if (users.length > 0) {
    //             $('#user-list').append(
    //                 '<div id="accordion">' +
    //                 '</div>'
    //             )

    //             for (let i = 0; i < users.length; i++) {
    //                 let rentAgreement = users[i].rentAgreement.split('.');
    //                 let proof, proofLink;
    //                 if ((rentAgreement[rentAgreement.length - 1]).toLowerCase() === "pdf") {
    //                     proofLink = 'document: <a href="http://localhost:3000/pdf/' + users[i].rentAgreement + '" target="_blank"> click here to open</a>';
    //                     proof = '<object data="http://localhost:3000/pdf/' + users[i].rentAgreement + '" type="application/pdf" width="100%" height="800px">' +
    //                         '<p>It appears you don\'t have a PDF plugin for this browser.' +
    //                         'No biggie... you can <a href="' + users[i].rentAgreement + '">click here to' +
    //                         'download the PDF file.</a></p>' +
    //                         '</object>';
    //                 } else {
    //                     proofLink = 'document: <a href="assets/' + users[i].rentAgreement + '" target="_blank"> click here to open</a>';
    //                     proof = '<img src="assets/' + users[i].rentAgreement + '" class="img-fluid" />'
    //                 }

    //                 $('#accordion').append(
    //                     '<div class="card" id="card_' + users[i]._id + '">' +
    //                     '<div class="card-header" id="heading' + i + '">' +
    //                     '<h5 class="mb-0 collapsed" data-toggle="collapse" data-target="#collapse' + i + '" aria-expanded="false"' +
    //                     'aria-controls="collapse' + i + '">' +
    //                     users[i].email +
    //                     '<button type="button" id="verify_' + users[i]._id + '")" class="btn btn-secondary float-md-right verify">Verify</button>' +
    //                     '</h5>' +
    //                     '</div>' +
    //                     '<div id="collapse' + i + '" class="collapse" aria-labelledby="heading' + i + '" data-parent="#accordion">' +
    //                     '<div class="card-body">' +
    //                     '<div class="row">' +
    //                     '<div class="col-md-4">' +
    //                     users[i].email +
    //                     '</div>' +
    //                     '<div class="col-md-4">' +
    //                     users[i].name +
    //                     '</div>' +
    //                     '<div class="col-md-4">' +
    //                     users[i].mobile +
    //                     '</div>' +
    //                     '<div class="col-md-4">' +
    //                     'flat: ' + users[i].address.flat +
    //                     '</div>' +
    //                     '<div class="col-md-4">' +
    //                     'floor: ' + users[i].address.floor +
    //                     '</div>' +
    //                     '<div class="col-md-4">' +
    //                     'building: ' + users[i].address.building +
    //                     '</div>' +
    //                     '<div class="col-md-12">' +
    //                     proofLink +
    //                     '</div>' +
    //                     '</div>' +
    //                     proof +
    //                     '</div>' +
    //                     '</div>' +
    //                     '</div>'
    //                 );
    //             }
    //         }
    //     }).fail(function (xhr, status, error) {
    //         if (xhr.status === 0) {
    //             // $('#search-msg').append(
    //             //     '<div class="alert alert-danger alert-dismissible fade show">' +
    //             //     '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
    //             //     '<strong>Oops! </strong>Network error.</div>'
    //             // );
    //             alert("network error");
    //             return;
    //         }
    //     });

    $(document).on('click', '.verify', function (e) {
        e.preventDefault();
        e.stopPropagation();
        data = {};
        data.id = this.id.split('_')[1];


        $.ajax({
            url: "../adminAcesss/user/verification",
            type: 'PUT',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                // $('.alert').hide(500);
                // $('#list-msg').append(
                //     '<div class="alert alert-success alert-dismissible fade show">' +
                //     '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                //     '<strong>Congratulations! </strong> User has been succesfully updated.' +
                //     '</div>'
                // );
                alert("success");
                $('#card_' + data.id).hide('slow', function () { $target.remove(); });
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

                // $('.alert').hide(500);
                // $('#list-msg').append(
                //     '<div class="alert alert-danger alert-dismissible fade show">' +
                //     '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                //     '<strong>Oops! </strong> ' + errMsg +
                //     '</div>'
                // );
                alert(errMsg);
            }
        });
    });

    revoke = function (email) {
        $.get("../adminAcesss/revoke/" + email, {},
            function (data, status, xhr) {
                console.log(data);
                $("#revoke").val("");
                alert("revoked successfully");
            }).fail(function (xhr, status, error) {
                if (xhr.status === 0) {
                    $('.alert').hide(500);
                    $('#search-msg').append(
                        '<div class="alert alert-danger alert-dismissible fade show">' +
                        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>Oops! </strong>Network error.</div>'
                    );
                    return;
                } else {
                    errMsg = JSON.parse(xhr.responseText).message;
                    errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);

                    $('.alert').hide(500);
                    $('#search-msg').append(
                        '<div class="alert alert-danger alert-dismissible fade show">' +
                        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>Oops! </strong>' + errMsg + '</div>'
                    );
                }

                console.log(xhr);
            });
    };

    activate = function (email) {
        changeStatus(email, true);
    }

    deactivate = function (email) {
        changeStatus(email, false);
    }

    changeStatus = function (email, user_status) {
        $.get("../adminAcesss/status/" + email + "/" + user_status, {},
            function (data, status, xhr) {
                console.log(data);
                $('#status').text(user_status ? "active" : "deactive");
                let func = user_status ? "deactivate" : "activate";
                $('#status').attr("onclick", func + '("' + email + '")')

                alert("status updated!");
            }).fail(function (xhr, status, error) {
                if (xhr.status === 0) {
                    $('.alert').hide(500);
                    $('#search-msg').append(
                        '<div class="alert alert-danger alert-dismissible fade show">' +
                        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>Oops! </strong>Network error.</div>'
                    );
                    return;
                } else {
                    errMsg = JSON.parse(xhr.responseText).message;
                    errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);

                    $('.alert').hide(500);
                    $('#search-msg').append(
                        '<div class="alert alert-danger alert-dismissible fade show">' +
                        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>Oops! </strong>' + errMsg + '</div>'
                    );
                }

                console.log(xhr);
            });
    };


    $(document).on('click', '#create', function () {
        $('.update-users').css('display', 'none');
        $('.create-users').css('display', 'block');
    });

    $(document).on('click', '#update', function () {
        $('.update-users').css('display', 'block');
        $('.create-users').css('display', 'none');
    });

    $(document).on('click', '#search-btn', function () {
        let email = $('#email').val();
        $.get("../adminAcesss/user/email/" + email, {},
            function (data, status, xhr) {
                console.log(data);

                let last_login = data.results.user.last_login_timestamp;

                $('.create-users').css('display', 'none');
                $('.update-users').css('display', 'block');

                $('#email1').val(data.results.user.email);
                $('#mob1').val(data.results.user.mobile);
                $('#name1').val(data.results.user.name);
                $('#flat1').val(data.results.user.address.flat);
                $('#floor1').val(data.results.user.address.floor);
                $('#building1').val(data.results.user.address.building);
                $('#isadmin1').val("" + data.results.user.isAdmin);
                $('#revoke').val((last_login === 0) ? "" : new Date(last_login).toLocaleString());
                $('#revoke_count').text("revoke(" + data.results.user.revoke_count + ")?")
                $('#status').text(data.results.user.active ? "active" : "deactive");
                $('#timestamp').attr('title', "" + new Date(data.results.user.expiresOn));
                $('[data-toggle="tooltip"]').tooltip();

                let func = data.results.user.active ? "deactivate" : "activate";
                $('#revoke_count').attr("onclick", 'revoke("' + data.results.user.email + '")')
                $('#status').attr("onclick", func + '("' + data.results.user.email + '")')

            }).fail(function (xhr, status, error) {
                if (xhr.status === 0) {
                    $('.alert').hide(500);
                    $('#search-msg').append(
                        '<div class="alert alert-danger alert-dismissible fade show">' +
                        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>Oops! </strong>Network error.</div>'
                    );
                    return;
                } else {
                    errMsg = JSON.parse(xhr.responseText).message;
                    errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);

                    $('.alert').hide(500);
                    $('#search-msg').append(
                        '<div class="alert alert-danger alert-dismissible fade show">' +
                        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>Oops! </strong>' + errMsg + '</div>'
                    );
                }

                console.log(xhr);
            });
    });

    $(document).on('click', '#search-btn-mob', function () {
        let mobile = $('#mob').val();
        $.get("../adminAcesss/user/mobile/" + mobile, {},
            function (data, status, xhr) {
                console.log(data);

                $('.create-users').css('display', 'none');
                $('.update-users').css('display', 'block');

                $('#email1').val(data.results.user.email);
                $('#name').val(data.results.user.name);
                $('#plan').val(data.results.user.plan);
                $('#isadmin').val("" + data.results.user.isAdmin);
                $('#days').val(data.results.user.expires);
                $('#timestamp').attr('title', "" + new Date(data.results.user.expiresOn));
                $('[data-toggle="tooltip"]').tooltip();

            }).fail(function (xhr, status, error) {
                if (xhr.status === 0) {
                    $('.alert').hide(500);
                    $('#search-msg').append(
                        '<div class="alert alert-danger alert-dismissible fade show">' +
                        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>Oops! </strong>Network error.</div>'
                    );
                    return;
                } else {
                    errMsg = JSON.parse(xhr.responseText).message;
                    errMsg = errMsg.charAt(0).toUpperCase() + errMsg.substr(1);

                    $('.alert').hide(500);
                    $('#search-msg').append(
                        '<div class="alert alert-danger alert-dismissible fade show">' +
                        '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                        '<strong>Oops! </strong>' + errMsg + '</div>'
                    );
                }

                console.log(xhr);
            });
    });

    $(document).on('click', '#update-btn', function () {
        let data = {};
        data.email = $('#email1').val();
        data.name = $('#name1').val();
        data.mobile = $('#mob1').val();
        data.address = {
            flat: $('#flat1').val(),
            floor: $('#floor1').val(),
            building: $('#building1').val()
        };
        data.isAdmin = $('#isadmin1').val();

        $.ajax({
            url: "../adminAcesss/user",
            type: 'PUT',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $('.alert').hide(500);
                $('#list-msg').append(
                    '<div class="alert alert-success alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Congratulations! </strong> User has been succesfully updated.' +
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
    });


    $(document).on('click', '#create-btn', function () {
        let data = {};
        data.email = $('#email2').val();
        data.name = $('#name2').val();
        data.mobile = $('#mobile2').val();
        data.password = $('#pass2').val();
        data.plan = $('#plan2').val();
        data.isAdmin = $('#isadmin2').val();
        data.days = $('#days2').val();

        if (data.days <= 0) {
            $('.alert').hide(500);
            $('#register-msg').append(
                '<div class="alert alert-danger alert-dismissible fade show">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                '<strong>Oops! </strong> Plan end must be atleast of 1 day' +
                '</div>'
            );
            return;
        }

        if (!isText(data.name)) {
            $('.alert').hide(500);
            $('#register-msg').append(
                '<div class="alert alert-danger alert-dismissible fade show">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                '<strong>Oops! </strong> Invalid name(must be greater than 3 characters)' +
                '</div>'
            );
            return;
        }

        if (!isEmail(data.email)) {
            $('.alert').hide(500);
            $('#register-msg').append(
                '<div class="alert alert-danger alert-dismissible fade show">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                '<strong>Oops! </strong> Invalid email.' +
                '</div>'
            );
            return;
        }

        if (!isMobile(data.mobile)) {
            $('.alert').hide(500);
            $('#register-msg').append(
                '<div class="alert alert-danger alert-dismissible fade show">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                '<strong>Oops! </strong> Invalid mobile.' +
                '</div>'
            );
            return;
        }

        if (!isPass(data.password)) {
            $('.alert').hide(500);
            $('#register-msg').append(
                '<div class="alert alert-danger alert-dismissible fade show">' +
                '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                '<strong>Oops! </strong> Invalid password(password must be greater than 8 characters)' +
                '</div>'
            );
            return;
        }


        $.ajax({
            url: "../adminAcesss/register",
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $('.alert').hide(500);
                $('#register-msg').append(
                    '<div class="alert alert-success alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Congratulations! </strong> User has been succesfully created.' +
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
                $('#register-msg').append(
                    '<div class="alert alert-danger alert-dismissible fade show">' +
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    '<strong>Oops! </strong> ' + errMsg +
                    '</div>'
                );
            }
        });
    });

});