const jwt = require('jsonwebtoken')
process.env.SECRET_KEY = 'secret'

var Product = require('../models/Product.js');
const AvailableProgram = require('../models/AvailableProgram');
const Battery = require('../models/Battery');
const Board = require('../models/Board');
const Brand = require('../models/Brand');
const Cpu = require('../models/Cpu');
const Graphic = require('../models/Graphic');
const HardDisk = require('../models/HardDisk');
const Ram = require('../models/Ram');
const Screen = require('../models/Screen');
const SellWeb = require('../models/SellWeb');
const SizeWeight = require('../models/SizeWeight');
const User = require('../models/User');
const Comment = require('../models/Comment');

exports.list_all_products = function(req, res) {
    Product.findAll({include: [{all: true}]}).then(
        (products) => {
            res.send(products);
        }
    )
};

exports.create_a_product = function(req, res) {
    if(req.file){

        //link image for window
        req.body.image = '/' + req.file.path.split('\\').slice(1).join('/');
      
        //link image for mac
        // req.body.image = '/' + req.file.path.split('/').slice(1).join('/');
    }else{
        req.body.image = '/productImg/defaultimage';
    }
    console.log("req.body")
    console.log(req.body)
    Product.create(req.body,{include: [{all: true}]}).then(
        (products) => {
            console.log('backend', products);
            res.send(products);
        }
    )
};

exports.read_a_product = function(req, res) {
    Product.findByPk(req.params.productId, {include: [{all: true, nested: true}]}).then(
        (product) => {
            res.send(product);
        }
    );
};

exports.update_a_product = function(req, res) {
    const newProduct = req.body;
    Product.findByPk(req.params.productId).then(
        (product) => {
            Promise.all([
                Product.update(newProduct, {where: {id: product.id}}),
                AvailableProgram.update(newProduct.availableProgram, {where: {id: product.programId}}),
                Battery.update(newProduct.battery, {where: {id: product.batteryId}}),
                Board.update(newProduct.board, {where: {id: product.boardId}}),
                Brand.update(newProduct.brand, {where: {id: product.brandId}}),
                Cpu.update(newProduct.cpu, {where: {id: product.cpuId}}),
                Graphic.update(newProduct.graphic, {where: {id: product.graphicId}}),
                HardDisk.update(newProduct.harddisk, {where: {id: product.harddiskId}}),
                Ram.update(newProduct.ram, {where: {id: product.ramId}}),
                Screen.update(newProduct.screen, {where: {id: product.screenId}}),
                SellWeb.update(newProduct.web, {where: {id: product.webId}}),
                SizeWeight.update(newProduct.sizeAndWeight, {where: {id: product.sizeAndWeightId}}),
            ]).then(values => {
                Product.findByPk(req.params.productId, {include: [{all: true}]}).then(
                    (product) => {
                        res.send(product);
                    }
                );
            });

        }
    );
};

exports.delete_a_product = function(req, res) {
    Product.findByPk(req.params.productId, {include: [{all: true}]}).then(
        (product) => {
            product.destroy();
            res.send({mess: 'delete success'});
        }
    );
};

exports.add_comment = function(req, res) {
    // test postman
    // var decoded = jwt.verify(req.headers['authorization'].split(" ")[1], process.env.SECRET_KEY);
    var decoded = jwt.verify(req.body.token, process.env.SECRET_KEY);
    if(!decoded) {
        res.send({mess: 'add comment error: error user token'});
        return;
    }

    var comment = req.body;
    comment = {...comment, userId: decoded.id, productId: req.params.productId};
    Comment.create(comment).then(
        (newComment) => {
            return Comment.findByPk(newComment.id, {include: [{all: true}]});
        }
    ).then(
        (newComment) => {
            res.send(newComment);
            return;
        }
    );
};

exports.update_comment = function(req, res) {
    // test postman
    // var decoded = jwt.verify(req.headers['authorization'].split(" ")[1], process.env.SECRET_KEY);
    var decoded = jwt.verify(req.body.token, process.env.SECRET_KEY);
    if(!decoded) {
        res.send({mess: 'add comment error: error user token'});
        return;
    }
    var comment = {content: req.body.content};
    Comment.update(comment, {where: {id: req.params.commentId, userId: decoded.id}}).then(
        (number) => {
            if(!number){
                res.send({mess: 'update fail'});
            }else{
                res.send({mess: 'update success'});
            }
        }
    );
};

exports.delete_comment = function(req, res) {
    // test postman
    // var decoded = jwt.verify(req.headers['authorization'].split(" ")[1], process.env.SECRET_KEY);
    var decoded = jwt.verify(req.body.token, process.env.SECRET_KEY);
    if(!decoded) {
        res.send({mess: 'add comment error: error user token'});
        return;
    }
    Comment.destroy({where: {id: req.params.commentId, userId: decoded.id}}).then(
        (number) => {
            if(!number){
                res.send({mess: 'delete fail'});
            }else{
                res.send({mess: 'delete success'});
            }
        }
    );
};
