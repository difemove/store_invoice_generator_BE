const express = require('express')
const routerApi= require('./app/routes')

const {replacer, reviver} = require('./app/services/utils.service') 

const app = express()
const port = 3000 


app.use(express.json())
app.set('json replacer', replacer)
app.set('json reviver', reviver)

app.listen(port,() => {
    console.log (`Server listening on port ${port}`)
})

routerApi(app) 




