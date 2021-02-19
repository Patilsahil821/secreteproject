
require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const encrypt=require("mongoose-encryption")

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

const url="mongodb://localhost:27017/secretDB";

mongoose.connect(url,{useUnifiedTopology:true,useNewUrlParser:true}).then((msg)=>console.log("successfylly connected....")).catch(err=>console.log("not connected"));

const userSchema=new mongoose.Schema({
    email:String,
    password:String
})
// console.log(process.env.SECRETKEY)  now we have access to the secret key which we have mentioned in .env file.

const secret=process.env.SECRETKEY;
userSchema.plugin(encrypt,{secret:secret,encryptedFields: ['password']}); //you can do more encryption fields as you want....

const User=new mongoose.model("User",userSchema);


app.get("/",function(req,res){
    res.render("home")
})

app.route("/login").get((req,res)=>{
    
      res.render("login")

})
.post((req,res)=>{
      
     const username=req.body.username;
     const password=req.body.password;
     User.findOne({email:username},function(err,result){
         if(err)
         console.log(err)
         else{
             if(result){
                  if(result.password==password){
                      console.log(result.password)
                    res.render("secrets")
                  }
                    
             }
         }
     })

})

app.route("/register").get(function(req,res){
    res.render("register")
})
.post(function(req,res){
     const username=req.body.username;
     const password=req.body.password;
     new User({
         email:username,
         password:password
     }).save(function(err){
         if(err)
         console.log(err);
         else
         res.render("secrets")
     })
})


app.listen(3000,function(req,res){
    console.log("the server is running and up.....");
})

