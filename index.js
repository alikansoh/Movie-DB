
const express = require('express');

const server = express();
const moviesData = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب‎', year: 1992, rating: 6.2 }
]
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

server.post("/movies/add", (req, res) => {

})

server.get("/movies/get", (req, res) => {
    let data=moviesData.map(e => e.title)
    res.json({status:200, data:data})
})

server.put("/movies/edit", (req, res) => {

})

server.patch("/movies/delete", (req, res) => {

})


server.listen(3000,()=>console.log("run server"))