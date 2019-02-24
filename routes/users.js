const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const passport=require('passport');

// load models
require('../models/User');
const User=mongoose.model('users');

// for reach at register form
router.get('/register',(req,res)=>{
    res.render('users/register');
});
// after form submit post request
router.post('/register',(req,res)=>{
    const errors=[];
    if(req.body.password.length<4){
        errors.push({text:'password must be >=4 charactor'});
        
    }
    if(req.body.password!=req.body.password2) {
        errors.push({text:'password does not match'});
    }
    if(errors.length > 0 ){
        res.render('users/register',{
            errors:errors,
            password:req.body.password,
            password2:req.body.password2
        });
    } else {
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(req.body.password,salt,(err,hash)=>{
                password=hash;
                User({
                    name:req.body.name,
                    email:req.body.email,
                    password:password
                }).save()
                .then(user=>{
                    req.flash('success_msg','registered successfuly');
                    res.redirect('/users/login');
                })
                .catch(error=>{
                    console.log(error);
                });
            });
        });
    }  
});
router.get('/login',(req,res,next)=>{
    res.render('users/login');
});
// login user
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        failureRedirect:'/users/login',
        successRedirect:'/ideas',
        failureFlash:true
    })(req,res,next);
    
});

// logout
router.get('/logout',(req,res,next)=>{
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports=router;



