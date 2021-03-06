var mongoose = require('mongoose');
var User = require('../models/userModel');
User = mongoose.model('user');

var Verification = require('../models/verificationModel');
Verification = mongoose.model('verification');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

var formidable = require('formidable')
var rimraf = require('rimraf')
var fs = require('fs')

Mail = require('../helper/mail');
var responses = require('../helper/responses');
var AuthoriseUser = require('../helper/authoriseUser');

let addMemberToList = function (userId, memberId) {
    User.findByIdAndUpdate(userId, {
        $push: {
            members: mongoose.Types.ObjectId(memberId)
        }
    }, function (err, res) {
        if (err) console.log(err);
    })
}

let otp = function () {
    var val = Math.floor(1000 + Math.random() * 9000);
    return val;
}

let minuteFromNow = function () {
    var timeObject = new Date();
    timeObject.setTime(timeObject.getTime() + 1000 * 60);
    return timeObject;
};


module.exports.register = function (req, res) {

    //  console.log(req)
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (files.rentAgreement == undefined || files.rentAgreement.size === 0) {
            console.log("no file", files);
            return responses.errorMsg(res, 400, "Bad Request", "validation failed.", "attachment required");
        }
        var oldpath = files.rentAgreement.path;
        var name = files.rentAgreement.name.split('.');
        name = name[name.length - 1];
        var newpath = '' + new Date().getTime() + (Math.floor(Math.random() * 1000)) + '.' + name;
        fs.rename(oldpath, 'public/assets/' + newpath, function (err) {
            if (err)
                console.log(err);
        });

        var hashedPassword = bcrypt.hashSync(fields.password, 8);
        console.log(fields)
        fields.password = hashedPassword;
        fields.isAdmin = false;
        fields.rentAgreement = newpath;

        User.create(fields,
            function (err, user) {
                if (err) {
                    rimraf('public/assets/' + newpath, function () { });

                    if ((err.name && err.name == "UserExistsError") || (err.code && err.code == 11000)) {
                        return responses.errorMsg(res, 409, "Conflict", "user already exists.", null);

                    } else if (err.name && err.name == "ValidationError") {
                        errors = {
                            "index": Object.keys(err.errors)
                        };
                        return responses.errorMsg(res, 400, "Bad Request", "validation failed.", errors);

                    } else if (err.name && err.name == "CastError") {
                        errors = {
                            "index": err.path
                        };
                        return responses.errorMsg(res, 400, "Bad Request", "cast error.", errors);

                    } else {
                        console.log(err);
                        return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                    }
                }

                // create a token
                var token = jwt.sign({
                    id: user._id
                }, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });

                Verification.create({
                    userID: user._id,
                    key: token
                },
                    function (err, verification) {
                        if (err) {
                            return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                        } else {

                            var link = 'localhost:3000/verify/email/' + token;

                            Mail.verification_mail(req.body.email, link);

                            return responses.successMsg(res, {
                                email: req.body.email
                            });
                        }
                    });

            });

    });
};

module.exports.login = function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {

        if (err) {
            console.log(err);
            return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
        }

        if (!user) {
            return responses.errorMsg(res, 404, "Not Found", "user not found", null);
        }

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
            errors = {
                auth: false,
                token: null,
                "msg": null
            };
            return responses.errorMsg(res, 401, "Unauthorized", "incorrect password.", errors);
        }

        if (!user.isVerifiedEmail) {
            errors = {
                auth: false,
                token: null,
                "msg": null
            };
            return responses.errorMsg(res, 401, "Unauthorized", "Verify your account to login.", errors);
        }

        if (!user.active) {
            errors = {
                auth: false,
                token: null,
                "msg": null
            };
            return responses.errorMsg(res, 401, "Unauthorized", "Your account has been deactivated.", errors);
        }

        if (new Date(user.last_login_timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000) {
            return responses.errorMsg(res, 412, "Precondition Failed", "You are already logged in on another device.", null);
        }

        User.findByIdAndUpdate(user._id, {
            last_login_timestamp: Date.now()
        }, function (err, res) {
            if (err) {
                console.log(err);
            }
        });

        var token = jwt.sign({
            id: user._id
        }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });

        results = {
            auth: true,
            token: token,
            admin: user.isAdmin
        };
        return responses.successMsg(res, results);
    });
};

module.exports.logout = function (req, res) {
    AuthoriseUser.getUser(req, res, function (user) {
        user.password = undefined;
        user.__v = undefined;
        results = {
            user: user
        };
        User.findByIdAndUpdate(user._id, {
            last_login_timestamp: undefined
        }, function (err, result) {
            if (err) {
                console.log(err);
                return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
            }
            return responses.successMsg(res, null);
        });
    });
};


