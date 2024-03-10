var express = require('express');
var router = express.Router();
var pool = require('./pool');
var upload = require('./multer');

router.get('/fetch_all_category', function(req, res, next) {
  
    pool.query('select * from category',function(error,result){
      if(error)
      {
        console.log(error)
        res.status(500).json({status:false,message:"server error"})
      }
      else{
        res.status(200).json({status:true,data:result})
      }
    })
  });
  router.post('/fetch_all_product', function(req, res, next) {
  
    pool.query('select * from products where categoryid=?',[req.body.categoryid],function(error,result){
      if(error)
      {
        console.log(error)
        res.status(500).json({status:false,message:"server error"})
      }
      else{
        res.status(200).json({status:true,data:result})
      }
    })
  });

  router.post('/add_productlist', upload.any(), function (req, res, next) {
    console.log(req.body)
    var file_str=''
    req.files.map((item)=>{
      file_str+=item.filename+','
    })
    pool.query('insert into productlist(companyid, categoryid, productid, weight, price, offerprice, description, images, createdat, updatetat, createdby)values(?,?,?,?,?,?,?,?,?,?,?)', [req.body.companyid, req.body.categoryid, req.body.productid, req.body.weight, req.body.price, req.body.offerprice, req.body.description,file_str, req.body.createdat, req.body.updatedat,req.body.createdby], function (error, result) {
      if (error) {
        console.log(error)
        res.status(200).json({ status: false, message: "Server Error" })
      }
      else {
        res.status(200).json({ status: true, message: "ProductList Registered Successfully" })
      }
    })
  });
  router.get('/fetch_all_productlist', function (req, res, next) {
    
    pool.query('SELECT PL.*, C.category AS category, CO.companyname AS companyname, P.productname AS product FROM productlist AS PL JOIN category AS C ON C.categoryid = PL.categoryid JOIN company AS CO ON CO.companyid = PL.companyid  JOIN products AS P ON P.productid = PL.productid', function (error, result) {
      if (error) {
        console.log(error)
        res.status(200).json({ status: false, message: "server error" })
      }
      else {
        console.log("DATA:",result)
        res.status(200).json({ status: true, data: result })
      
      }
    })
  });
  router.post('/edit_productlist_data', function (req, res, next) {

    pool.query('update productlist set  companyid=?, categoryid=?, productid=?, weight=?, price=?, offerprice=?, description=? , updatetat=? where productlistid=?', [req.body.companyid, req.body.categoryid, req.body.productid, req.body.weight, req.body.price, req.body.offerprice, req.body.description,  req.body.updatedat,req.body.productlistid], function (error, result) {
      if (error) {
        
        res.status(200).json({ status: false, message: "server error" })
      }
      else {
        res.status(200).json({ status: true, message: "Data Updated successfully" })
      }
    })
  });
  router.post('/delete_productlist_data',function (req, res, next) {
  
    pool.query('delete from productlist  where productlistid=?', [req.body.productlistid], function (error, result) {
      if (error) {
        console.log(error)
        res.status(200).json({ status: false, message: "server error" })
      }
      else {
        res.status(200).json({ status: true, message: " Deleted Successfully" })
      }
    })
  });
  router.post('/add_bannerimages', upload.any(), function (req, res, next) {
    console.log(req.body)
    var file_str=''
    req.files.map((item)=>{
      file_str+=item.filename+','
    })
    pool.query('insert into banner(companyid, bannerpicture,status)values(?,?,?)', [req.body.companyid,file_str,req.body.status], function (error, result) {
      if (error) {
        console.log(error)
        res.status(200).json({ status: false, message: "Server Error" })
      }
      else {
        res.status(200).json({ status: true, message: " Successfully Uploaded images" })
      }
    })
  });
  module.exports= router