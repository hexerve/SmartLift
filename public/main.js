var err = {
    register: { name: true, mobile: true, floor: true, flat: true, building: true, email: true, password: true },
    login: { email: true, password: true },
    search: {email: true, mobile: true},
    update: {name: true, mobile: true},
    member: {email: true, name: true, mobile: true}
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getFormData(form){
    var unindexed_array = form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

// function isEmail(email) {
//     if (email != "" && email.lastIndexOf('.') != -1 && email.lastIndexOf('@') != -1 &&
//         email.lastIndexOf('.') - email.lastIndexOf("@") > 2) {
//         return true;
//     }
//     return false;
// }

// function isMobile(mobile) {
//     if (isNaN(mobile) || mobile.length < 5) {
//         return false;
//     }
//     return true;
// }

// function isText(text) {
//     if (text.length > 2) {
//         return true;
//     }
//     return false;
// }

// function isPass(pass) {
//     if (pass.length < 8) {
//         return false;
//     }
//     return true;
// }


function validationDisplay(status, field, form) {
    if (status == true) {
        err[form][field] = false;
        $('#' + field + '_' + form).removeClass('is-invalid');
        $('#' + field + '_' + form).addClass('is-valid');
        $('#' + field + '_' + form + '_label').removeClass('text-danger');
        $('#' + field + '_' + form + '_label').addClass('text-success');
    } else {
        err[form][field] = true;
        $('#' + field + '_' + form).removeClass('is-valid');
        $('#' + field + '_' + form).addClass('is-invalid');
        $('#' + field + '_' + form + '_label').removeClass('text-success');
        $('#' + field + '_' + form + '_label').addClass('text-danger');
    }
}

$(function () {

    logout = function() {
        $.ajaxSetup({
            headers: {
                'authorization': getCookie("token")
            }
        });
        $.get("../logout", {},
            function (data, status, xhr) {
    
                setCookie("token", "", -1);
    
            }).fail(function (xhr, status, error) {
                if (xhr.status === 0) {
                    $('.alert').hide(500);
                    // $('#err').append(
                    //     '<div class="alert alert-danger alert-dismissible fade show">' +
                    //     '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                    //     '<strong>Oops! </strong>Network error.</div>'
                    // );
                    alert("network error");
                    return;
                }
                $('.alert').hide(500);
                // $('#err').append(
                //     '<div class="alert alert-danger alert-dismissible fade show">' +
                //     '<button type="button" class="close" data-dismiss="alert">&times;</button>' +
                //     '<strong>Oops! </strong>Some error occured.</div>'
                // );
                alert("Some error occured");
                return;
            });
    };
    
});