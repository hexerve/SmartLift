var display, revoke, activate, deactivate, changeStatus, updateUser;

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
                                let proof = '', proofLink = '', verifyButton = '';
                                if (!users[i].isVerified) {
                                    verifyButton = '<button type="button" id="verify_' + users[i]._id + '")" class="btn btn-secondary float-md-right verify">Verify</button>';
                                }

                                if (users[i].rentAgreement) {
                                    let rentAgreement = users[i].rentAgreement.split('.');

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
                            return;
                        }
                    });
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
    //             $('#alert-removal').trigger('click');
    // setTimeout(function () {
    //     $('#message').append(
    //         '<div id="inner-message" class="alert alert-danger">' +
    //         '<button id="alert-removal" type="button" class="close" data-dismiss="alert">&times;</button>' +
    //         'Network error' +
    //         '</div>'
    //     );
    // }, 500);
    //             return;
    //         }
    //     });

    updateUser = function (user) {
        $('#email_updateUser').val(user.email);
        $('#mobile_updateUser').val(user.mobile);
        $('#name_updateUser').val(user.name);
        $('#flat_updateUser').val(user.address.flat);
        $('#floor_updateUser').val(user.address.floor);
        $('#building_updateUser').val(user.address.building);
        $('#isadmin_updateUser').val("" + user.isAdmin);
        $('#session_updateUser').val((user.last_login_timestamp === 0) ? "" : new Date(user.last_login_timestamp).toLocaleString());
        $('#revoke_count').text("revoke(" + user.revoke_count + ")?")
        $('#active_updateUser').val(user.active ? "true" : "false");
        $('[data-toggle="tooltip"]').tooltip();

        $('#revoke_count').attr("onclick", 'revoke("' + user.email + '")')
    }

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
                $('#alert-removal').trigger('click');
                setTimeout(function () {
                    $('#message').append(
                        '<div id="inner-message" class="alert alert-success">' +
                        '<button id="alert-removal" type="button" class="close" data-dismiss="alert">&times;</button>' +
                        'Success' +
                        '</div>'
                    );
                }, 500);
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
    });

    revoke = function (email) {
        $.get("../adminAcesss/revoke/" + email, {},
            function (data, status, xhr) {
                console.log(data);
                $("#revoke").val("");
                $('#alert-removal').trigger('click');
                setTimeout(function () {
                    $('#message').append(
                        '<div id="inner-message" class="alert alert-success">' +
                        '<button id="alert-removal" type="button" class="close" data-dismiss="alert">&times;</button>' +
                        "Success" +
                        '</div>'
                    );
                }, 500);
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

                $('#alert-removal').trigger('click');
                setTimeout(function () {
                    $('#message').append(
                        '<div id="inner-message" class="alert alert-success">' +
                        '<button id="alert-removal" type="button" class="close" data-dismiss="alert">&times;</button>' +
                        "Success" +
                        '</div>'
                    );
                }, 500);
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
        let email = $('#email_search').val();
        $('#email_search').keyup();
        if (err.search.email) {
            $('#alert-removal').trigger('click');
            setTimeout(function () {
                $('#message').append(
                    '<div id="inner-message" class="alert alert-danger">' +
                    '<button id="alert-removal" type="button" class="close" data-dismiss="alert">&times;</button>' +
                    'Please correctly fill all the credentials' +
                    '</div>'
                );
            }, 500);
            return;
        }
        $.get("../adminAcesss/user/email/" + email, {},
            function (data, status, xhr) {
                console.log(data);

                let last_login = data.results.user.last_login_timestamp;

                $('.create-users').css('display', 'none');
                $('.update-users').css('display', 'block');

                updateUser(data.results.user);

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

                console.log(xhr);
            });
    });

    $(document).on('click', '#search-btn-mob', function () {
        $('#mobile_search').keyup();
        if (err.search.mobile) {
            $('#alert-removal').trigger('click');
            setTimeout(function () {
                $('#message').append(
                    '<div id="inner-message" class="alert alert-danger">' +
                    '<button id="alert-removal" type="button" class="close" data-dismiss="alert">&times;</button>' +
                    'please enter a valid mobile' +
                    '</div>'
                );
            }, 500);
            return;
        }
        let mobile = $('#mobile_search').val();
        $.get("../adminAcesss/user/mobile/" + mobile, {},
            function (data, status, xhr) {
                console.log(data);

                $('.create-users').css('display', 'none');
                $('.update-users').css('display', 'block');
                updateUser(data.results.user);

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

                console.log(xhr);
            });
    });

    $(document).on('click', '#update-btn', function () {
        let data = getFormData($('#admin_update'));

        var $inputs = $('#admin_update :input');
        $inputs.each(function (index) {
            $(this).keyup()
        });

        let isErr = Object.values(err.updateUser);
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
            return;
        }

        $.ajax({
            url: "../adminAcesss/user",
            type: 'PUT',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $('#alert-removal').trigger('click');
                setTimeout(function () {
                    $('#message').append(
                        '<div id="inner-message" class="alert alert-success">' +
                        '<button id="alert-removal" type="button" class="close" data-dismiss="alert">&times;</button>' +
                        'Success' +
                        '</div>'
                    );
                }, 500);
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
    });


    $(document).on('click', '#create-btn', function () {
        let data = getFormData($('#admin_register'));

        var $inputs = $('#admin_register :input');
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
            return;
        }

        $.ajax({
            url: "../adminAcesss/register",
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                $('#alert-removal').trigger('click');
                setTimeout(function () {
                    $('#message').append(
                        '<div id="inner-message" class="alert alert-success">' +
                        '<button id="alert-removal" type="button" class="close" data-dismiss="alert">&times;</button>' +
                        'Success' +
                        '</div>'
                    );
                }, 500);
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
    });

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

    $('#email_search').on('keyup', function () {
        let email = $('#email_search').val()
        if (email != "" && email.lastIndexOf('.') != -1 && email.lastIndexOf('@') != -1 &&
            email.lastIndexOf('.') - email.lastIndexOf("@") > 2) {
            validationDisplay(true, 'email', "search");
        } else {
            validationDisplay(false, 'email', "search");
        }
    });

    $('#mobile_search').on('keyup', function () {
        let mobile = $('#mobile_search').val()
        if (isNaN(mobile)) {
            validationDisplay(false, 'mobile', "search");
        } else if (mobile.length < 10) {
            validationDisplay(false, 'mobile', "search");
        } else {
            validationDisplay(true, 'mobile', "search");
        }
    });

    $('#name_updateUser').on('keyup', function () {
        let name = $('#name_updateUser').val()
        if (name.length < 3) {
            validationDisplay(false, 'name', "updateUser");
        } else if (name.length > 30) {
            validationDisplay(false, 'name', "updateUser");
        } else {
            validationDisplay(true, 'name', "updateUser");
        }
    });

    $('#mobile_updateUser').on('keyup', function () {
        let mobile = $('#mobile_updateUser').val()
        if (isNaN(mobile)) {
            validationDisplay(false, 'mobile', "updateUser");
        } else if (mobile.length < 10) {
            validationDisplay(false, 'mobile', "updateUser");
        } else {
            validationDisplay(true, 'mobile', "updateUser");
        }
    });

    $('#floor_updateUser').on('keyup', function () {
        let floor = $('#floor_updateUser').val()
        if (isNaN(floor)) {
            validationDisplay(false, 'floor', "updateUser");
        } else {
            validationDisplay(true, 'floor', "updateUser");
        }
    });

    $('#flat_updateUser').on('keyup', function () {
        let flat = $('#flat_updateUser').val()
        if (isNaN(flat)) {
            validationDisplay(false, 'flat', "updateUser");
        } else {
            validationDisplay(true, 'flat', "updateUser");
        }
    });

    $('#building_updateUser').on('keyup', function () {
        let building = $('#building_updateUser').val()
        if (building.length < 3) {
            validationDisplay(false, 'building', "updateUser");
        } else if (building.length > 30) {
            validationDisplay(false, 'building', "updateUser");
        } else {
            validationDisplay(true, 'building', "updateUser");
        }
    });

    $('#email_updateUser').on('keyup', function () {
        let email = $('#email_updateUser').val()
        if (email != "" && email.lastIndexOf('.') != -1 && email.lastIndexOf('@') != -1 &&
            email.lastIndexOf('.') - email.lastIndexOf("@") > 2) {
            validationDisplay(true, 'email', "updateUser");
        } else {
            validationDisplay(false, 'email', "updateUser");
        }
    });


});