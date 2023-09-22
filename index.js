
const express = require('express');

const server = express();
const moviesData = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب‎', year: 1992, rating: 6.2 }
]

server.get("/", (req, res) => {
    res.status(200).send('ok')

})

server.get("/test", (req, res) => {
    res.status(200).send({status:200, message:"ok"})

})

server.get("/time", (req, res) => {
    let today=new Date();
    res.status(200).send({status:200 ,time:today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()})
})


server.get("/hello/:id?", (req, res) => {
        if (!req.params.id)
            req.params.id= " "
    res.status(200)
    res.send({status:200, message: 'hello,' +req.params.id})
})

server.get("/search/:s?", (req, res) => {
    if (req.params.s)
    res.send({status:200, message: 'ok,' +req.params.s})
    else
        res.status(500).send({status:500, error: true,message: 'you have to provide a search'})
})

server.post("/movies/add", (req, res) => {

})

server.get("/movies/read", (req, res) => {
    let data=moviesData.map(e => e.title)
    res.status(200).send({status:200, data:data})
})

server.put("/movies/edit", (req, res) => {

})

server.patch("/movies/delete", (req, res) => {

})

server.get("/movies/read/:order?", (req, res) => {

    let order_film = req.params.order
    let data_sorted


    if (req.params.order === 'by_title') {
        data_sorted = moviesData.sort((a, b) => {
            if (a.title < b.title)
                return -1
        })


    } else if (req.params.order === 'by_rating') {
        data_sorted = moviesData.sort((a, b) => {
            if (a.rating > b.rating)
                return -1
        })
    } else if (req.params.order === 'by_year') {
        data_sorted = moviesData.sort((a, b) => {
            if (a.year < b.year)
                return -1
        })
    }



    res.send({status: 200, data: data_sorted == null ? "enter correct sort method('by_rating,by_year,by_title') ": data_sorted})
})
server.get("/movies/read/id/:id?", (req, res) => {


    if (req.params.id > moviesData.length || req.params.id<0)

       res.status(404).send({status:404, error:true, message:'the movie '+req.params.id +'  does not exist'})

    else {
        let movie = moviesData[req.params.id].title
        res.status(200).send({status: 200, data: movie})

    }
})


server.listen(3000,()=>console.log("run server"))