require('dotenv').config()//requiring the env so that we can use those variables of env in app.js 
const express = require('express')
const connectToDatabase = require('./Database/index.js')
const Blog = require('./model/blogModel.js')

const app=express()
app.use(express.json())
const {multer,storage}= require('./middleware/multerConfig.js')//importing
const upload = multer({storage : storage})

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
    await Blog.findByIdAndDelete(id)
    res.status(200).json({
        message : 'Blog deleted Sucessfully'
    })
})



app.use(express.static('./storage'))
app.listen(process.env.PORT,()=>{
    console.log("Node js has started in port 3000");
    
})

