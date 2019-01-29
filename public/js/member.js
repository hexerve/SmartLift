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

                $.get("../user/member/", {},
                    function (data, status, xhr) {
                        console.log(data);
                        let users = data.results;
                        if (users.length > 0) {
                            $('#members').append(
                                '<div id="accordion-stats">' +
                                '</div>'
                            )

                            for (let i = 0; i < users.length; i++) {
                                let proof = '', proofLink = '';

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
                                    '<button type="button" id="remove_' + users[i]._id + '")" class="btn btn-secondary float-md-right remove">Remove</button>' +
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
                            alert("Network error");
                            return;
                        }
                    });
            }).fail(function (xhr, status, error) {
                if (xhr.status === 0) {
                    alert("Network error");
                    return;
                }

                setCookie("token", "", -1);
                window.location.href = "/login?action=login_required";
            });
    }

    $(document).on('click', '#add-btn', function () {
        let data = getFormData($('#create_member'));

        let isErr = Object.values(err.member);
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
            url: "../user/member",
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                alert("Success");
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

    $(document).on('click', '.remove', function (e) {
        e.preventDefault();
        e.stopPropagation();
        data = {};
        data.members = this.id.split('_')[1];


        $.ajax({
            url: "../user/member/",
            type: 'DELETE',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                alert("Success");
                $('#card_' + data.members).hide('slow', function () { $target.remove(); });
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

    $('#email_member').on('keyup', function () {
        let email = $('#email_member').val()
        if (email != "" && email.lastIndexOf('.') != -1 && email.lastIndexOf('@') != -1 &&
            email.lastIndexOf('.') - email.lastIndexOf("@") > 2) {
            validationDisplay(true, 'email', "member");
        } else {
            validationDisplay(false, 'email', "member");
        }
    });

    $('#name_member').on('keyup', function () {
        let name = $('#name_member').val()
        if (name.length < 3) {
            validationDisplay(false, 'name', "member");
        } else if (name.length > 30) {
            validationDisplay(false, 'name', "member");
        } else {
            validationDisplay(true, 'name', "member");
        }
    });

    $('#mobile_member').on('keyup', function () {
        let mobile = $('#mobile_member').val()
        if (isNaN(mobile)) {
            validationDisplay(false, 'mobile', "member");
        } else if (mobile.length < 10) {
            validationDisplay(false, 'mobile', "member");
        } else {
            validationDisplay(true, 'mobile', "member");
        }
    });

});