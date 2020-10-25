const express=require('express');
const router=express.Router();
const auth=require('../../middleware/auth'); 
const User=require('../../models/User');
const config=require('config');
const { check,validationResult}= require('express-validator/check');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const { OAuth2Client }=require('google-auth-library');
const client=new OAuth2Client("403380080270-6rpdj7ll4gkvlrvi4s03imtk3e487nuo.apps.googleusercontent.com");
const gravatar=require('gravatar');

router.get('/',auth, async (req,res)=>{
    try {
        const user=await User.findById(req.user.id).select('-password');
        res.json(user);    
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/',[
    check('email','Please include a valid email').isEmail(),
    check('password','Password is required').exists()
],
    async (req,res)=>{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        const {email,password}=req.body;
        try{    
            let user=await User.findOne({email});
            if(!user){
                return res.status(400).json({ errors : [{msg : 'Inavlid credentials' }] });
            }

            const isMatch=await bcrypt.compare(password,user.password);
            if(!isMatch){
                return res.status(400).json({errors:[{msg:"password doesn't match"}]});
            }

            const payload={
                user:{
                    id:user.id
                }
            };
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn:360000 },
                (err,token)=>{
                    if(err) throw err;
                    res.json({token});
                }
            )
        }catch(err){
            console.log(err.message);
            res.status(500).send('Server error');
        }

    }


);

router.post('/loginwithgoogle',async (req,res)=>{
    const {tokenID}=req.body;
    let response=await client.verifyIdToken({idToken:tokenID,audience:"403380080270-6rpdj7ll4gkvlrvi4s03imtk3e487nuo.apps.googleusercontent.com"});
    const {email,email_verified,name}=response.payload;
    if(email_verified){
        try {
            const user=await User.findOne({email});
            if(user){
                const payload={
                    user:{
                        id :user._id
                    }
                }
                jwt.sign(
                    payload,
                    config.get('jwtSecret'),
                    {expiresIn:360000},
                    (err,token)=>{
                        if(err) throw err;
                        res.json({token});
                })
            }else{
                const avatar=gravatar.url(email,{
                    s:'200',
                    r:'pg',
                    d:'mm'
                });
                const salt=await bcrypt.genSalt(10);
                let password=await bcrypt.hash(email,salt);
                let user=new User({name,email,avatar,password});
                await user.save();
                const payload={
                    user:{
                        id :user._id
                    }
                }
                jwt.sign(
                    payload,
                    config.get('jwtSecret'),
                    {expiresIn:360000},
                    (err,token)=>{
                        if(err) throw err;
                        res.json({token});
                });
            }
        } catch (err) {
            console.log(err.message);
            res.status(400).json({error:"Something went wrong"});
        }
    }
})

module.exports=router;