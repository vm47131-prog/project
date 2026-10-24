const express=require("express");
const router=express.Router();
//posts
//index 
router.get("/",(req,res)=>{
   res.send("GET for posts");
});
//show-users
router.get("/:id",(req,res)=>{
   res.send("GET for show posts");
});
//post-users
router.post("/",(req,res)=>{
    res.send("post for show posts");;
});
//Delete-users
router.delete("/:id",(req,res)=>{
   res.send("Post for posts");
}); 
module.exports=router;