const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const knex = require("./db/db") ;
const mysql = require('mysql');
const { Router } = require('express');
const { check, validationResult } = require('express-validator');
var morgan = require('morgan');

const app =express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(morgan("dev"));
app.engine('hbs',exphbs({extname:'.hbs' }));
app.set('view engine','hbs');

app.get("/adduser",(req,res)=>{
    knex('log')
    res.render("add-user");
});
app.post("/adduser",[
     check('First_name','This field must be atleast 2 characters long')
        .exists()
        .isString()
        .isLength({min:3}),
     check('Last_name','This field must be atleast 2 characters long')
        .exists()
        .isString()
        .isLength({min:3}),
     check('email','Invalid email')
        .isEmail()
        .normalizeEmail(),
     check('phone','Invalid Number')
        .exists()   
        .isLength({min:10})
    ],(req,res)=>{
    knex('log')
    try{
        const errors =validationResult(req)
        console.log(errors);
            if(!errors.isEmpty()){
                console.log(errors.errors[0].msg)
               let msg=  errors.errors[0].param + " : " + errors.errors[0].msg
               return res.render('add-user',{msg})              
            }
              knex.insert(req.body).into("log")
             .then(rows=>{
             return rows ;
                      
        });
        res.redirect("/");
    }
    catch(error){
        console.log(error);
    }
});
app.get("/:id", (req, res) => {
    const page = parseInt (req.params.id);
    //let lp = 0;
    let prevpage=page-1;
    let prevPage=true;
    let nextpage=true;
    //let nextpage=page;
    //var per_page = parseInt (req.params.id);
        knex("log").paginate({
         perPage: 5,
         currentPage: page
         }).then(rows => {
         console.log("here")
         console.log(rows.pagination)
            
            if(rows.pagination.currentPage == 1){
                console.log("inn");
                res.render("home",{users:rows.data,nextpage:true,prevPage:false,currentPage:page+1});
            } else if(rows.pagination.lastPage == rows.pagination.currentPage){
                //console.log('joooo')
                res.render("home",{users:rows.data,nextpage:false,prevPage:true,prevpage});
            }else
                res.render("home",{users:rows.data,nextpage:true,prevPage:true,currentPage:page+1,prevpage});
            
            //res.render("home",{users:rows.data,currentPage:page+1,prevpage});
            
        })
    //} 
  })
  app.get('/',(req,res)=>{
   /* const currentPage =2;
    knex.select("*").from('log')
    .limit(5)
    .then(rows =>{
        console.log(rows)*/
    res.redirect("/1");
}); 
app.listen("3000",()=>{
    console.log("Hello");
});

app.get("/edit-user/:id",(req,res)=>{
    knex('log')
    .where('id',req.params.id)
    .then(rows =>{
        console.log(rows)
        res.render("edit-user",{rows,id:req.params.id});
    })    
});
app.post("/edit-update/:id",[
    check('First_name','This field must be atleast 2 characters long')
       .exists()
       .isString()
       .isLength({min:3}),
    check('Last_name','This field must be atleast 2 characters long')
       .exists()
       .isString()
       .isLength({min:3}),
    check('email','Invalid email')
       .isEmail()
       .normalizeEmail(),
    check('phone','Invalid Number')
       .exists()   
       .isLength({min:10})
   ],(req,res)=>{
    console.log(req.params);
    let user = {...req.body}
    delete user.id;
    console.log(user);
    knex('log')
    .where('id',req.params.id)
    .update(user)
    .then(()=>{
        res.redirect("/");
    })
    .catch((error)=>{ 
        console.log(error);
    });
});
app.get("/:id",(req,res)=>{
    knex('log')
    .where('id',req.params.id )
    .del()
    .then(()=>{
        res.redirect("/");
    })
    .catch((error)=>{
        console.log(error);
    });
});
app.get("/viewuser/:id",(req,res)=>{
    knex('log')
    .where('id',req.params.id)
    .then(rows =>{
        console.log(rows)
        res.render("view-user",{rows});
    })
});
