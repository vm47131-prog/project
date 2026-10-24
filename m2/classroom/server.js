const express=require("express");
const app=express();
const users=require("./routes/user.js");
const posts=require("./routes/post.js");
//SESSION
const session = require("express-session");
const flash=require("connect-flash"); 
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const sessionOptions={
    secret:"secretString",
    resave:false,
    saveUninitialized:true
 };
app.use(session(sessionOptions));
app.use(flash());
// session ka kam hota hai useful info ko store karana tai usko different pages me use kar sake
app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;
    if(name==="anonymous"){
     req.flash("error","user not register");
    }else{
    req.flash("success","User registered successfully!"); 
    }
    res.redirect("/hello");
});
app.get("/hello",(req,res)=>{
 res.locals.successMsg=req.flash("success");// successMsg and errorMsg dono page.ejs ke sath hi render ho jayenge 
 res.locals.errorMsg=req.flash("error");
 res.render("page.ejs",{name:req.session.name});   
});
// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//      req.session.count++;   
//     }else{
//      req.session.count=1;
//     }
//    res.send(`You sent a request ${req.session.count} times`);
// });
// app.get("/test",(req,res)=>{
//     res.send("test successfull!");
//});

//COOKIES
//const cookieParser=require("cookie-parser");//to read the cookies from the browser
// app.use(cookieParser("secretcode"));// "secretcode"=> A secret string (called a Signing Secret) chosen by you
//  //signed cookies
// app.get("/getsignedcookie",(req,res)=>{
//    res.cookie("made-in","India",{signed:true}); 
//    res.send("signed cookie sent");
// });
// app.get("/verify",(req,res)=>{
//     console.log(req.cookies);//it will print only unsigned cookies
//      console.log(req.signedCookies);//it will print signed cookie
//     res.send("verified");
// });
// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","NAMASTE");
//     res.cookie("made","Namaste");
//     res.send("sent you some cookies!");
// });
// //cookie parser
// app.get("/greet",(req,res)=>{
//   let{name="anonymus"}=req.cookies; 
//   res.send(`Hello ${name}`);
// });
// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("Hi,I am root");
//  });
//  app.use("/users",users);// "/users" se jitni bhi request ayegi unki matching and mapping "users" ke sath karni hai
//  app.use("/posts",posts);
 app.listen(3000,()=>{
  console.log("server is listening to 3000");
 });