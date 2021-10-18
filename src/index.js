const express = require('express')
const routerApi= require('./app/routes')

const app = express()
const port = 3000 


app.use(express.json())

app.listen(port,() => {
    console.log (`Server listening on port ${port}`)
})

routerApi(app) 




