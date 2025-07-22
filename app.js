require('dotenv').config()//requiring the env so that we can use those variables of env in app.js 
const express = require('express')
const connectToDatabase = require('./Database/index.js')
const Blog = require('./model/blogModel.js')

const app=express()
app.use(express.json())
const {multer,storage}= require('./middleware/multerConfig.js')//importing
const upload = multer({storage : storage})
const fs= require('fs')

connectToDatabase()

app.get("/",(req,res)=>{

    res.status(200).json({
        message:"This is Home page"
    })
})


app.get("/about",(req,res)=>{
    
    res.json({
        message:"This is About  page"
    })
})

app.post("/blog",upload.single('image'), async (req,res)=>{   
    const {title,subtitle,description}= req.body//object destrutcturing
    const filename=req.file.filename

    if(!title || !subtitle || !description ){
        return res.status(400).json({
            message : "Please provide title,subtitle,description"
        })
    }

    await Blog.create({
        title : title, //cloumn name : value
        subtitle : subtitle, //column name : value
        description : description, //column name : value
        image : filename //column name : value
    })

    res.status(200).json({  
         message : "Blog api hit sucessfully"
         
    })
})

 app.get("/blog",async (req,res)=>{
    const blog = await Blog.find()//Blogs returns array     
    res.status(200).json({
        message : "Blog fetched sucessfully",
        data : blog
    })
})

app.get('/blog/:id',async(req,res)=>{
    const id=req.params.id 
   const blog = await Blog.findById(id) //returns object
   if(!blog){
        res.status(404).json({
            message:"Data not found"
        })
   }
   else{
    res.status(200).json({
        message : "Fetched sucessfully",    
        data : blog
    })
   }
    
})
 
app.delete('/blog/:id',async (req,res)=>{
    const id=req.params.id
    const blog=await Blog.findById(id)
    if (!blog) {
        return res.status(404).json({
            message: "Data not found"
        })
    }
    const imageName=blog.image
 
    fs.unlink(`storage/${imageName}`,(err)=>{
        if(err){
            console.log(err);
            
        }
        else{
            console.log("File deleted sucessfully");
            
        }
    })
       await Blog.findByIdAndDelete(id)
    res.status(200).json({
        message : 'Blog deleted Sucessfully'
    })
})


app.patch('/blog/:id',upload.single('image'),async (req,res)=>{
    const id=req.params.id
    const{title,subtitle,description}=req.body
    let imageName;

    if(req.file){
        const newImage = req.file.filename
       const blog=await Blog.findById(id)
    if (!blog) {
        return res.status(404).json({
            message: "Data not found"
        })
    }
    const oldImage=blog.image
 
    fs.unlink(`storage/${oldImage}`,(err)=>{
        if(err){
            console.log(err);
            
        }
        else{
            console.log("File deleted sucessfully");
            
        }
    })
    imageName=newImage 
    }
    await Blog.findByIdAndUpdate(id,{
        title : title,
        subtitle : subtitle,
        description : description,
        image : imageName
    })
    res.status(200).json({
        message:"Data updated sucessfully"
    })
})  


app.use(express.static('./storage'))
app.listen(process.env.PORT,()=>{
    console.log("Node js has started in port 3000");
    
})

