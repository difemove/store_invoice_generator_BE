const Product= require('../model/product')
const Client= require('../model/client')
const PromoCode= require('../model/invoice')

class Invoice{

    constructor(id, paymentDate,activeFlag,
        clientId,clientName,clientLastName,documentId,
        promoCodeId,promoCodeCode,promoCodeValidFrom,promoCodeValidTo,
        promoCodeDescription,promoCodePercentage){
            this.id=id
            this.paymentDate=paymentDate
            this.activeFlag=activeFlag
            this.client=new Client(clientId,clientName,clientLastName,documentId)
            this.promoCode=new PromoCode(promoCodeId,promoCodeCode,promoCodeValidFrom,promoCodeValidTo,promoCodeDescription,promoCodePercentage)
            this.productsDTO=new Map()
        }
    
    loadProductsDTO(products){
        const productsDTOMap= new Map()  
        products.forEach(function(product){
            const productDTO={"product":new Product(product.id,product.name,product.price) , 
                              "quantity": product.quantity}
            productsDTOMap.set(product.id, productDTO)
            
            })
        this.productsDTO=productsDTOMap
            
    }
}

module.exports=Invoice