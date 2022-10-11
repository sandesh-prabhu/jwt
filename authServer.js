require('dotenv').config()

const express=require('express')
const app=express()

app.use(express.json())//////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use(express.urlencoded({extended:false}));//////////////////////////////////////////////////////////////////////////////////////

const jwt=require('jsonwebtoken')

let refreshTokens=[] // database

app.post('/token',(req,res)=>{
    let refreshToken=req.body.token
    if(refreshToken==null) return res.sendStatus(401)
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err,user)=>{
        if(err) return res.sendStatus(403)
        const accessToken=generateAccessToken({name:user.name}) // for security entire user is not sent, only username is sent
        res.json({accessToken:accessToken})
    })
})

app.delete('/logout',(req,res)=>{ // to logout such that no more refresh tokens can be created
    refreshTokens=refreshTokens.filter(token=>token!==req.body.token)
    res.sendStatus(204)
})

app.post('/login',(req,res)=>{ // login returns access token and refresh token
    //Authenticate login

    const username=req.body.username
    const user={name:username}

    const accessToken=generateAccessToken(user)
    const refreshToken=jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.json({accessToken: accessToken, refreshToken:refreshToken})
})

function generateAccessToken(user){  // to generate tokens
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn:'60s'})
}

app.listen(4000,()=>{
    console.log('app running')
})