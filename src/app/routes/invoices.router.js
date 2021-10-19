const express = require('express')
const router = express.Router()
const InvoicesService=require('../services/invoices.service')

const invoicesService=new InvoicesService()


router.get('/',async (req,res)=>{
    
    const invoices=  await invoicesService.find()
    res.json(invoices)
    
})




module.exports=router