module.exports.current_user = function (req, res) {
    AuthoriseUser.getUser(req, res, function (user) {
        user.password = undefined;
        user.__v = undefined;
        if(user.lift_otp && user.lift_otp.expires >= Date.now()){
            
        } else {
            user.lift_otp = undefined;
        }
        results = {
            user: user
        };
        return responses.successMsg(res, results);
    });
};

module.exports.stats = function (req, res) {
    AuthoriseUser.getUser(req, res, function (user) {
        if (user.isAdmin) {
            User.aggregate([
                // { $match : { isAdmin: false }},
                { "$sort": { "isVerified": 1 } },
                { "$project": { __v: 0, password: 0 } },
            ]).exec(function (err, users) {
                if (err) {
                    console.log(err);
                    return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                }

                return responses.successMsg(res, users);
            });
        } else {
            return responses.errorMsg(res, 401, "Unauthorized", "failed to authenticate token.", null);
        }
    });
};

module.exports.changePassword = function (req, res) {
    if (!req.id || req.id.length !== 24) {
        return responses.errorMsg(res, 401, "Unauthorized", "failed to authenticate token.", null);
    }

    User.findById(req.id, function (err, user) {
        if (!user) {
            return responses.errorMsg(res, 404, "Not Found", "user not found.", errors);
        }

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid)
            results = {
                user: user
            };
        if (!passwordIsValid) {
            errors = {
                auth: false,
                token: null,
                "msg": null
            };
            return responses.errorMsg(res, 401, "Unauthorized", "incorrect password.", errors);
        }

        if (!user.isVerifiedEmail) {
            errors = {
                auth: false,
                token: null,
                "msg": null
            };
            return responses.errorMsg(res, 401, "Unauthorized", "Verify your account to login.", errors);
        }

        updatePassword(user.id, req.body.newPassword, function (result) {
            if (result) {
                return responses.successMsg(res, null);

            } else {
                return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
            }
        });

    });
};

module.exports.verify = function (req, res) {
    if (!req.id || req.id.length !== 24) {
        //return responses.errorMsg(res, 400, "Bad Request", "incorrect user id.");
        res.render('login', {
            message: 'err',
            errText: 'Incorrect User Id'
        });
    }
    Verification.findOneAndRemove({
        userID: req.id
    }, function (err, verified) {
        if (err) {
            // return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
            res.render('login', {
                message: 'err',
                errText: 'Some error has occured'
            });
        }
        if (!verified) {
            //return responses.errorMsg(res, 410, "Gone", "link has been expired.", null);
            res.render('login', {
                message: 'err',
                errText: 'Link has been expired'
            });
        } else {
            if (verified.type && verified.type === "pass") {
                AuthoriseUser.getUser(req, res, function (user) {
                    if (!user) {
                        //return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                        res.render('login', {
                            message: 'err',
                            errText: 'Some error has occured'
                        });
                    }
                    var token = jwt.sign({
                        email: user.email,
                        user: user._id,
                        auth: true,
                        type: "pass"
                    }, config.secret, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                    results = {
                        auth: true,
                        token: token
                    };
                    res.render("setPass", {
                        message: JSON.stringify(results)
                    });
                });
            } else {

                let time = new Date();
                User.findOneAndUpdate({
                    _id: req.id
                }, {
                        isVerifiedEmail: true,
                    }, function (err, user) {
                        if (err) {
                            // return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                            res.render('login', {
                                message: 'err',
                                errText: 'Some error occured'
                            });
                        }

                        if (!user) {
                            return responses.errorMsg(res, 404, "Not Found", "user not found.", null);
                        }
                        user.email_verification = true;
                        return res.render("login", {
                            message: "verified"
                        });
                    });
            }
        }
    });
};

function updatePassword(id, pass, callback) {
    var hashedPassword = bcrypt.hashSync(pass, 8);
    User.findOneAndUpdate({
        _id: id,
    }, {
            password: hashedPassword
        },
        function (err, user) {
            if (err) {
                callback(false);
            }
            Mail.passUpdate_mail(user.email);
            callback(true);
        });
}


module.exports.setPassword = function (req, res) {
    var token = req.headers.authorization || req.params.token;
    if (!token) {
        let errors = {
            auth: false
        };
        return responses.errorMsg(res, 403, "Forbidden", "no token provided.", errors);
    }

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err || !(decoded.auth && decoded.type && decoded.type === "pass")) {
            return responses.errorMsg(res, 401, "Unauthorized", "failed to authenticate token.", null);
        }

        let id = decoded.user;
        updatePassword(id, req.body.newPassword, function (result) {
            if (result) {
                return responses.successMsg(res, null);

            } else {
                return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
            }
        });

    });

};

