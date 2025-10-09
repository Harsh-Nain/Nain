const express=require("express")
const app=express()
const PORT=process.env.PORT || 3000

const {generateOtp,sendMail}=require("./utils/otp-manager")
const path=require("path")
require("dotenv").config()
app.use(express.json())
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}))


app.set("view engine","ejs")
let otp={}

app.get("/register",(req,res)=>{
    res.render("signup")
})
app.post("/signup",async (req,res)=>{
    const {fullname,passwordValue,emailValue,appname,numberValue}=req.body
    console.log(fullname,passwordValue,emailValue,appname,numberValue)
    otp[emailValue]={
        otp:generateOtp(),
        gmail:emailValue,
        createAt:new Date().getTime(),
        expire:new Date().getTime() + 5 * 60 * 1000
    }
    let result=await sendMail(emailValue,otp[emailValue].otp)
    console.log(result)
    if(result){
        res.redirect(`/verify-otp?email=${encodeURIComponent(emailValue)}`)
    }
})

app.get("/verify-otp",(req,res)=>{
    res.send(req.query.email)
})

app.listen(PORT,()=>{
    console.log(`server run on url: http://127.0.0.1:${PORT}`)
})

