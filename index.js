
const express = require('express');
const mongoose = require('mongoose');
const Movie = require('./modules/MoviesModel.js');
const { json } = require('express/lib/response');
const User = require('./modules/UserModel.js');

const server = express();
server.use(express.json())

const moviesData = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب‎', year: 1992, rating: 6.2 }
]
const isUser = async (username, password) => {
  try {
    const user = await User.findOne({ username, password });

    if (user) {
      return true; 
    } else {
      return false; 
    }
  } catch (error) {
    console.error('An error occurred:', error);
    return false; 
  }
};
const authenticateUser = async (req, res, next) => {
    const { user, password } = req.body;
  
    if (!user || !password) {
      return res.status(403).json({
        status: 403,
        error: true,
        message: 'You must provide a valid username and password for authentication.',
      });
    }
  
    if (!(await isUser(user, password))) {
      return res.status(403).json({
        status: 403,
        error: true,
        message: 'Authentication failed. You are not authorized to perform this action.',
      });
    }
  
    next();
  };
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

server.post('/movies/add', authenticateUser, async function (req, res) {
    try {
      let title = req.body.title;
      let year = req.body.year;
      let rating = req.body.rating || 4;
  
      if (!title || !year) {
        return res.status(403).json({
          status: 403,
          error: true,
          message: 'You must provide a title and a year',
        });
      } else if (year.toString().length !== 4) {
        return res.status(403).json({
          status: 403,
          error: true,
          message: 'Year must be exactly 4 digits',
        });
      } else {
        const movie = await Movie.create({ title, year, rating });
        return res.status(200).json({
          status: 200,
          message: 'Movie has been added successfully',
          data: movie,
        });
      }
    } catch (error) {
      console.error('An error occurred:', error); // Log the error for debugging
      return res.status(500).json({
        status: 500,
        error: true,
        message: 'An error has occurred',
        details: error.message, // Include the error message for debugging
      });
    }
  });
  


server.get("/movies/read",authenticateUser, async (req, res) => {
    try{
        const movie = await Movie.find({})
    res.status(200).send({status:res.statusCode, data:movie})
    }
    catch(error){
        console.error('An error occurred:', error); // Log the error for debugging
        res.status(500).send({status:res.statusCode, error:true, message:'An error has occurred', details:error.message})
    }
})

server.put("/movies/edit",authenticateUser, async(req, res) => {

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

server.delete("/movies/delete/:id", authenticateUser,async(req, res) => {
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

server.get("/movies/read/:order?",authenticateUser,async (req, res) => {

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
server.get("/movies/read/id/:id",authenticateUser, async(req, res) => {
    
    const id = req.params.id
    
    
    try{
    const movie = await Movie.findById(id)
    res.status(200).send({status: res.statusCode, data: movie})
    }catch(error) {

        res.status(404).send({status:res.statusCode, error:true, message:'the movie '+req.params.id +'  does not exist'})
        
    }

}
)
// user CRUD operation//////////////////////////////////////////////////////////////////

server.post('/user/add',authenticateUser,async (req, res) => {
    var user=req.query.username
    var password=req.query.password
    var users= await User.find({})
    var founded= false
    try{
        users.forEach(usersaved => {
            if(usersaved.username==user){
                founded=true
            }
        })
        if(founded==true) 
        {
            res.status(403).send({status: 403, error: true, message: 'User already exist'})
        }

        else if(user && password ){
        var username = await User.create(req.query)
        res.status(200).send({status: res.statusCode, data:username})
        }
       
        else
        {
            res.status(403).send({status: 403, error: true, message: 'You must provide a username and a password'})
        }
  
    }
    catch(error){
        console.error('An error occurred:', error); // Log the error for debugging
        res.status(500).send({status:res.statusCode, error:true, message:'An error has occurred', details:error.message})
    }

}
)

server.get('/user/read',authenticateUser,async(req, res) => {
 try{
        const user = await User.find({})
        res.status(200).send({status: res.statusCode, data: user})
    }
    catch(error){
        console.error('An error occurred:', error); // Log the error for debugging
        res.status(500).send({status:res.statusCode, error:true, message:'An error has occurred', details:error.message})
    }
    
})

server.put('/user/edit', authenticateUser,async(req,res)=>{
    var user=req.query.username
    var password=req.query.password
    var id=req.query.id
    var users= await User.find({})
    var founded= false
    try{
        users.forEach(usersaved => {
            if(usersaved.username==user){
                founded=true
            }
        })
        
       

         if(user && password && id){
            if(founded==true) 
            {
                res.status(403).send({status: 403, error: true, message: 'User already exist'})
            }
            else
                var username = await User.findByIdAndUpdate(id,req.query,{new:true})
                res.status(200).send({status: res.statusCode, data:username})
        }
       
        else
        {
            res.status(403).send({status: 403, error: true, message: 'You must provide and id and  a username and a password'})
        }
  
    }
    catch(error){
        console.error('An error occurred:', error); // Log the error for debugging
        res.status(500).send({status:res.statusCode, error:true, message:'An error has occurred', details:error.message})
    }

}
)

server.delete('/user/delete/:id',authenticateUser, async(req, res) => {
    if(req.params.id )
    {
        res.status(403).send({status: 403, error: true, message: 'You must provide an id'})
    }
    else{
        try{
            const user = await User.findByIdAndDelete(req.params.id,{new:true})
            const users= await User.find({})
            if(!user){
                res.status(404).send({status: 404, error: true, message: `The user with ID ${id} does not exist`});
            }
              res.status(200).send({status: 200, error: false, message: 'User deleted successfully', data:users});
            }catch(error) {
                res.status(500).send({status:res.statusCode, error:true, message:'An error has occurred', details:error.message})

            }
    }

     
})

mongoose.connect("mongodb+srv://alikanso:45452525Uh@restapi.qm8uhwy.mongodb.net/node-api?retryWrites=true&w=majority")

.then(()=>{
    console.log("connected to mongoDB")
    server.listen(3000,()=>console.log("run server"))
   

    }) .catch((error) =>{
            console.log(error)
    })