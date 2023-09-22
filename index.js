
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
    res.status(200).send({status:res.statusCode, message:"ok"})

})

server.get("/time", (req, res) => {
    let today=new Date();
    res.status(200).send({status:res.statusCode ,time:today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()})
})


server.get("/hello/:id?", (req, res) => {
        if (!req.params.id)
            req.params.id= " "
    res.status(200)
    res.send({status:res.statusCode, message: 'hello,' +req.params.id})
})

server.get("/search", (req, res) => {
    let search=  req.query.s;
    if (search) {
        res.status(200).send( `status: ${res.statusCode}, message: 'ok', data: ${search} `);
    } else {
        res.status(500).send(` status: ${res.statusCode}, error: true, message: 'you have to provide a search`);
    }
})

server.get('/movies/add', function(req, res){
    let title = req.query.title
    let year = req.query.year
    let rating = req.query.rating || 4
    if (!title || !year){
        res.status(403).send(` status: ${res.statusCode}, error: true, message: 'you have to provide a title and a year'`);
    }else if(year.length < 4 ){
        res.status(403).send(` status: ${res.statusCode}, error: true, message: 'make sure you put 4 digits'`);
    }
    else
    {
        moviesData.push({title: title, year: year, rating: rating||4,id:moviesData+1})
        res.status(200).send(`status:${res.statusCode}. movies has been added successfully`);
    }
});


server.get("/movies/read", (req, res) => {
    let data=moviesData.map(e => e.title)
    res.status(200).send({status:res.statusCode, data:data})
})

server.get("/movies/edit", (req, res) => {

})

server.get("/movies/delete", (req, res) => {

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



    res.send({status: res.statusCode, data: data_sorted == null ? "enter correct sort method('by_rating,by_year,by_title') ": data_sorted})
})
server.get("/movies/read/id/:id?", (req, res) => {


    if (req.params.id > moviesData.length || req.params.id<0)

       res.status(404).send({status:res.statusCode, error:true, message:'the movie '+req.params.id +'  does not exist'})

    else {
        let movie = moviesData[parseInt(req.params.id)-1].title
        res.status(200).send({status: res.statusCode, data: movie})

    }
})


server.listen(3000,()=>console.log("run server"))