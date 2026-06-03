// if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
// }

// express and other dependencise
const express=require("express");
const app=express();
const user=require("./modules/user.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/expressError");

//session setup
const session=require("express-session");
const MongoStore = require("connect-mongo").default;

//mw
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs", ejsMate); 
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));

//mongoose setup
let mongodb=process.env.MONGO_ATLAS;

//mongoose setup
const mongoose=require("mongoose");
main()
.then((res)=>{console.log("connected to database sucessfully")})
.catch((err)=>{console.log(`err connecting ${mongodb}`)})

//mongoose main function
async function main() {
    await mongoose.connect(mongodb);
}

//store for connect-mongo
const store=MongoStore.create({
    mongoUrl:mongodb,
    crypto:{
        secret:process.env.SESSION_SECRET
    },
    touchAfter: 24*3600,
});

//if any error occurs in Store
store.on("error",()=>{
    console.log(err)
})

//session mw
app.use(session ({
    store:store,
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        express:Date.now()+7*24*60*60*100,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}));

//passport setup
const passport=require("passport");
const localStrategy=require("passport-local");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//flash setup
const flash = require("connect-flash");
app.use(flash());
app.use((req,res,next)=>{
    res.locals.sucess=req.flash("sucess");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
}); 

//blog routes
const listingRoute=require("./routes/blogRoutes.js");
app.use("/",listingRoute);

//review routes
const reviewRoutes=require("./routes/reviewRoutes.js");
app.use("/",reviewRoutes);

//user routes
const userRoutes=require("./routes/userRoutes.js");
app.use("/",userRoutes);

//admin routes
const adminRoutes=require("./routes/adminRoutes.js");
app.use("/",adminRoutes);

//Unaviable Route
app.all("/*catchall", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Error handling mw
app.use((err,req,res,next)=>{
    let {statusCode=500,message="SWW"}=err;
    res.render("error.ejs",{statusCode,message});
})

//port
app.listen(9000,()=>{
    console.log(`server started to listen on port 9000`);
})