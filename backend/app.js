const express = require("express");
const app = express();
const Post = require('./models/post')
const mongoose = require('mongoose')
const bodyParser = require("body-parser")

mongoose.connect("mongodb+srv://safgillani:Ahmad%404993@mongocluster.s4pmhtt.mongodb.net/?retryWrites=true&w=majority&appName=MongoCluster").then(() => {
    console.log('connected to database')
}).catch((e) => {
    console.log('connection failed', e)
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    next();
})
// password for mongo db
// username:"safgillani"
// password:"Ahmad@4993"
app.post("/api/posts", (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then(createdPost => {
    res.status(201).json({
        message: "Post created successfully",
        postId:createdPost._id
    })
    })
})

app.get('/api/posts', (req, res, next) => {
    Post.find().then(documents => {
        res.status(200).json({
            message: "Posts fetched Successfully",
            posts: documents
        })
    })

})

app.delete("/api/posts/:id", (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }).then(result => {
        res.status(200).json({ message: "Post deleted!" })
    })
})

module.exports = app