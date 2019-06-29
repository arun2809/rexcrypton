const blog = require("../models/blog")
module.exports={
    blogurl:(req,res)=>{
        blog.find({title:req.params.id}).populate('comments').exec((err, foundBlog) => {
            if(err) {
                console.log(err);
            } else {
                
                console.log("foundBlog",foundBlog)
                res.render('blogs/show', {blog: foundBlog});
          
            }});
    }
}