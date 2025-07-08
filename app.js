require('dotenv').config()//requiring the env so that we can use those variables of env in app.js 
const express = require('express')
const connectToDatabase = require('./Database/index.js')
const app=express()

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



app.listen(process.env.PORT,()=>{
    console.log("Node js has started in port 3000");
    
})

