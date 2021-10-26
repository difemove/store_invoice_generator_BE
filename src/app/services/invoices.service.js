//const dbPool=require('../model/dbConnection')
const InvoiceModel=require('../model/invoice');
const invoicesDBArray= require('../test/invoicesDB.json');
const ProductsService=require('./products.service');
const ClientsService=require('./clients.service');
const PromoCodeService = require('./promoCodes.service');
const productsInvoicesDBArray= require('../test/productInvoicesDB.json');

const productsService= new ProductsService();
const clientsService=new ClientsService();
const promoCodeService= new PromoCodeService();
class InvoicesService{
    
    constructor(){
        this.invoices=[]
    
        //this.makeInvoicesFromDB()
    }
        
    

    
    async find(){
        const invoices = await this.makeInvoicesFromDB()
        this.invoices=invoices
        return invoices
    }

    async findOne(id){
        return this.invoices.find(invoice=>invoice.id === id)
    }
    async findIndex(id){
        return this.invoices.findIndex(invoice=>invoice.id === id)
    }


    async update(id,bodyChanges){
        const invoiceIndex=this.findIndex(id)
        if (invoiceIndex===-1){
            throw new Error('Invoice not found')
        }
        const invoice=this.invoices[invoiceIndex]
        this.invoices[invoiceIndex]={
            ...invoice,
            ...bodyChanges
        }
        return this.invoices[invoiceIndex]
    }

    async delete(id){
        const invoiceIndex=this.findIndex(id)
        if (invoiceIndex===-1){
            throw new Error('Invoice not found')
        }
        this.invoices.splice(invoiceIndex,1)
    }

    async createInvoiceDB(userId){
        const newInvoiceDB= {
            INVOICE_ID: this.invoicesDBArray.length+1,
            PAYMENT_DATE: null,
            ACTIVE_FLAG:1,
            CLIENT_ID: userId,
            PROMO_CODE_ID: null
            
        }
        const invoicesDB= invoicesDBArray.push(newInvoiceDB)
        return  invoicesDB
    }

    async createInvoice(userId){
        const invoiceDB= await this.createInvoiceDB(userId)
        const newInvoice= this.makeInvoiceMapping(invoiceDB)

        return newInvoice
        

    }

  
    async getProductInvoicesFromDB(invoicesDB){
        const invoicesId= invoicesDB.map(invoice=>invoice.INVOICE_ID)
        const filteredProductInvoicesDB= await this.getFilteredProductInvoicesDB(invoicesId)
        return filteredProductInvoicesDB
    }
    
    async getFilteredProductInvoicesDB(filterArray){
        //TO DO: change for working with DB
        //Make a query to get the product invoices
        //Run query async and obtain values

        const productInvoicesDB= await this.getProductInvoicesDB()
        const filteredProductInvoicesDB= productInvoicesDB.filter(invoice=>filterArray.includes(invoice.INVOICE_ID))
        return filteredProductInvoicesDB
    }

    async getProductInvoicesDB() {
        const productInvoicesDB= productsInvoicesDBArray
        return productInvoicesDB
    
    }

    async makeInvoicesFromDB(){
        const invoicesDB= await this.getInvoicesFromDB()
        const ProductInvoicesDB = await this.getProductInvoicesFromDB(invoicesDB)
        //const invoicesWithoutProduct=[]

        
        const invoicesWithoutProduct= await this.makeInvoices(invoicesDB)
           
        
       

        const invoices= this.loadProductsDTO (invoicesWithoutProduct,ProductInvoicesDB)

        
        
        

        return invoices
    }

    replacer(key, value) {
        if(value instanceof Map) {
          return {
            dataType: 'Map',

            productId: Array.from(value.entries())
            , // or with spread: value: [...value]
          };
        } else {
          return value;
        }
    }

    makeInvoiceMapping(invoiceDB){
        const invoiceId= invoiceDB.INVOICE_ID
        const invoicePaymentDate= invoiceDB.PAYMENT_DATE
        const invoiceActiveFlag= invoiceDB.ACTIVE_FLAG
        const invoiceClientId= invoiceDB.CLIENT_ID
        const invoicePromoCodeId= invoiceDB.PROMOCODE_ID
            
            const invoiceMapping={
                id:invoiceId,
                paymentDate:invoicePaymentDate,
                activeFlag:invoiceActiveFlag,
                clientId:invoiceClientId,
                promoCodeId:invoicePromoCodeId

            }
            return invoiceMapping
        }

