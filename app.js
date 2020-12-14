'use strict';
let express = require('express');
let bodyParser = require('body-parser');
let fs = require('fs');
let db = require('./models.js')


let app = express()
let PORT = process.env.PORT || 8080;


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


app.get('/',(req,res)=>{
    res.render('login');
});

app.get('/registration',(req,res)=>{
    res.render('registration');
});

app.get('/home',(req,res)=>{
    res.render('home');
});

app.get('/novel',(req,res)=>{
    res.render('novel');
});

app.get('/poetry',(req,res)=>{
    res.render('poetry');
});

app.get('/leaves',(req,res)=>{
    res.render('leaves');
});

app.get('/sun',(req,res)=>{
    res.render('sun');
});

app.get('/flies',(req,res)=>{
    res.render('flies');
});

app.get('/grapes',(req,res)=>{
    res.render('grapes');
});

app.get('/fiction',(req,res)=>{
    res.render('fiction');
});

app.get('/dune',(req,res)=>{
    res.render('dune');
});

app.get('/mockingbird',(req,res)=>{
    res.render('mockingbird');
});

app.get('/readlist',(req,res)=>{
    res.render('readlist');
});

//? POST REQUESTS

app.post('/register',(req,res)=>{
    const {username, password} = req.body;
    // check&update arr --> db
    const ret = db.add_to_db(username, password);
    //return 1 when user name is already registered
    if(ret == 1)
        res.render('registration');
    else
        res.render('login');
});

app.post('/search',(req,res)=>{
    console.log(req.body[0]);
    res.render('searchresults');
});

app.post('/' , (req,res)=>{
    const {username,password} = req.body;
    if(db.valid_user(username,password)){
        res.render('home');
    }else{
        //TODO message
        res.render('login');
    }

})


app.listen(PORT, ()=>{
    console.log(`the server is up and running http://127.0.0.1:${PORT}`);
});


