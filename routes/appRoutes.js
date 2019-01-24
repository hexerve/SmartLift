'use strict';
module.exports = function (app) {
    var rimraf = require('rimraf');
    var fs = require('fs');

    var User = require('../controllers/userController');
    var responses = require('../helper/responses');
    var VerifyToken = require('../helper/verifyToken');

    // user Routes
    app.get("/", function (req, res) {
        var error;
        if (req.query.fileErr && req.query.fileErr === "true") {
            error = true;
        } else {
            error = false;
        }
        res.render("dashboard", {
            error: error
        });
    });

    app.get("/login", function (req, res) {
        res.render("login", {
            message: false
        });
    });

    app.get("/resetpass", function (req, res) {
        res.render("resetPass");
    });

    app.get("/profile", function (req, res) {
        res.render("profile");
    });

    app.get("/admin", function (req, res) {
        res.render("admin");
    });

    app.post("/login", User.login);

    app.get("/logout", VerifyToken, User.logout);

    app.post("/register", User.register);

    app.post("/reverify", User.sendVerificationLink);

    app.put("/password/reset", VerifyToken, User.changePassword);

    app.get("/password/forget", function (req, res) {
        res.render("forgetPass");
    });

    app.put("/password/forget", User.forgetPassword);

    app.get("/password/set", function (req, res) {
        res.render("setPass",{
            message: null
        });
    });

    app.put("/password/set", User.setPassword);

    app.get('/verify/email/:token', VerifyToken, User.verify);
    
    app.get("/user", VerifyToken, User.current_user);

    app.put("/user", VerifyToken, User.updatePersonalInfo);

    app.post("/user/addMember", VerifyToken, User.addMember);

    app.get("/adminAcesss/user/:info/:value", VerifyToken, User.getUserData);

    app.get("/adminAcesss/status/:email/:status", VerifyToken, User.changeStatus);

    app.get("/adminAcesss/stats", VerifyToken, User.stats);

    app.get("/adminAcesss/revoke/:email", VerifyToken, User.revoke);

    app.put("/adminAcesss/user", VerifyToken, User.updateUser);

    app.get("/adminAcesss/user/verification", VerifyToken, User.userVerificationList);

    app.put("/adminAcesss/user/verification", VerifyToken, User.userProofVerify);

    app.post("/adminAcesss/register", VerifyToken, User.registerUserByAdmin);

    app.post('/verify/email', User.sendVerificationLink);

    app.get("/download/:filename", function (req, res) {
        var file = "downloads/" + req.params.filename;
        if (fs.existsSync(file)) {
            res.download(file);
        } else {
            res.redirect(301, "../?fileErr=true");
        }
    });

    app.get('/pdf/:file', function (req, res) {
        var data =fs.readFileSync('./public/assets/' + req.params.file);
        res.contentType("application/pdf");
        res.send(data);
    });

    // star routes
    app.get('*', function (req, res) {
        res.redirect(301, "../");
    });

    app.put('*', function (req, res) {
        res.redirect(301, "../");
    });

    app.delete('*', function (req, res) {
        res.redirect(301, "../");
    });

    app.post('*', function (req, res) {
        res.redirect(301, "../");
    });

};