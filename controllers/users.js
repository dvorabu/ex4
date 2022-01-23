const db = require('../models');
const Cookies = require('cookies');
const keys = ['keyboard cat'];

var express = require('express');

exports.middleWare = (req, res, next)=> {
    if (req.session.login)
        res.render('index',{userName: req.session.firstName});
    else {
        next();
    }


};
exports.postRegister = (req, res, next) => {
    const cookies = new Cookies(req, res, { keys: keys })
    cookies.set('LastVisit', new Date().toISOString(), { signed: true, maxAge: 60*1000 });
    res.render('password',{firstName:req.body.firstName,lastName: req.body.lastName,email: req.body.email});
};
exports.getRegister = (req, res, next) => {
    res.render('register');
};
exports.getLogin = (req, res, next) => {
    res.render('login',{error:null,register:null});
};
exports.postLogin = (req, res, next) => {
    db.User.findOne({ where: {email: req.body.email} })
        .then((result) => {
            if(result==null||result.password!=req.body.password)
                return res.render('login',{error:"Your account name or password is incorrect.",register:null});
            else
            {
                req.session.login = true;
                req.session.email = req.body.email;
                req.session.firstName = result.firstName;
                return res.render('index',{userName:req.session.firstName});

            }

        })
        .catch((err) => {
            console.log('There was an error querying users', JSON.stringify(err))
            return res.send(err)
        });
};

exports.postAddUser = (req, res, next) => {

    const cookies = new Cookies(req, res, { keys: keys })
    const lastVisit = cookies.get('LastVisit', { signed: true })
    if (lastVisit!=undefined)
    {
        db.User.findOne({ where: {email: req.body.email} })
            .then((result) => {
                if(result==null)
                    db.User.create({
                        email: req.body.email,
                        firstName:  req.body.firstName,
                        lastName: req.body.lastName,
                        password:req.body.password1,

                    }).then((result) => {
                        req.session.email = req.body.email;
                        req.session.firstName = req.body.firstName;
                        req.session.login = true;
                        return res.render('login',{error:null,register:`${ req.session.firstName} you are registered`});
                    })
                else
                    return res.render('register',{error:"An email address already exists"})

            })
            .catch((err) => {
                return res.send(err)
            });

        }
    else
    res.redirect('register');
};
