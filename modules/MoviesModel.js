const mongoose = require('mongoose');

const moviesSchema=mongoose.Schema(
    {
        title:{
            type:String,
            required:true
        },
        year:{
            type:Number,
            required:true
        },
        rating:{
            type:Number,
            required:true
    }
},
{
    timestamps:true
}
)

const Movies=mongoose.model('Movies',moviesSchema)

module.exports=Movies