'use strict';
let express = require('express');
let session = require('express-session');
let bodyParser = require('body-parser');
let fs = require('fs');
let db = require('./models.js');

let app = express()
let PORT = process.env.PORT || 8080;
let SESS_SECRET = process.env.SECRET || 'secret';
let SESS_NAME = 'pom';



if (!fs.existsSync('db.json'))
    // create and empty db 
    db.update_db();
// read data in the db
db.read_db()

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended: false
}));

// handling the sessions & cookies
app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,    
    cookie: {
        maxAge: 1000 * 60 * 60 * 2, // 2 houres
        sameSite: true,
        secure: false,   
    }
}));

// check the cookie --> user_name
function redirectLogin(req,res,next){
    console.log('in',req.session.user_name);
    console.log(req.session)
    if(!req.session.user_name){
        req.session.msg = "you have to login first";
        res.redirect('/');
    }else{
        console.log(req.session.user_name);
        next();
    }
}


app.get('/',(req,res)=>{
    let tmp = req.session.msg;
    if(tmp)
        res.clearCookie(SESS_NAME);
    res.render('login',{msg: tmp});

});

app.get('/registration',(req,res)=>{
    res.render('registration');
});

app.get('/home',redirectLogin,(req,res)=>{
    
    res.render('home');
});

app.get('/novel',redirectLogin,(req,res)=>{
    res.render('novel');
});

app.get('/poetry',redirectLogin,(req,res)=>{
    res.render('poetry');
});

app.get('/leaves',redirectLogin,(req,res)=>{
    res.render('leaves');
});

app.get('/sun',redirectLogin,(req,res)=>{
    res.render('sun');
});

app.get('/flies',redirectLogin,(req,res)=>{
    res.render('flies');
});

app.get('/grapes',redirectLogin,(req,res)=>{
    res.render('grapes');
});

app.get('/fiction',redirectLogin,(req,res)=>{
    res.render('fiction');
});

app.get('/dune',redirectLogin,(req,res)=>{
    res.render('dune');
});

app.get('/mockingbird',redirectLogin,(req,res)=>{
    res.render('mockingbird');
});

app.get('/readlist',redirectLogin,(req,res)=>{
    res.render('readlist');
});

//? POST REQUESTS

app.post('/register',(req,res)=>{
    const {username, password} = req.body;
    // check&update arr --> db
    const ret = db.add_to_db(username, password);
    // return 1 when user name is already registered
    // TODO return a info message
    if(ret == 1)
        res.render('registration',{msg: "Username is already taken!"});
    else
        res.render('login');
});

app.post('/search',(req,res)=>{
    console.log(req.body);
    // TODO implemetent
    res.render('searchresults');
});

app.post('/' , (req,res)=>{
    const {username,password} = req.body;
    if(db.valid_user(username,password)){
        req.session.user_name=username;
        console.log(req.session.user_name);
        console.log(req.session)
        return res.redirect('/home');
    }else{
        // TODO message
        res.render('login', {msg : "Wrong username or password!"});
    }

})


app.listen(PORT, ()=>{
    console.log(`the server is up and running http://127.0.0.1:${PORT}`);
});


