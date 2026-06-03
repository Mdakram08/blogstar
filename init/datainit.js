const blog=require("../modules/blog");
const datainit=require("../init/data");

//mongoose setup
const mongoose=require("mongoose");
main()
.then((res)=>{
    console.log("connected to database sucessfully");
})
.catch((err)=>{
    console.log(err);
})
async function main(params) {
    await mongoose.connect("mongodb://127.0.0.1:27017/blogstar")
}

//data initilixation function
async function initdb() {
    await blog.deleteMany({});
    datainit.data=datainit.data.map((obj)=>({...obj,owner:"68aabcfd9b93a8226e070ff9"}));
    await blog.insertMany(datainit.data);
    console.log("data added to db sucesfully")
}
initdb();