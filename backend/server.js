require('dotenv').config()

const express=require('express')
const mongoose = require('mongoose')
const petsRoutes = require('./routes/pets')
const authRoutes = require('./routes/auth')

//express app
const app=express()

if (process.env.NODE_ENV !== 'production' && !process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'local-development-secret-change-before-deploying';
}
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be set in production.');
}

app.use(express.json())
app.use((req,res,next)=>{
    console.log(req.path,req.method)
    next()
})

app.use('/api/pets',petsRoutes)
app.use('/api/auth', authRoutes)

//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        //liston for requests
        app.listen(process.env.PORT,()=>{
            console.log('listening on port 4000')
        })

    })
    .catch((error)=>{
        console.log(error)
    })


