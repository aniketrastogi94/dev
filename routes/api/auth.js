const express=require('express');
const router=express.Router();
const auth=require('../../middleware/auth'); 
const User=require('../../models/User');
const config=require('config');
const { check,validationResult}= require('express-validator/check');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const { OAuth2Client }=require('google-auth-library');
const client=new OAuth2Client("403380080270-6rpdj7ll4gkvlrvi4s03imtk3e487nuo.apps.googleusercontent.com")

router.get('/',auth, async (req,res)=>{
    try{
        const user=await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
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

router.post('/loginwithgoogle',(req,res)=>{
    const {token}=req.body;
    client.verifyIdToken({idToken:token,audience:"403380080270-6rpdj7ll4gkvlrvi4s03imtk3e487nuo.apps.googleusercontent.com"}).then(response=>{
        const {email_verified,email,name}=response.payload;
        //console.log(email,email_verified,name);
        if(email_verified){
            User.findOne({email}).exec((err,user)=>{
                if(err){
                    return res.status(400).json({error:"Something went wrong"});
                }else{
                    if(user){
                        jwt.sign({_id:user._id},config.get('jwtSecret'),{expiresIn:360000},(err,token)=>{
                            if(err) throw err;
                            return res.json({token});
                        })
                    }else{
                        let password=email;
                        let newuser=new User({name,email,password});
                        newuser.save((err,data)=>{
                            if(err){
                                return res.status(500).json({error:"something went wrong"});
                            }
                            const token=jwt.sign({_id:data._id},config.get('jwtSecret'),{expiresIn:360000});
                            const {name,email,_id}=newuser;
                            return res.json({token,user:{_id,name,email}});
                        })
                    }
                }
            })
        }

    })
})

module.exports=router;