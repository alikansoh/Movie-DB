
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


server.listen(3000,()=>console.log("run server"))