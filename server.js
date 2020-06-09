const express = require('express')
const connectDB = require('./config/db')
const userRoute = require('./routes/api/users');
const authRoute = require('./routes/api/auth');
const profileRoute = require('./routes/api/profile');
const postsRoute = require('./routes/api/posts');
const path = require('path')



const app = express()

//connect DB from db.js file
connectDB();


//init middleware for req.body
app.use(express.json({extended: false}))


//define routes
//gets the user's file
app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/profile', profileRoute)
app.use('/api/posts', postsRoute)

//serve static assets in production
if(process.env.NODE_ENV === 'production'){
    //set static folder
    app.use(express.static('client/build'))
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server up and running on port ${PORT}`)
})