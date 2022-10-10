const dotenv=require('dotenv')
dotenv.config()

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

app.post('/login',(req,res)=>{
    //Authenticate login

    const username=req.body.username
    const user={name:username}

    const accessToken=jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken: accessToken})
})

function authenticateToken(req,res,next){
    let authheader=req.headers['authorization']// authheader = Bearer TOKEN
    let token=authheader && authheader.split(' ')[1]
    if(token==null) res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
        if(err) res.sendStatus(403)
        req.user=user
        next()
    })
}

app.listen(3000,()=>{
    console.log('app running')
})