module.exports.forgetPassword = function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {

        if (err) {
            return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
        }

        if (!user) {
            return responses.errorMsg(res, 404, "Not Found", "user not found.", null);
        }

        var token = jwt.sign({
            id: user._id
        }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });

        Verification.findOneAndUpdate({
            userID: user._id
        }, {
                key: token,
                type: "pass"
            },
            function (err, verification) {
                if (err) {
                    return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                } else {
                    if (!verification) {
                        Verification.create({
                            key: token,
                            userID: user._id,
                            type: "pass"
                        },
                            function (err, verification) {
                                if (err) {
                                    return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                                }
                                user.password = undefined;

                                var link = 'localhost:3000/verify/email/' + token;

                                Mail.forgetPass_mail(req.body.email, link);

                                return responses.successMsg(res, null);

                            });
                    } else {
                        user.password = undefined;

                        var link = 'localhost:3000/verify/email/' + token;

                        Mail.forgetPass_mail(req.body.email, link);

                        return responses.successMsg(res, null);

                    }
                }
            });
    });
};

module.exports.sendVerificationLink = function (req, res) {
    console.log(req.body.email)
    User.findOne({
        email: req.body.email
    }, function (err, user) {

        if (err) {
            return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
        }

        if (!user) {
            return responses.errorMsg(res, 404, "Not Found", "user not found.", null);
        }

        if (user.isVerifiedEmail !== false) {
            return responses.errorMsg(res, 208, "Already Reported", "already verified.", null);
        } else {
            var token = jwt.sign({
                id: user._id
            }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });

            Verification.findOneAndUpdate({
                email: req.body.email
            }, {
                    key: token
                },
                function (err, verification) {
                    if (err) {
                        return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                    } else {
                        user.password = undefined;

                        var link = 'localhost:3000/verify/email/' + token;

                        Mail.verification_mail(req.body.email, link);
                        return responses.successMsg(res, null);
                    }
                });
        }
    });
};


module.exports.getUserData = function (req, res) {
    AuthoriseUser.getUser(req, res, function (user) {
        user.password = undefined;
        user.__v = undefined;

        let data = {
        };

        if (req.params.info == "email") {
            data[req.params.info] = req.params.value;
        } else if (req.params.info == "mobile") {
            data[req.params.info] = req.params.value;
        } else {
            return responses.errorMsg(res, 422, "Unprocessable Entity", "invalid data.", null);
        }

        if (user.isAdmin) {
            User.findOne(
                data,
                {
                    password: 0,
                    __v: 0
                }, function (err, user) {
                    if (err) {
                        console.log(err);
                        return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                    }

                    if (!user) {
                        return responses.errorMsg(res, 404, "Not Found", "user not found.", null);
                    }

                    return responses.successMsg(res, { user });
                });

        } else {
            return responses.errorMsg(res, 401, "Unauthorized", "failed to authenticate token.", null);
        }

    });
}

module.exports.updateUser = function (req, res) {
    AuthoriseUser.getUser(req, res, function (user) {
        user.password = undefined;
        user.__v = undefined;

        if (user.isAdmin) {
            User.findOneAndUpdate({
                email: req.body.email
            },
                {
                    $set: req.body
                },
                function (err, user) {
                    if (err) {
                        if (err.name && err.name == "ValidationError") {
                            errors = {
                                "index": Object.keys(err.errors)
                            };
                            return responses.errorMsg(res, 400, "Bad Request", "validation failed.", errors);

                        } else if (err.name && err.name == "CastError") {
                            errors = {
                                "index": err.path
                            };
                            return responses.errorMsg(res, 400, "Bad Request", "cast error.", errors);

                        } else {
                            console.log(err);
                            return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                        }
                    }
                    if (!user) {
                        return responses.errorMsg(res, 404, "Not Found", "user not found", null);
                    }
                    return responses.successMsg(res, null);
                });

        } else {
            return responses.errorMsg(res, 401, "Unauthorized", "failed to authenticate token.", null);
        }

    });
};

