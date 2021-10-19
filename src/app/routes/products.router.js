
const express = require('express')
const router = express.Router()
const ProductsService=require('../services/products.service')

const productsService=new ProductsService()


router.get('/',(req,res)=>{
   productsService.find()
    .then(products=>{
        res.json(products)})
    
    
})

router.get('/:id',(req,res)=>{
    const {id}=req.params
    const product=productsService.findOne( parseInt(id))
    res.json(product)
     
 })

router.post('/',(req,res)=>{
    
    const product=productsService.createProduct(req.body)
    res.json(product)
})



module.exports=router