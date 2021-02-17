const express=require('express');
const router=express.Router();
const gravatar=require('gravatar');
const bcrypt=require('bcryptjs');
const config=require('config');
const { check,validationResult } = require('express-validator/check');
const User=require('../../models/User'); 
const jwt=require('jsonwebtoken');
const nodemailer=require("nodemailer");
const sendgrid=require("nodemailer-sendgrid-transport");
const crypto=require('crypto');
const transporter=nodemailer.createTransport(sendgrid({
    auth:{
        api_key:"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"
    }
}));


router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','please include a valid email').isEmail(),
    check('password','please enter a valid password with 6 or more characters').isLength({min:6})
    ],async (req,res)=> {
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
    }
    

    const {name,email,password}=req.body;
    try{   
        let user=await User.findOne({email});
        if(user){
            return res.status(400).json({errors:[{msg:'User already exists'}]});
        }
        const avatar=gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'    
        });
        user=new User({
            name,
            email,
            avatar,
            password
        });
        const salt=await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(password,salt);
        await user.save();
        const payload={
            user:{
                id :user.id
            }
        }
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn:36000},
            (err,token)=>{
                if(err) throw err;
                transporter.sendMail({
                    to:user.email,
                    from:'chamolirohit22@gmail.com',
                    subject:"Welcome to devcommunity",
                    html:"<h1>Welcome to the Developers Community</h1>"
                })             
                res.json({ token });
        });
        //res.send('User route');
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server error');
    }
    
});


router.post('/reset', [
    check('email','email is required').not().isEmpty()
], async (req,res)=>{
    const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
    }
    crypto.randomBytes(32,(err,buffer)=>{
        if(err) console.log(err);
        const token=buffer.toString("hex");
        const {email}=req.body;
        User.findOneAndUpdate({email}).then(user=>{
            if(!user) return res.status(422).json({errors:"User does not excists"});
            user.resetToken=token;
            user.expireToken=Date.now()+3600000;
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"chamolirohit22@gmail.com",
                    subject:"Reset Password",
                    html:`
                        <p>You requested for password reset</p>
                        <h5>Click on this link <a href="http://localhost:3000/reset/${token}" >Link</a>to reset your password</h5>
                    `
                });
                res.json({msg:"check your email"});
            })
        })
    })
})

router.post('/new-password',[
    check('password','password is required').not().isEmpty()
],(req,res)=>{
    const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
    }
    const newPassword=req.body.password;
    const sentToken=req.body.token;
    User.findOne({resetToken:sentToken}).then(user=>{
        if(!user) return res.status(422).json({error:"Try again session expired"});
        bcrypt.hash(newPassword,12).then(hashedP=>{
            user.password=hashedP;
            user.resetToken=undefined;
            user.expireToken=undefined;
            user.save().then((result)=>{
                res.json({msg:"Password updated successfully"});
            });
            
        })
    })
})
module.exports=router;