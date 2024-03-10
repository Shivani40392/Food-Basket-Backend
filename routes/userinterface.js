var express = require('express');
var router = express.Router();
var pool = require('./pool');
var upload = require('./multer');

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
router.get('/fetch_all_category',function(req,res,next){
    pool.query('select * from category',function(error,result){
        if(error){
          console.log(error)
            res.status(500).json({status:'false',message:'server errror'})
        }
        else
        {
            res.status(200).json({status:'true',data:result})
        }
    })
})
router.get('/fetch_all_productsdeals',function(req,res,next){
  pool.query('select p.*,pl.*,pt.* from products as p  join productlist pl on pl.productid=p.productid  join pricetype pt on pt.pricetypeid=p.pricetype where p.deals="yes"',function(error,result){
    if(error){
      console.log(error)
        res.status(500).json({status:'false',message:"server error"})
    }
    else
    { 
      
        res.status(200).json({status:'true',data:result})
    }
})
})
router.get('/fetch_all_trendingproducts',function(req,res,next){
    pool.query('select p.*,pl.*,pt.* from products as p  join productlist pl on pl.productid=p.productid  join pricetype pt on pt.pricetypeid=p.pricetype where p.trending="yes"',function(error,result){
        if(error){
          console.log(error)
            res.status(500).json({status:'false',message:"server error"})
        }
        else
        { 
          
            res.status(200).json({status:'true',data:result})
        }
    })
})
router.post('/fetch_all_product',function(req,res,next){
   
    pool.query('select p.*,pl.*,pt.* from products as p  join productlist pl on pl.productid=p.productid  join pricetype pt on pt.pricetypeid=p.pricetype where p.categoryid=? ',[req.body.categoryid],function(error,result){
        if(error){
           
            res.status(500).json({status:'false',message:"server error"})
        }
        else
        {
         
            res.status(200).json({status:'true',data:result})
        }
    })
})
router.post('/fetch_all_product_byproductid',function(req,res,next){
   
    pool.query('select p.*,pl.*,pt.* from products as p  join productlist pl on pl.productid=p.productid  join pricetype pt on pt.pricetypeid=p.pricetype where p.productid=? ',[req.body.productid],function(error,result){
        if(error){
           
            res.status(500).json({status:'false',message:"server error"})
        }
        else
        {
         
            res.status(200).json({status:'true',data:result})
        }
    })
})
router.post('/fetch_all_product_bycategory',function(req,res,next){
   
  pool.query('select p.*,pl.*,pt.* from products as p  join productlist pl on pl.productid=p.productid  join pricetype pt on pt.pricetypeid=p.pricetype where p.categoryid=(select categoryid  from category where category=? ) ',[req.body.categoryname],function(error,result){
      if(error){
         console.log(error)
          res.status(500).json({status:'false',message:"server error"})
      }
      else
      {
       
          res.status(200).json({status:'true',data:result})
      }
  })
})
router.post('/fetch_all_productlist_by_trending',function(req,res,next){
    console.log("pid:",req.body.productid)
    pool.query('select p.*,pl.*,pt.* from products as p  join productlist pl on pl.productid=p.productid  join pricetype pt on pt.pricetypeid=p.pricetype where p.productid=? ',[req.body.productid],function(error,result){
        if(error){
            console.log(error)
            res.status(500).json({status:'false',message:"server error"})
        }
        else
        {
           console.log(result)
            res.status(200).json({status:'true',data:result})
        }
    })
})
router.post('/fetch_all_product_list',function(req,res,next){
   
    pool.query('select p.*,pl.*,pt.* from products as p  join productlist pl on pl.productid=p.productid  join pricetype pt on pt.pricetypeid=p.pricetype where p.productid=? ',[req.body.productid],function(error,result){
        if(error){
            console.log(error)
            res.status(500).json({status:'false',message:"server error"})
        }
        else
        {
           console.log(result)
            res.status(200).json({status:'true',data:result})
        }
    })
})
router.post('/add_user_data',  function (req, res, next) {

    pool.query('select * from  usersdata where mobileno=?', [req.body.mobileno], function (error, result) {
      if (error) {
        console.log("error:",error)
        res.status(200).json({ status: 0, message: 'Server error' })
      }
      else {
        if(result.length==1){
            res.status(200).json({ status: 1, data:result[0] })
        }
       else {
        pool.query('insert into usersdata(mobileno) values(?)',[req.body.mobileno], function (errr, reslt) {
            if (errr) {
                console.log("errr:",errr)
                res.status(200).json({ status: 0, message: 'Server error' })
              
            }
            else {
                res.status(200).json({ status: 2, data:[{userid:reslt.insertId,mobileno:req.body.mobileno}] })
            }
          })

       }
      }
    })
  });
  router.post('/check_user_address',  function (req, res, next) {

    pool.query('select * from  useraddress where mobileno=?', [req.body.mobileno], function (error, result) {
      if (error) {
        console.log("error:",error)
        res.status(200).json({ status: 0, message: 'Server error' })
      }
      else {
        if(result.length==0){
            res.status(200).json({ status: 2, message: 'Address not register' })
        }
       else {
        res.status(200).json({ status: 1, data:result})

       }
      }
    })
  });
  router.post('/add_user_interface',  function (req, res, next) {

    pool.query('insert into useraddress(userid, mobileno, fullname, zipcode, city, state, address) values(?,?,?,?,?,?,?)', [req.body.userid,req.body.phonenumber,req.body.fullname,req.body.zipcode,req.body.city,req.body.state,req.body.address], function (error, result) {
      if (error) {
        console.log("error:",error)
        res.status(200).json({ status: 0, message: 'Server error' })
      }
      else {
        res.status(200).json({ status: 1, message: 'Address Submitted' })
      }
    })
  });
module.exports = router;  