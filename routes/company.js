var express = require('express');
var router = express.Router();
var pool = require('./pool');
var upload = require('./multer');
var jwt=require('jsonwebtoken')
/* api to fetch all companies */
router.get('/fetch_all_company', function (req, res, next){

  pool.query('select C.*,(select S.statename from states S where S.stateid=C.state)as statename,(select CC.cityname from cities CC where CC.cityid=C.city)as cityname from company C', function (error, result) {
    if (error) {

      res.status(200).json({ status: false, message: "server error" })
    }
    else {
      res.status(200).json({ status: true, data: result })
    }
  })
});
/* api to add all companies */
router.post('/add_new_company', upload.single('logo'), function (req, res, next) {

  pool.query('insert into company(companyname, ownername, emaileaddress, mobilenumber, address, state, city, logo, password, status, createdat, updatedat, createdby) values(?,?,?,?,?,?,?,?,?,?,?,?,?)', [req.body.companyname, req.body.ownername, req.body.emailaddress, req.body.mobilenumber, req.body.address, req.body.state, req.body.city, req.file.originalname, req.body.password, req.body.status, req.body.createdat, req.body.updatedat, req.body.createdby], function (error, result) {
    if (error) {
      res.status(200).json({ status: false, message: "server error" })
    }
    else {
      res.status(200).json({ status: true, message: "Company registered successfully" })
    }
  })
});
router.post('/edit_company_data', function (req, res, next) {

  pool.query('update company set companyname=?,ownername=?, emaileaddress=?, mobilenumber=?, address=?, state=?, city=?, status=?,  updatedat=?, createdby=? where companyid=?', [req.body.companyname, req.body.ownername, req.body.emailaddress, req.body.mobilenumber, req.body.address, req.body.state, req.body.city,  req.body.status, req.body.updatedat, req.body.createdby,req.body.companyid], function (error, result) {
    if (error) {
      res.status(200).json({ status: false, message: "server error" })
    }
    else {
      res.status(200).json({ status: true, message: "Company Updated successfully" })
    }
  })
});
router.post('/edit_company_logo', upload.single('logo'),function (req, res, next) {
  
  pool.query('update company set  logo=? where companyid=?', [req.file.originalname,req.body.companyid], function (error, result) {
    if (error) {
      console.log(error)
      res.status(200).json({ status: false, message: "server error" })
    }
    else {
      res.status(200).json({ status: true, message: "Logo  Updated successfully" })
    }
  })
});
router.post('/delete_company_data',function (req, res, next) {
  
  pool.query('delete from company  where companyid=?', [req.body.companyid], function (error, result) {
    if (error) {
      console.log(error)
      res.status(200).json({ status: false, message: "server error" })
    }
    else {
      res.status(200).json({ status: true, message: "Company Deleted Successfully" })
    }
  })
});
const verifyJWT=(req,res,next)=>{
  const token=req.headers.authorization;
  console.log(token)
  if(!token){
    res.json({
      auth:false,
      message:"we need a token,please give it us next time",
    });
   
  }
  else{
    jwt.verify(token,"shhhh",(err,decoded)=>{
      if(err){
        res.json({auth:false,message:"you are failed to authenticate"})
      }
      else{
        req.emailaddress=decoded.emailaddress;
        next()
      }
    })
  }
}
router.post('/chK_company_login',function(req,res,next){
  
  pool.query('select * from company where (emaileaddress=? or mobilenumber=?) and password=? and status="Verified"',[req.body.emailaddress,req.body.emailaddress,req.body.password],function(error,result){
    if(error)
    { 
       console.log(error)
      return res.status(200).json({status:'false',message:'Server Error'})
    }
    else{
      if(result.length==0){
        return res.status(200).json({status:1,message:'Invalid EmailAddress/Invalid MobileNumber/Invalid Password '})
      }
      else{
          var token=jwt.sign({emailaddress:req.body.emailaddress},"shhhh",{expiresIn:'1000000s'})
          return res.status(200).json({data:result[0],status:2,message:'Valid Login',token:token})
       
      }
    }
  })
})
module.exports = router