    async makeInvoices(invoicesDB){
        const invoices=[]

        for (const invoiceDB of invoicesDB){
            const invoiceMapping=this.makeInvoiceMapping(invoiceDB)
            const invoice=await this.makeInvoice(invoiceMapping)
            invoices.push(invoice)
        }
        
        return invoices
    }


    async makeInvoice(invoiceMapping,promoCodeColumn = 'id'){
        const {id,paymentDate,activeFlag,clientId,promoCodeId}=invoiceMapping
        const invoiceClient = await this.getClient(clientId)
        const promoCode= await this.getPromoCode(promoCodeId,promoCodeColumn)

        
        if (typeof invoiceClient === 'undefined'){
            //error
            throw new Error('Client not found')
        }
        

        
        const invoice= new InvoiceModel(id,paymentDate,activeFlag,
            invoiceClient.id,invoiceClient.name,invoiceClient.lastName,invoiceClient.documentId
            )
        
        if (typeof promoCode !== 'undefined'){
            
            const {id, code, validFrom, 
                validTo, description,
                percentage }=promoCode
            
                invoice.loadPromoCode(id,code,validFrom,validTo,
                    description,percentage)
        }

        return invoice

    }

    async getClient(id){
        const client = await clientsService.findClient(id);
        return client;
    }
    async getPromoCode(value,column){
        if (column === 'id'){
            return promoCodeService.findOne(value)
        }
        else if (column === 'code'){
            return promoCodeService.findOneByCode(value)
        }

    }

    loadProductsDTO(invoices,productInvoicesDB){
        //Performance could be better adding method in product to get the product from DB
        invoices.forEach(invoice=>{
            const productsInvoiceDB= productInvoicesDB.filter(
                productInvoiceDB=>productInvoiceDB.INVOICE_ID === invoice.id)
            const productDTOs= productsService.constructProductsDTOFromDBMapping(productsInvoiceDB)
            invoice.loadProductsDTO(productDTOs)
        })
        return invoices

    }
    async makePayment(body){
        const bodyInvoice=body.invoice
        const invoiceClient= await clientsService.findOne(bodyInvoice.clientId)
        const invoiceDB = await this.getInvoiceFromDB(body.id)
        const validCode= await promoCodeService.validateCode(body.PromoCode)
        const productsWithQuantity= await productsService.getProductsWithQuantity(body.products)

        //happy path 
        if(!validCode){
            //error
            throw new Error('Invalid Promo Code')
        }
        if (typeof invoiceClient === 'undefined'){
            //error
            throw new Error('Client not found')
        }
        if (typeof invoiceDB === 'undefined'){
            //error
            throw new Error('Invoice not found')
        }
        const promoCode= await promoCodeService.findOneByCode(body.PromoCode)
        const subtotal= this.calculateSubtotal(productsWithQuantity)
        const discount= this.calculateDiscount(subtotal,promoCode)
        const total= this.calculateTotal(subtotal,discount)
        const paymentDate= new Date()

        const invoice= new InvoiceModel(invoiceDB.INVOICE_ID,paymentDate,true,
            invoiceClient.id,invoiceClient.name,invoiceClient.lastName,invoiceClient.documentId,
            promoCode.id,promoCode.code,promoCode.validFrom,promoCode.validTo,
            promoCode.description, promoCode.percentage)
        
        invoice.loadProductsDTO(productsWithQuantity)
        
        const saveInvoiceToDB= await this.saveInvoiceToDB(invoice)
        
        if (!saveInvoiceToDB){
            //error
            throw new Error('Error saving invoice')
        }

        const invoiceWithTotal = {
            ...invoice,
            total:total,
            discount:discount,
            subtotal:subtotal,
        }
        
        return invoiceWithTotal
    }


    
    /* get all invoices in the future*/

    

    async getInvoiceFromDB(id){
        const invoicesDB= invoicesDBArray
        return invoicesDB.find(invoice=>invoice.id === id)
    }
    async getInvoicesFromDB(){
        const invoicesDB= invoicesDBArray
        return  invoicesDB
    }
    

    
}

module.exports = InvoicesService