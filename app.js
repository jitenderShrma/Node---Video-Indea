const express=require('express');
const mongoose=require('mongoose');
const user=require('./routes/users');
const idea=require('./routes/ideas');
const bodyParser=require('body-parser');
const methodOverride=require('method-override');
const exphbs=require('express-handlebars');
const session=require('express-session');
const flash=require('connect-flash');
const passport = require('passport');

// connect to database
mongoose.connect('mongodb://jitender:jitender1@ds229458.mlab.com:29458/video_idea',{
    useNewUrlParser:true
})
.then(connect=>{
    console.log('connect to database...');
})
.catch(error=>{
    console.log(error);
});

//initlize point
const app=express();

// passport load
require('./config/passport')(passport);

// body-parser middlwrare
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//express-handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
//method override
app.use(methodOverride('_method'));

//express-session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));
// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Globale varible
app.use(function(req,res,next){
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    res.locals.user=req.user ||null;
    next();
});

// routes load
app.use('/ideas',idea);
app.use('/users',user);

// router use
app.use('/about',(req,res,next)=>{
   res.render('about');
});
// index router
app.use('/',(req,res)=> {
    const title='Welcome';
    res.render('index',{title:title});
});

//listen port
const port=5000;

// listen to server
app.listen(port,()=>{
    console.log('server listen at '+port);
});
