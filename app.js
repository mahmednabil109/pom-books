'use strict';

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const db = require('./utils/models.js');
const { json } = require('body-parser');

const app = express()
const PORT = process.env.PORT || 8080;
const SESS_SECRET = process.env.SECRET || 'secret';
const SESS_NAME = process.env.SESS_NAME|| 'pom';

if (!fs.existsSync('db.json'))
    // create and empty db 
    db.update_db();
// read data in the db
db.read_db();

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended: false,
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
    },
}));

//? REDIRECT FUNCTIONS

// check the cookie --> user_name
function redirectLogin(req,res,next){
    if(!req.session.user_name){
        req.session.msg = "you have to login first";
        res.redirect('/');
    }else{
        next();
    }
}

function redirectHome(req,res,next){
     if(!req.session.user_name)
        next();
    else
        res.redirect('/home');
}

//? GET REQUESTS

// to match the url with page currently displayed
app.get('/',redirectHome,(req,res)=>{
    res.redirect('/login');
});

// adding redirect home incase the user is aleardy signed in
app.get('/login',redirectHome,(req,res)=>{
    let tmp = req.session.msg;
    if(tmp)
        res.clearCookie(SESS_NAME);
    res.render('login',{msg: tmp});

});

app.get('/registration',(req,res)=>{
    res.render('registration');
});

// adding the route for the user to logout and end the session

app.get('/logout',(req,res)=>{
    res.clearCookie(SESS_NAME);
    res.redirect('\login');
});

app.get('/readlist', redirectLogin, (req, res)=>{
    let pages = db.get_readList(req.session.user_name);
    let books = [];
    db.books.map((entry)=>{
        if(pages.includes(entry.page))
            books.push(entry);
    });
    res.render('readlist', {books});
});

app.get('/searchresults', redirectLogin, (req, res)=>{
    let result = req.session.searchResult || [];
    // clear search results from session
    req.session.searchResult = [];
    res.render('searchresults', {result});
});

// this route uses regex to count for any requests to none exist resources
// this reges matches any string that ends with .ico or .mp4
app.get(/^\/(.*)\..*/,(req,res)=>{
    res.status(404);
    res.send('<h1 style="color:red;text-align:center">404 :(</h1>');
});

// this is a url template -place holder for any url- not `:page` is a pramater
app.get('/:page',redirectLogin,(req,res)=>{
    // use req.params to access --> the url paramater
    // we have to check for errors as the user might ask for a page that is not exist 
    let msg = req.session.msg;
    if(req.session.msg) 
        req.session.msg = "";
    res.render(`${req.params.page}`, {msg}, (err, html)=>{
        // return simple 404 page if there is any error
        if(err){
            res.status(404);
            return res.send('<h1 style="color:red;text-align:center">404 :(</h1>');
        }
        // or simply return the rendered page
        res.send(html);
    });
});


//? POST REQUESTS

app.post('/register',(req,res)=>{
    const {username, password} = req.body;
    // check&update arr --> db
    // return false when user name is already registered
    if(!db.add_to_db(username,password))
        res.render('registration',{msg: "Username is already taken!"});
    else
        res.redirect('login');
});

// TODO implement the search functionality
app.post('/search',(req,res)=>{
    let text = req.body.Search.toLowerCase().trim();
    let result =[];
    db.books.map((entry)=>{
        if(entry.title.toLowerCase().includes(text) && text)
            result.push(entry);
    });
    req.session.searchResult = result;
    res.redirect('searchresults');
});

app.post('/login' , (req, res)=>{
    const {username,password} = req.body;
    if(db.valid_user(username,password)){
        req.session.user_name=username;
        return res.redirect('/home');
    }else{
        res.render('login', {msg : "Wrong username or password!"});
    }
});

app.post('/addToReadList', (req, res)=>{
    let success = db.add_to_readList(req.session.user_name, req.body.bookname);
    let msg = "book already exists";
    if(success){
        msg = "book added successfully";
    }
    req.session.msg = msg;
    res.redirect(`/${req.body.bookname}`);
});

// initiating the server
app.listen(PORT, ()=>{
    console.log(`the server is up and running http://127.0.0.1:${PORT}`);
});


