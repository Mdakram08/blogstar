const blog=require("../modules/blog");

//home
module.exports.home=async(req,res)=>{
    res.render("home.ejs");
}
//allBlog
module.exports.allBlog=async(req,res)=>{
   const { category } = req.query;
   let filter = {};
   if (category) {
    // This creates a MongoDB query: { category: 'Travel' }
        filter.category = category;
    }
   //const allBlog=await blog.find().populate("owner");
   const allBlog = await blog.find(filter).populate('owner');
   res.render("all.ejs", { allBlog, selectedCategory: category });
}


//Blog newform
module.exports.newform=(req,res)=>{
    res.render("newform.ejs");
}

//blog add
module.exports.newformpost=async(req,res)=>{
    let url = req.file.path;  
    let filename = req.file.filename; 
    const newBlog = new blog(req.body.blog);
    newBlog.owner=req.user._id;
    newBlog.image={url,filename};
    await newBlog.save();
    req.flash("sucess","Blog Added Sucessfully!");
    res.redirect("/blog");
}

//blog editform
module.exports.editForm=async(req,res)=>{  
    let {id}=req.params;
    const Blog=await blog.findById(id);          
    res.render("editForm.ejs",{Blog});
}

//blog edit
module.exports.upadateBlog=async(req,res)=>{
    let{id}=req.params;
    let Blog=await blog.findByIdAndUpdate(id,{...req.body.blog},{runValidators: true });
    if(typeof req.file !== "undefined"){
    let url = req.file.path;  
    let filename = req.file.filename; 
    Blog.image={url,filename}          
    await Blog.save();
    }

    req.flash("sucess","Blog Edited Sucessfully !");
    res.redirect("/blog");
}

//blog delete
module.exports.deleteBlog=async(req,res)=>{
    let {id}=req.params;
    await blog.findByIdAndDelete(id);
    req.flash("error","Blog Deleted Sucessfully !");
    res.redirect("/blog");
}

//blog show
module.exports.showBlog=async(req,res)=>{
    let {id}=req.params;
    const Blog=await blog.findById(id)
    .populate({path:"reviews", 
        populate:{
            path:"author",
        }})
    .populate("owner");
    res.render("show.ejs",{Blog});
}