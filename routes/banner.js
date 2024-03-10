var express = require('express');
var router = express.Router();
var pool = require('./pool');
var upload = require('./multer');
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
  router.get('/fetch_banner_images',function(req,res,next){
    pool.query('select * from banner where status="true"',function(error,result){
     if(error){
       console.log(error)
      res.status(500).json({status:false,message:'server error'})
     }
     else{
       res.status(200).json({status:true,data:result})
     }
    })
   })
  module.exports= router