module.exports.revoke = function (req, res) {
    AuthoriseUser.getUser(req, res, function (user) {
        user.password = undefined;
        user.__v = undefined;

        if (user.isAdmin) {
            User.findOneAndUpdate({
                email: req.params.email
            },
                {
                    last_login_timestamp: undefined,
                    $inc: {
                        revoke_count: 1
                    }
                },
                function (err, user) {
                    if (err) {
                        if (err.name && err.name == "ValidationError") {
                            errors = {
                                "index": Object.keys(err.errors)
                            };
                            return responses.errorMsg(res, 400, "Bad Request", "validation failed.", errors);

                        } else if (err.name && err.name == "CastError") {
                            errors = {
                                "index": err.path
                            };
                            return responses.errorMsg(res, 400, "Bad Request", "cast error.", errors);

                        } else {
                            console.log(err);
                            return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                        }
                    }
                    if (!user) {
                        return responses.errorMsg(res, 404, "Not Found", "user not found", null);
                    }
                    return responses.successMsg(res, null);
                });
        } else {
            return responses.errorMsg(res, 401, "Unauthorized", "failed to authenticate token.", null);
        }
    });
};

module.exports.changeStatus = function (req, res) {
    AuthoriseUser.getUser(req, res, function (user) {
        user.password = undefined;
        user.__v = undefined;

        if (user.isAdmin) {
            User.findOneAndUpdate({
                email: req.params.email
            },
                {
                    active: req.params.status
                },
                function (err, user) {
                    if (err) {
                        if (err.name && err.name == "ValidationError") {
                            errors = {
                                "index": Object.keys(err.errors)
                            };
                            return responses.errorMsg(res, 400, "Bad Request", "validation failed.", errors);

                        } else if (err.name && err.name == "CastError") {
                            errors = {
                                "index": err.path
                            };
                            return responses.errorMsg(res, 400, "Bad Request", "cast error.", errors);

                        } else {
                            console.log(err);
                            return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                        }
                    }
                    if (!user) {
                        return responses.errorMsg(res, 404, "Not Found", "user not found", null);
                    }
                    return responses.successMsg(res, null);
                });
        } else {
            return responses.errorMsg(res, 401, "Unauthorized", "failed to authenticate token.", null);
        }
    });
};

module.exports.registerUserByAdmin = function (req, res) {
    AuthoriseUser.getUser(req, res, function (user) {
        user.password = undefined;
        user.__v = undefined;

        if (user.isAdmin) {

            var hashedPassword = bcrypt.hashSync(req.body.password, 8);

            req.body.password = hashedPassword;
            req.body.isVerifiedEmail = true;
            req.body.isVerified = true;

            User.create(req.body,
                function (err, user) {
                    if (err) {

                        if ((err.name && err.name == "UserExistsError") || (err.code && err.code == 11000)) {
                            return responses.errorMsg(res, 409, "Conflict", "user already exists.", null);

                        } else if (err.name && err.name == "ValidationError") {
                            errors = {
                                "index": Object.keys(err.errors)
                            };
                            return responses.errorMsg(res, 400, "Bad Request", "validation failed.", errors);

                        } else if (err.name && err.name == "CastError") {
                            errors = {
                                "index": err.path
                            };
                            return responses.errorMsg(res, 400, "Bad Request", "cast error.", errors);

                        } else {
                            console.log(err);
                            return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                        }
                    }

                    return responses.successMsg(res, null);
                });

        } else {
            return responses.errorMsg(res, 401, "Unauthorized", "failed to authenticate token.", null);
        }
    });
};

module.exports.updatePersonalInfo = function (req, res) {
    AuthoriseUser.getUser(req, res, function (user) {
        User.findOneAndUpdate({
            _id: user._id
        }, {
                name: req.body.name,
                mobile: req.body.mobile
            }, function (err, user) {
                if (err) {
                    if (err.name && err.name == "ValidationError") {
                        errors = {
                            "index": Object.keys(err.errors)
                        };
                        return responses.errorMsg(res, 400, "Bad Request", "validation failed.", errors);

                    } else if (err.name && err.name == "CastError") {
                        errors = {
                            "index": err.path
                        };
                        return responses.errorMsg(res, 400, "Bad Request", "cast error.", errors);

                    } else {
                        console.log(err);
                        return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                    }
                }

                if (!user) {
                    return responses.errorMsg(res, 404, "Not Found", "user not found.", null);
                }

                return responses.successMsg(res, null);
            });
    });
};

module.exports.userVerificationList = function (req, res) {
    AuthoriseUser.getUser(req, res, function (user) {
        user.password = undefined;
        user.__v = undefined;

        if (user.isAdmin) {
            User.find({ isVerified: false }, { __v: 0, password: 0, revoke_count: 0 }, function (err, users) {
                if (err) {
                    console.log(err);
                    return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                }

                return responses.successMsg(res, users);
            });
        } else {
            return responses.errorMsg(res, 401, "Unauthorized", "failed to authenticate token.", null);
        }
    });
};

