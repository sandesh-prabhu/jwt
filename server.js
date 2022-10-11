require('dotenv').config()

const express=require('express')
const app=express()

app.use(express.json())//////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use(express.urlencoded({extended:false}));//////////////////////////////////////////////////////////////////////////////////////

const jwt=require('jsonwebtoken')

const posts=[
    {
        username:'abc',
        title:"post 1"
    },
    {
        username:'bcd',
        title:"post 2"
    }

]

app.get('/posts',authenticateToken,(req,res)=>{
    res.json(posts.filter(post=>post.username==req.user.name))
}) 

function authenticateToken(req,res,next){
    let authheader=req.headers['authorization']// authheader = Bearer TOKEN
    let token=authheader && authheader.split(' ')[1]
    if(token==null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
        if(err) return res.sendStatus(403)
        req.user=user
        next()
    })
}

app.listen(3000,()=>{
    console.log('app running')
})