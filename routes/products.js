var express = require('express');
var router = express.Router();
var pool = require('./pool');
var upload = require('./multer');


/* GET home page. */
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
  router.get('/fetch_all_pricetype', function(req, res, next) {
  
    pool.query('select * from pricetype',function(error,result){
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
  router.post('/add_product_data', upload.single('image'), function (req, res, next) {
  console.log(req.body)
    pool.query('insert into products( companyid, categoryid, productname, description, status, trending, deals, pricetype, image, createdat, updatedat, createdby)values(?,?,?,?,?,?,?,?,?,?,?,?)', [req.body.companyid, req.body.category, req.body.productname, req.body.description, req.body.status, req.body.trending, req.body.deals,req.body.pricetype, req.file.originalname,  req.body.createdat, req.body.updatedat, req.body.createdby], function (error, result) {
      if (error) {
       console.log(error)
        res.status(200).json({ status: false, message: "server error" })
      }
      else {
        res.status(200).json({ status: true, message: "Products Added Successfully" })
      }
    })
  });

  router.get('/fetchallproducts', function (req, res, next) {

    pool.query('select P.*,(select Co.companyname from company Co where Co.companyid=P.companyid)as companyname,(select C.category from Category C where C.categoryid=P.categoryid)as categoryname,(select pricetypename from pricetype p  where  p.pricetypeid=P.pricetype)as pricetypes from products as P', function (error, result) {
      if (error) {
       
        res.status(200).json({ status: false, message: "server error" })
      }
      else {
       
        res.status(200).json({ status: true, data: result })
      }
    })
  });
  router.post('/delete_products_data', function (req, res, next) {
  
    pool.query('delete from products  where productid=?', [req.body.productid], function (error, result) {
      if (error) {
        console.log(error)
        res.status(200).json({ status: false, message: "server error" })
      }
      else {
        res.status(200).json({ status: true, message: "Product Deleted Successfully" })
      }
    })
  });
  router.post('/edit_products_data', function (req, res, next) {

    pool.query('update products set  companyid=?, categoryid=?, productname=?, description=?, status=?, trending=?, deals=?, pricetype=?, updatedat=? where productid=? ', [req.body.companyid, req.body.categoryid, req.body.productname,req.body.description,req.body.status,req.body.trending,req.body.deals,req.body.pricetype,req.body.updatedat,req.body.productid], function (error, result) {
      if (error) {
        console.log(error)
        res.status(200).json({ status: false, message: "server error" })
      }
      else {
        res.status(200).json({ status: true, message: "Category Updated successfully" })
      }
    })
  });
  
  router.post('/edit_products_logo', upload.single('image'),function (req, res, next) {
  
    pool.query('update products set  image=? where productid=?', [req.file.originalname,req.body.productid], function (error, result) {
      if (error) {
        console.log(error)
        res.status(200).json({ status: false, message: "server error" })
      }
      else {
        res.status(200).json({ status: true, message: "Logo  Updated successfully" })
      }
    })
  });
module.exports = router;  

