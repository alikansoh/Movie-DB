
const express = require('express');

const server = express();
server.get("/", (req, res) => {
    res.send('ok')
})

server.get("/test", (req, res) => {
    res.json({status:200, message:"ok"})
})

server.get("/time", (req, res) => {
    let today=new Date();
    res.json({status:200 ,time:today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()})
})


server.get("/hello/:id?", (req, res) => {
        if (!req.params.id)
            req.params.id= " "
    res.json({status:200, message: 'hello,' +req.params.id})
})

server.get("/search/:s?", (req, res) => {
    if (req.params.s)
    res.json({status:200, message: 'ok,' +req.params.s})
    else
        res.json({status:500, error: true,message: 'you have to provide a search'})
})





server.listen(3000,()=>console.log("run server"))