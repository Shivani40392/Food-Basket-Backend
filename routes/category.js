var express = require('express');
var router = express.Router();
var pool = require('./pool');
var upload = require('./multer');
var jwt=require('jsonwebtoken')

/* GET home page. */
const verifyJWT=async(req,res,next)=>{
  const token=req.headers.authorization;
  
  console.log(token,'yes its true')
  if(!token){
    console.log('if case')
    res.json({
      auth:false,
      message:"we need a token,please give it us next time",
    });
   
  }
  else{
    console.log('else case')
    const decoded=await jwt.verify(token,"shhhh")
    if(decoded){
      console.log('decoded...')
      next()
    }
    else{
      console.log('error')
    }
    // ,(err,decoded)=>{
    //   console.log('enter')
    //   if(err){
        
    //     res.json({auth:false,message:"you are failed to authenticate"})
    //   }
    //   else{
    //     req.emailaddress=decoded.emailaddress;
    //     next()
    //   }
    //})
  }
}
router.post('/add_categories', upload.single('icon'), function (req, res, next) {
 
  pool.query('insert into category(companyid, category, description, icon, createdat, updatedat, createdby) values(?,?,?,?,?,?,?)', [req.body.companyid, req.body.category, req.body.description, req.file.originalname, req.body.createdat, req.body.updatedat, req.body.createdby], function (error, result) {
    if (error) {
      
      res.status(500).json({ status: false, message: 'Server error' })
    }
    else {
      
      res.status(200).json({ status: true, message: 'Record Submitted Successfully' })
    }
  })
});
router.get('/fetch_all_categories',function(req,res,next){
  
 pool.query('select C.*,(select Co.companyname from company Co where Co.companyid=C.companyid)as companyname from category as C',function(error,result){
  if(error){
    console.log(error)
    
   res.status(500).json({status:false,message:'server error'})
  }
  else{
    res.status(200).json({status:true,data:result})
  }
 })
})
router.post('/edit_category_data', function (req, res, next) {

  pool.query('update category set companyid=?,category=?, description=?,updatedat=?  where categoryid=?', [req.body.companyid, req.body.category, req.body.description,req.body.updatedat,req.body.categoryid], function (error, result) {
    if (error) {
      console.log(error)
      res.status(200).json({ status: false, message: "server error" })
    }
    else {
      res.status(200).json({ status: true, message: "Category Updated successfully" })
    }
  })
});
router.post('/delete_category_data', function (req, res, next) {
  
  pool.query('delete from category   where categoryid=?', [req.body.categoryid], function (error, result) {
    if (error) {
     
      res.status(200).json({ status: false, message: "server error" })
    }
    else {
      res.status(200).json({ status: true, message: "Category Deleted Successfully" })
    }
  })
});
 
module.exports = router;
