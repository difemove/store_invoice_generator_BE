const Product= require('../model/product');
const Client= require('../model/client');
const PromoCode= require('../model/promoCode');

class Invoice{

    constructor(id, paymentDate,activeFlag,
        clientId,clientName,clientLastName,documentId
        ){
            this.id=id
            this.paymentDate=paymentDate
            this.activeFlag=activeFlag
            this.client=new Client(clientId,clientName,clientLastName,documentId)
            this.promoCode= {}
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
    loadPromoCode(promoCodeId,promoCodeCode,promoCodeValidFrom,promoCodeValidTo,
        promoCodeDescription,promoCodePercentage){
            this.promoCode=new PromoCode(promoCodeId,promoCodeCode,promoCodeValidFrom,promoCodeValidTo,
                promoCodeDescription,promoCodePercentage)
        
    }
    getTotal(){
        let total=0
        this.productsDTO.forEach(function(productDTO){
            total+=productDTO.product.price*productDTO.quantity
        })
        return total
    }
    getTotalWithDiscount(){
        let total=this.getTotal()
        if(this.promoCode.percentage!=null){
            total=total-(total*this.promoCode.percentage)/100
        }
        return total
    }
    getDiscount(){  
        let total=this.getTotal()
        let discount=0
        
        if(this.promoCode.percentage!=null){
            discount=total*this.promoCode.percentage/100
        }
        return discount
    }

}

module.exports=Invoice