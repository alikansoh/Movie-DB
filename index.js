
const express = require('express');
const mongoose = require('mongoose');
const Movie = require('./modules/MoviesModel.js');
const { json } = require('express/lib/response');

const server = express();
server.use(express.json())

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

server.post('/movies/add', async function(req, res) {
    try {
      let title = req.query.title;
      let year = req.query.year;
      let rating = req.query.rating || 4;
  
      if (!title || !year) {
        return res.status(403).json({
          status: res.statusCode,
          error: true,
          message: 'You must provide a title and a year',
        });
      } else if (year.length !== 4) {
        return res.status(403).json({
          status: res.statusCode,
          error: true,
          message: 'Year must be exactly 4 digits',
        });
      } else {
        const movie = await Movie.create({ title, year, rating });
        return res.status(200).json({
          status: res.statusCode,
          message: 'Movie has been added successfully',
          data: movie,
        });
      }
    } catch (error) {
      console.error('An error occurred:', error); // Log the error for debugging
      return res.status(500).json({
        status: res.statusCode,
        error: true,
        message: 'An error has occurred',
        details: error.message, // Include the error message for debugging
      });
    }
  });
  


server.get("/movies/read", async (req, res) => {
    try{
        const movie = await Movie.find({})
    res.status(200).send({status:res.statusCode, data:movie})
    }
    catch(error){
        console.error('An error occurred:', error); // Log the error for debugging
        res.status(500).send({status:res.statusCode, error:true, message:'An error has occurred', details:error.message})
    }
})

server.put("/movies/edit", async(req, res) => {

    try{
        const id =req.query.id
        console.log(req.query)
        const movie = await Movie.findByIdAndUpdate(id,req.query,{new:true})
        if(!movie){
            res.status(404).send({status: 404, error: true, message: `The movie with ID ${id} does not exist`});
        }
          res.status(200).send({status: 200, error: false, message: 'Movie edited successfully', data:movie});
        }catch(error) {
    
            res.status(404).send({status:res.statusCode, error:true, message:'the movie '+req.params.id +'  does not exist'})
        }
    }
)

server.delete("/movies/delete/:id", async(req, res) => {
    try{
        let id =req.params.id
        const movie = await Movie.findByIdAndDelete(id,{new:true})
        const movies= await Movie.find({})
        if(!movie){
            res.status(404).send({status: 404, error: true, message: `The movie with ID ${id} does not exist`});
        }
          res.status(200).send({status: 200, error: false, message: 'Movie deleted successfully', data:movies});
        }catch(error) {
    
            res.status(404).send({status:res.statusCode, error:true, message:'the movie '+req.params.id +'  does not exist'})
        }

         
    }
)

server.get("/movies/read/:order?",async (req, res) => {

    let order_film = req.params.order
    let data_sorted

    try{
        let movies=  await Movie.find({})

    if (req.params.order === 'by_title') {
        data_sorted = movies.sort((a, b) => {
            if (a.title < b.title)
                return -1
        })


    } else if (req.params.order === 'by_rating') {
        data_sorted = movies.sort((a, b) => {
            if (a.rating > b.rating)
                return -1
        })
    } else if (req.params.order === 'by_year') {
        data_sorted = movies.sort((a, b) => {
            if (a.year < b.year)
                return -1
        })
    }
    }
    catch (e) {
        console.log(e)
    }


    res.send({status: res.statusCode, data: data_sorted == null ? "enter correct sort method('by_rating,by_year,by_title') ": data_sorted})
})
server.get("/movies/read/id/:id", async(req, res) => {
    
    const id = req.params.id
    
    
    try{
    const movie = await Movie.findById(id)
    res.status(200).send({status: res.statusCode, data: movie})
    }catch(error) {

        res.status(404).send({status:res.statusCode, error:true, message:'the movie '+req.params.id +'  does not exist'})
        
    }

}
)


mongoose.connect("mongodb+srv://alikanso:45452525Uh@restapi.qm8uhwy.mongodb.net/node-api?retryWrites=true&w=majority")

.then(()=>{
    console.log("connected to mongoDB")
    server.listen(3000,()=>console.log("run server"))
   

    }) .catch((error) =>{
            console.log(error)
    })