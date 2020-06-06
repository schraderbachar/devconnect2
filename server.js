const express = require('express')
const connectDB = require('./config/db')
const userRoute = require('./routes/api/users');
const authRoute = require('./routes/api/auth');
const profileRoute = require('./routes/api/profile');
const postsRoute = require('./routes/api/posts');




const app = express()

//connect DB from db.js file
connectDB();


//init middleware for req.body
app.use(express.json({extended: false}))

app.get('/',(req,res) => {
    res.send('api up')
})

//define routes
//gets the user's file
app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/profile', profileRoute)
app.use('/api/posts', postsRoute)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server up and running on port ${PORT}`)
})