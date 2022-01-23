const db = require('../models');
const {response} = require("express");
const Cookies = require('cookies');


exports.fetchEmail = (req, res, next) => {
    db.User.findOne({ where: {email: req.body.email} })
        .then((result) => {
            if(result==null)
                return res.json('not exist');
            else
                return res.json('exist');

        })
        .catch((err) => {
            return res.send(err)
        });
};
exports.fetchImage = (req, res, next) => {
    db.Image.findOne({ where: {imageId: req.body.img.id,email:req.session.email} })
        .then((result) => {
            if(result==null)
                            db.Image.create({
                                email: req.session.email,
                                imageId:  req.body.img.id,
                                earth_date: req.body.img.earth_date,
                                sol:req.body.img.sol,
                                url:req.body.img.img_src,
                                camera_name:req.body.img.camera.name,
                                rover_name:req.body.img.rover.name,

                }).then((result) => {
;
                    return res.json("saved");
                })
            else
                return res.json("already saved")

        })
        .catch((err) => {
            return res.send(err)
        });
};
exports.getAll = (req, res, next) => {
     db.Image.findAll({ where:{email:req.session.email}})
            .then((allData) =>
        {
             return res.json(allData);
        })
        .catch((err) => {
            return ({message: err})
        });
}
exports.logout = (req, res, next) => {
req.session.login = false;
    return res.render('login',{error:null,register:null});
}
exports.delete = (req, res, next) => {
    db.Image.destroy({where: {id: req.body.id,email:req.session.email}})
        .then(() => {return res.json("delete")})
        .catch((err) => {
            console.log('***Error deleting image', JSON.stringify(err))
            res.status(400).send(err)
        })
}
exports.deleteAll = (req, res, next) => {

    db.Image.destroy({where: {email:req.session.email}}).then((result) => {
    return res.json("saved");
})
        .catch((err) => {
            console.log('***Error deleting image', JSON.stringify(err))
            res.status(400).send(err)
        });
}