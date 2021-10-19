const express = require('express')
const router = express.Router()
const PromoCodesService=require('../services/promoCodes.service')

const promoCodesService=new PromoCodesService()


router.get('/',(req,res)=>{
    promoCodesService.find()
    .then(promoCodes=>{
        res.json(promoCodes)})
    
})


/*
router.post('/',(req,res)=>{
    return 'not implemented'
    
})
*/


module.exports=router