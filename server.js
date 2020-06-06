const express = require('express')

const app = express()



app.get('/',(req,res) => {
    res.send('api up')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server up and running on port ${PORT}`)
})