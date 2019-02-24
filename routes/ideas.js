const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const {ensureAuthenticated}=require('../helpers/auth');

// load models
require('../models/Idea');
const Idea=mongoose.model('ideas');

// add idea from
router.get('/add',(req,res)=>{
    res.render('ideas/add');
});
// ideas   (for show ideas)
router.get('/',ensureAuthenticated,(req,res)=>{
    Idea.find({user:req.user.id})
    .sort({date:'desc'})
    .then(ideas=>{
        res.render('ideas/idea',{ideas:ideas});
    })
    .catch(error=>{
        console.log(error);
    })
});
// ideas/edit for edit ideas
router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
    Idea.findOne({_id:req.params.id})
    .sort({date:'desc'})
    .then(idea=>{
        res.render('ideas/edit',{idea:idea});
    });
});
// add form data
router.post('/',(req,res)=>{
    const errors=[];
    if(!req.body.title) {
        errors.push({text:'pleas enter title'});
    }
    if(!req.body.details) {
        errors.push({text:'please enter details'});
    }
    if(errors.length > 0) {
        res.render('ideas/add',{
            errors:errors,
            title:req.body.title,
            details:req.body.details,
        });
    } else {
        const userIdea={
            title:req.body.title,
            details:req.body.details,
            user:req.user.id
        }
        Idea(userIdea).save()
        .then(idea=>{
            req.flash('success_msg','ideas added successfuly');
            res.redirect('/ideas');
        })
        .catch(error=>{
            console.log(error);
        });
       
    }
});
// ideas/edit for submit after edit form
router.put('/edit/:id',(req,res)=>{
    Idea.findOne({_id:req.params.id})
    .then(idea=>{
        idea.title=req.body.title;
        idea.details=req.body.details;
        idea.save()
        .then(()=>{
            req.flash('success_msg','ideas updated');                                                                                           
            res.redirect('/ideas');
        });
    })
    .catch(error=>{
        console.log(error);
    });
});
// delete
router.delete('/delete/:id',(req,res)=>{
    Idea.remove({_id:req.params.id})
    .then(()=>{
        req.flash('success_msg','idea deleted successfuly');
        res.redirect('/ideas');
    })
    .catch(error=>{
        console.log(error);
    });
});


module.exports=router;
