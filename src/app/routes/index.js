const express = require('express')
const productsRouter = require('./products.router')
const clientsRouter = require('./clients.router')
const promoCodesRouter = require('./promoCodes.router')
const invoicesRouter = require('./invoices.router')
function routerApi(app){
    const router = express.Router()
    app.use('/api', router)
    router.use('/products', productsRouter)
    router.use('/clients', clientsRouter)
    router.use('/promoCodes', promoCodesRouter)
    router.use('/invoices', invoicesRouter)
}



module.exports = routerApi
