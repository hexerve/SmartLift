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

    $.get("../adminAcesss/user/verification", {},
        function (data, status, xhr) {
            console.log(data);
            let users = data.results;
            if (users.length > 0) {
                $('#user-list').append(
                    '<div id="accordion">' +
                    '</div>'
                )

                for (let i = 0; i < users.length; i++) {
                    let rentAgreement = users[i].rentAgreement.split('.');
                    let proof, proofLink;
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

                    $('#accordion').append(
                        '<div class="card" id="card_' + users[i]._id + '">' +
                        '<div class="card-header" id="heading' + i + '">' +
                        '<h5 class="mb-0 collapsed" data-toggle="collapse" data-target="#collapse' + i + '" aria-expanded="false"' +
                        'aria-controls="collapse' + i + '">' +
                        users[i].email +
                        '<button type="button" id="verify_' + users[i]._id +  '")" class="btn btn-secondary float-md-right verify">Verify</button>' +
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
                // $('#search-msg').append(
                //     '<div class="alert alert-danger alert-dismissible fade show">' +
                //     '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                //     '<strong>Oops! </strong>Network error.</div>'
                // );
                alert("network error");
                return;
            }
        });

        $(document).on('click', '.verify', function(e){
            e.preventDefault();
            e.stopPropagation();
            data = {};
            data.id =this.id.split('_')[1];
            

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
                    $('#card_' + data.id).hide('slow', function(){ $target.remove(); });
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
});