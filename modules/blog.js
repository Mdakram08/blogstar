const mongoose=require("mongoose");
const blogSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        url:String,
        filename:String,
    },
    content:{
        type:String,
        required:true
    },
    category: {
        type: String,
        required:true,
        // Define a set of valid categories
        enum: ['Technology', 'Nature', 'Transport','Politics','Network','Time','GDP','HealthCare','Fashion','HollyWood','E-Sports','other'], 
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"review"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
})
const blog=mongoose.model("blog",blogSchema);
module.exports=blog;