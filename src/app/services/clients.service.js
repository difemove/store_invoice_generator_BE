const ClientModel=require('../model/client')
const clientsArray= require('../test/clients.json')
const clientsDBArray= require('../test/clientsDB.json')

class ClientsService{
    
    constructor(){
        this.clients=[]
        this.generate()}
        
    generate() {
       const clients_array=   clientsArray
            clients_array.forEach(client=>{
                const {id,name,lastName,documentId}=client
                this.clients.push(new ClientModel(id,name,lastName,documentId))
            }
            )
    }
    
    async find(){
        const clients= await this.getClients()
        return clients
    }

    async findOne(id){
        const clients= await this.getClients()
        return clients.find(client=>client.id === id)
    }
    async findIndex(id){
        return this.clients.findIndex(client=>client.id === id)
    }

    async createClient(body){
        const newClient=new ClientModel(body.id,body.name,body.lastName,body.documentId)
        this.clients.push(newClient)
        return newClient
    }

    async update(id,bodyChanges){
        const clientIndex=this.findIndex(id)
        if (clientIndex===-1){
            throw new Error('Client not found')
        }
        const client=this.clients[clientIndex]
        this.clients[clientIndex]={
            ...client,
            ...bodyChanges
        }
        return this.clients[clientIndex]
    }

    async delete(id){
        const clientIndex=this.findIndex(id)
        if (clientIndex===-1){
            throw new Error('Client not found')
        }
        this.clients.splice(clientIndex,1)
    }

    async loadClients(){
        this.getClients()
    }
    
    async getClients(){
        const clientsDB= await this.getClientsFromDB()
        
        this.clients=this.constructClientsFromDB(clientsDB)
                 
         
        
        return this.clients
        
    }

    async constructClientsFromDB(clientsDB){
        const clients=[]
        clientsDB.forEach(client=>{
            const id=client.CLIENT_ID 
            const name= client.NAME
            const lastName = client.LASTNAME
            const documentId = client.DOCUMENT_ID
            clients.push(new ClientModel(id,name,lastName,documentId))
        })
        return clients
    }

    async getClientsFromDB(){
        const clientsDB= clientsDBArray
        return clientsDB
     
    }
    

    
}

module.exports = ClientsService