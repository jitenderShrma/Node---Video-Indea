const mongoose=require('mongoose');
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const bcrypt=require('bcryptjs');
require('../models/User');
const User=mongoose.model('users');
module.exports=function(passport){
    passport.use(new LocalStrategy({usernameField:'email'},(email,password,done)=>{
        User.findOne({email:email})
        .then(user=>{
            if(!user){
                return done(null,false,{message:'user not found'});
            } else{
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                        return done(null,user);
                    }else{
                        return done(null,false,{message:'password Incurrect'});
                    }
                }); 
            }
        })
    }));
    
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id); 
        // where is this user.id going? Are we supposed to access this anywhere?
    });

         // used to deserialize the user
        passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
        done(err, user);
    });
});
    
}
