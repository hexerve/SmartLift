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
                if(data.results.user.isAdmin === true){
                    window.location = '/admin';
                }

                // let name = data.results.user.name;

                // name = name.charAt(0).toUpperCase() + name.substr(1);

                // $(".username").text(name);

                // currentUserID = data.results.user._id;
            }).fail(function (xhr, status, error) {
            if (xhr.status === 0) {
                alert("Network error");
                return;
            }

            setCookie("token", "", -1);
            window.location.href = "/login";
        });
    }
});