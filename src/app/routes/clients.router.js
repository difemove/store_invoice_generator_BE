const express = require('express');
const router = express.Router();
const ClientsService=require('../services/clients.service');

const clientsService=new ClientsService();


router.get('/',async (req,res)=>{
    
    const clients=  await clientsService.find()
    res.json(clients)
    
})

router.get('/:id',async (req,res)=>{
    const id= parseInt(req.params.id)
    const client=  await clientsService.findOne(id)
    res.json(client)
    
})




module.exports=router