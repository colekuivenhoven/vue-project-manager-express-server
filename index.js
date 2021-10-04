var express = require("express");
var app = express();
var cors = require('cors');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var fs = require('fs');
var bcrypt = require('bcrypt');
var util = require('util');
/*var log_file = fs.createWriteStream(__dirname
                                    +'/logs/'
                                    +(formatDate(new Date()))
                                    +"_"+(new Date().getHours())+"-"
                                    +(new Date().getMinutes())+"-"
                                    +(new Date().getSeconds())
                                    +'.log', {flags : 'w'});*/
var log_stdout = process.stdout;
var jwt = require('jsonwebtoken');
var secret = 'holy1cow2';

/*console.log = function(d) {
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
};*/

app.use("/static", express.static(__dirname+"/static"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/*
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
*/

app.use(cors());

var MongoClient = require("mongodb").MongoClient;
const { ObjectID } = require("bson");
MongoClient.connect("mongodb://localhost:27017",{useNewUrlParser: true, useUnifiedTopology: true},
function(error, client) {
    var blog = client.db("ServerDB");
    console.log("");
    console.log("");
    console.log("%                                                    >> SERVER APPLICATION STARTING %");
    br();
    console.log(">> "+(new Date().getHours())+":"
                     +(new Date().getMinutes())+":"
                     +(new Date().getSeconds())
                     +" Connected to Database --");
    br();

    app.get("/", function(req, res, next) {
        console.log("-- Access to HOME detected: "+req.ip+" --");
        res.render("home");
        br();
    });

    app.get("/users", function(req, res) {
        console.log(">> "+(new Date().getHours())+":"
                         +(new Date().getMinutes())+":"
                         +(new Date().getSeconds())
                         +" Access to ALL USERS detected: "+req.ip+" --");
        blog.collection("users").find().sort({"_id": -1}).toArray(function(error, users){
            res.render("users",{users: users});
        });
        br();  
    });

    app.get("/posts", function(req, res) {
        console.log(">> "+(new Date().getHours())+":"
                         +(new Date().getMinutes())+":"
                         +(new Date().getSeconds())
                         +" Access to ALL POSTS detected: "+req.ip+" --");
        blog.collection("posts").find().sort({"_id": -1}).toArray(function(error, posts){
            res.json({ posts: posts });
        });
        br();  
    });

    app.get("/projects", function(req, res) {
        console.log(">> "+(new Date().getHours())+":"
                         +(new Date().getMinutes())+":"
                         +(new Date().getSeconds())
                         +" Access to ALL PROJECTS detected: "+req.ip+" --");
        blog.collection("projects").find().sort({"_id": -1}).toArray(function(error, projects){
            res.json({ projects: projects });
        });
        br();  
    });

    app.get("/user/:id", function(req, res) {
        console.log(">> "+(new Date().getHours())+":"
                         +(new Date().getMinutes())+":"
                         +(new Date().getSeconds())
                         +" Access to USER "+req.params.id+" detected: "+req.ip+" --");
        blog.collection("users").findOne({"_id": ObjectID(req.params.id)}, function(error, user){
            res.render("user",{user: user});
        });
        br();  
    });

    app.get("/project/:id", function(req, res) {
        console.log(">> "+(new Date().getHours())+":"
                         +(new Date().getMinutes())+":"
                         +(new Date().getSeconds())
                         +" Access to PROJECT "+req.params.id+" detected: "+req.ip+" --");
        blog.collection("projects").findOne({"_id": ObjectID(req.params.id)}, function(error, project){
            res.json({ project: project });
        });
        br();  
    });

    app.get("/post/:id", function(req, res) {
        console.log(">> "+(new Date().getHours())+":"
                         +(new Date().getMinutes())+":"
                         +(new Date().getSeconds())
                         +" Access to POST "+req.params.id+" detected: "+req.ip+" --");
        blog.collection("posts").findOne({"_id": ObjectID(req.params.id)}, function(error, post){
            res.json({ post: post });
        });
        br();  
    });

    app.get("/post/:id/delete", function(req, res) {
        console.log(">> "+(new Date().getHours())+":"
                         +(new Date().getMinutes())+":"
                         +(new Date().getSeconds())
                         +" Access to DELETE POST "+req.params.id+" detected: "+req.ip+" --");
        
        blog.collection("posts").deleteOne({"_id": ObjectID(req.params.id)}, function(error, post){
            console.log(">> | >> Deleted Post --");
            res.send("Post Deletion Successful");
            br();
        });
    });

    app.get("/post/delete/all", function(req, res) {
        console.log(">> "+(new Date().getHours())+":"
                         +(new Date().getMinutes())+":"
                         +(new Date().getSeconds())
                         +" Access to DELETE POSTS ALL "+req.params.id+" detected: "+req.ip+" --");
        
        blog.collection("posts").deleteMany({}, function(error, post){
            console.log(">> | >> Deleted Posts --");
            res.send("All Post Deletion Successful");
            br();
        });
    });

    app.get("/post/delete/null", function(req, res) {
        console.log(">> "+(new Date().getHours())+":"
                         +(new Date().getMinutes())+":"
                         +(new Date().getSeconds())
                         +" Access to DELETE POSTS NULL "+req.params.id+" detected: "+req.ip+" --");
        
        blog.collection("posts").deleteMany({"project_id": null}, function(error, post){
            console.log(">> | >> Deleted Posts --");
            res.send("Null Post Deletion Successful");
            br();
        });
    });

    app.get("/user/:id/delete", function(req, res) {
        console.log(">> "+(new Date().getHours())+":"
                         +(new Date().getMinutes())+":"
                         +(new Date().getSeconds())
                         +" Access to DELETE USER "+req.params.id+" detected: "+req.ip+" --");
        blog.collection("users").deleteOne({"_id": ObjectID(req.params.id)}, function(error, user){
            console.log(">> | >> Deleted User --");
            res.send("User Deletion Successful");
        });
        br();
    });

    app.get("/project/:id/delete", function(req, res) {
        console.log(">> "+(new Date().getHours())+":"
                         +(new Date().getMinutes())+":"
                         +(new Date().getSeconds())
                         +" Access to DELETE PROJECT "+req.params.id+" detected: "+req.ip+" --");
        blog.collection("projects").deleteOne({"_id": ObjectID(req.params.id)}, function(error, project){
            console.log(">> | >> Deleted Project --");
            blog.collection("posts").deleteMany({"project_id": req.params.id}, function(error, posts) {
                console.log(">> | >> | >> Deleted Project Posts --");
                res.send("Full Project Deletion Successful");
            });
        });
        br();
    });

    app.post("/login-user", function(req, res1) {
        console.log(">> "+(new Date().getHours())+":"
                         +(new Date().getMinutes())+":"
                         +(new Date().getSeconds())
                         +" LOGIN-USER request made: "+JSON.stringify(req.body.email)+": IP: "+req.ip+" --");
        blog.collection("users").findOne({"email": req.body.email}, function(err, user) {
            if (err) {
                console.log(">> | >> Login Rejected: ERROR 01 --");
                res1.send(err);
                br();
            }

            if (!user) {
                console.log(">> | >> Login Rejected: NO USER EXISTS --");
                res1.send(err);
                br();
            }
            else {
                bcrypt.compare(req.body.password, user.password, function(err, res2) {
                    if (err) {
                        console.log(">> | >> Login Rejected: ERROR 02 --");
                        res.send(err); 
                        br();
                    }
    
                    if (user && res2) {
                        const token = jwt.sign(user, secret);
                        console.log(">> | >> Login Approved: "+user.email+" --");
                        res1.json({ token: token, user: user });
                        //res.send(user);
                        br();
                    }
                    else
                    {
                        console.log(">> | >> Login Rejected: PASSWORD MISMATCH --");
                        res1.send("Login Rejected");
                        br();
                    }
                });
            }
        });
    });

    app.post("/register-user", function(req, res) {
        console.log(">> "+(new Date().getHours())+":"
                         +(new Date().getMinutes())+":"
                         +(new Date().getSeconds())
                         +" Access to REGISTER detected: "+req.ip+" --");
        blog.collection("users").insertOne(req.body, function(error, document) {
            console.log(">> | >> Registered New User: "+req.body.email+" --");
            res.send("Registration Successful!");
            br();
        });
    });

    app.post("/add-post", function(req, res) {
        console.log(">> "+(new Date().getHours())+":"
                         +(new Date().getMinutes())+":"
                         +(new Date().getSeconds())
                         +" Access to ADD POST detected: "+req.ip+" --");
        blog.collection("posts").insertOne(req.body, function(error, document) {
            console.log(">> | >> Added New POST: "+req.body.title+" --");
            res.send("Posted Successfully!");
            br();
        });
    });

    app.post("/add-project", function(req, res) {
        console.log(">> "+(new Date().getHours())+":"
                         +(new Date().getMinutes())+":"
                         +(new Date().getSeconds())
                         +" Access to ADD PROJECT detected: "+req.ip+" --");
        blog.collection("projects").insertOne(req.body, function(error, document) {
            console.log(">> | >> Added New Project: "+req.body.number+" --");
            res.send("Project Creation Successful!");
        });
        br();
    });
    app.post("/project/:id/edit", function(req, res) {
        console.log(">> "+(new Date().getHours())+":"
                         +(new Date().getMinutes())+":"
                         +(new Date().getSeconds())
                         +" Access to EDIT PROJECT detected: "+req.ip+" --");
        //console.log(req.params.id);
        //console.log(req.body);
        blog.collection("projects").updateOne(
            {"_id": ObjectID(req.params.id)}, 
            {"$set":
                {
                    "name": req.body.name,
                    "number": req.body.number,
                    "date_due": req.body.date_due,
                    "description": req.body.description,
                    "client": req.body.client,
                    "cost": req.body.cost,
                    "users": req.body.users,
                    "type": req.body.type,
                    "status": req.body.status,
                }
            },
            function(error, document) {
                if (error) {
                    console.log(">> | >> Project Edit Failed: "+error+" --");
                    res.send("Project Edit Failed!");
                    br();
                }
                else {
                    console.log(">> | >> Edited Project: "+req.body.number+" --");
                    //res.send(req.body);
                    blog.collection("projects").findOne({"_id": ObjectID(req.params.id)}, function(error, project){
                        res.send(project);
                    });
                    br();
                }
            });
    });
    app.post("/user/:id/edit", function(req, res) {
        console.log(">> "+(new Date().getHours())+":"
                         +(new Date().getMinutes())+":"
                         +(new Date().getSeconds())
                         +" Access to EDIT USER detected: "+req.ip+" --");
        blog.collection("users").updateOne(
            {"_id": ObjectID(req.params.id)},
            {"$set": 
                {
                "firstname": req.body.firstname,
                "lastname": req.body.lastname,
                "email": req.body.email,
                "password": req.body.password,
                "type": req.body.type
                }
            }, 
            function(error, user){
                console.log(">> | >> Edit Made Successfully: "+req.body.email+" --");
                res.send("User Edit Successful!");
        });
        br();
    });

    app.listen(3000, function() {
        console.log(">> "+(new Date().getHours())+":"
                         +(new Date().getMinutes())+":"
                         +(new Date().getSeconds())
                         +" Listening on port 3000 --");
        br();
    });

});

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function br() {
    console.log("% --------------------------------------------------------------------------------- %");
}