module.exports.userProofVerify = function (req, res) {
    AuthoriseUser.getUser(req, res, function (user) {
        user.password = undefined;
        user.__v = undefined;

        if (user.isAdmin) {
            User.findOneAndUpdate({
                _id: req.body.id
            },
                {
                    isVerified: true
                },
                function (err, user) {
                    if (err) {
                        if (err.name && err.name == "ValidationError") {
                            errors = {
                                "index": Object.keys(err.errors)
                            };
                            return responses.errorMsg(res, 400, "Bad Request", "validation failed.", errors);

                        } else if (err.name && err.name == "CastError") {
                            errors = {
                                "index": err.path
                            };
                            return responses.errorMsg(res, 400, "Bad Request", "cast error.", errors);

                        } else {
                            console.log(err);
                            return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                        }
                    }
                    if (!user) {
                        return responses.errorMsg(res, 404, "Not Found", "user not found", null);
                    }
                    return responses.successMsg(res, null);
                });
        } else {
            return responses.errorMsg(res, 401, "Unauthorized", "failed to authenticate token.", null);
        }
    });
};


module.exports.removeMember = function (req, res) {
    if (!req.id || req.id.length !== 24) {
        return responses.errorMsg(res, 401, "Unauthorized", "failed to authenticate token.", null);
    }

    User.findOneAndUpdate({
        _id: req.id,
        members: mongoose.Types.ObjectId(req.body.members)
    }, {
            $pull: {
                members: mongoose.Types.ObjectId(req.body.members)
            }
        }, function (err, user) {

            if (err) {
                console.log(err)
                return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
            }

            if (!user) {
                return responses.errorMsg(res, 404, "Not Found", "user not found.", null);
            }

            User.findByIdAndUpdate({
                _id: req.body.members
            }, {
                    isVerified: false
                },
                function (err, result) {
                    if (err) {
                        console.log(err)
                        return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                    }
                    return responses.successMsg(res, null);
                })
        });
};

module.exports.viewMember = function (req, res) {
    if (!req.id || req.id.length !== 24) {
        return responses.errorMsg(res, 401, "Unauthorized", "failed to authenticate token.", null);
    }

    User.findById(req.id, {
        password: 0,
        __v: 0
    })
        .populate("members", "-__v")
        .exec(
            function (err, members) {
                if (err) {
                    console.log(err);
                    return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                }

                if (members.length < 1) {
                    return responses.errorMsg(res, 404, "Not Found", "transactions not found.", null);
                }
                return responses.successMsg(res, members.members);
            });
};

module.exports.addMember = function (req, res) {
    AuthoriseUser.getUser(req, res, function (user) {
        newUser = {
            isVerified: true,
            name: req.body.name,
            mobile: req.body.mobile,
            email: req.body.email,
            address: user.address,
            rentAgreement: user.rentAgreement,
            password: "t" + Math.random().toString(36).substring(10)
        }
        User.create(newUser,
            function (err, newUser) {
                if (err) {
                    if ((err.name && err.name == "UserExistsError") || (err.code && err.code == 11000)) {
                        return responses.errorMsg(res, 409, "Conflict", "user already exists.", null);

                    } else if (err.name && err.name == "ValidationError") {
                        errors = {
                            "index": Object.keys(err.errors)
                        };
                        return responses.errorMsg(res, 400, "Bad Request", "validation failed.", errors);

                    } else if (err.name && err.name == "CastError") {
                        errors = {
                            "index": err.path
                        };
                        return responses.errorMsg(res, 400, "Bad Request", "cast error.", errors);

                    } else {
                        console.log(err);
                        return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                    }
                }

                addMemberToList(user._id, newUser._id);

                // create a token
                var token = jwt.sign({
                    id: newUser._id
                }, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });

                Verification.create({
                    userID: newUser._id,
                    key: token
                },
                    function (err, verification) {
                        if (err) {
                            return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
                        } else {

                            var link = 'localhost:3000/verify/email/' + token;

                            Mail.verification_mail(req.body.email, link);

                            return responses.successMsg(res, {
                                email: req.body.email
                            });
                        }
                    });

            });
    });
};

module.exports.getOTP = function (req, res) {
    AuthoriseUser.getUser(req, res, function (user) {
        let OTP = otp();
        let expires = minuteFromNow();
        User.findByIdAndUpdate(user._id, {
            'lift_otp.otp': OTP,
            'lift_otp.expires': expires
        }, function (err, result) {
            if (err) {
                return responses.errorMsg(res, 500, "Unexpected Error", "unexpected error.", null);
            }

            return responses.successMsg(res, {
                lift_otp: {
                    otp: OTP,
                    expires: expires 
                }
            });

        });
    });
};