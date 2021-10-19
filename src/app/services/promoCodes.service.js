const PromoCodeModel=require('../model/promoCode')
const promoCodesArray= require('../test/promoCodes.json')
const promoCodesDBArray=require('../test/promoCodesDB.json')

class PromoCodesService{
    
    constructor(){
        this.promoCodes=[]
        this.generate()}
        
    generate() {
       const promoCodes_array=   promoCodesArray
            promoCodes_array.forEach(promoCode=>{
                const {id,code,validFrom,validTo,description,percentage}=promoCode
                this.promoCodes.push(new PromoCodeModel(id,code,validFrom,validTo,description,percentage))
            }
            )
    }
    
    find(){
        return this.getPromoCodes()
    }

    findOne(id){
        return this.promoCodes.find(promoCode=>promoCode.id === id)
    }
    findIndex(id){
        return this.promoCodes.findIndex(promoCode=>promoCode.id === id)
    }

    createPromoCode(body){
        const newPromoCode=new PromoCodeModel(body.id,body.code,body.validFrom,body.validTo
            ,body.description,body.percentage)
        this.promoCodes.push(newPromoCode)
        return newPromoCode
    }

    update(id,bodyChanges){
        const promoCodeIndex=this.findIndex(id)
        if (promoCodeIndex===-1){
            throw new Error('Promo Code not found')
        }
        const promoCode=this.promoCodes[promoCodeIndex]
        this.promoCodes[promoCodeIndex]={
            ...promoCode,
            ...bodyChanges
        }
        return this.promoCodes[promoCodeIndex]
    }

    delete(id){
        const promoCodeIndex=this.findIndex(id)
        if (promoCodeIndex===-1){
            throw new Error('Promo Code not found')
        }
        this.promoCodes.splice(promoCodeIndex,1)
    }
    loadPromoCodes(){
        this.getPromoCodes()
    }
    
    async getPromoCodes(){
        this.getPromoCodesFromDB()
        .then(
            promoCodesDB=>{
                this.promoCodes=this.constructPromoCodesFromDB(promoCodesDB)
                 
            }
        )
        
        return this.promoCodes
        
    }

    constructPromoCodesFromDB(promoCodesDB){
        const promoCodes=[]
        promoCodesDB.forEach(promoCode=>{
            const id=promoCode.PROMOCODE_ID 
            const code= promoCode.CODE
            const validFrom = promoCode.VALID_FROM
            const validTo = promoCode.VALID_TO
            const description = promoCode.DESCRIPTION
            const percentage = promoCode.PERCENTAGE
            promoCodes.push(new PromoCodeModel(id,code,validFrom,validTo,description,percentage))
        })
        return promoCodes
    }
    
    async getPromoCodesFromDB(){
        const promoCodesDB= promoCodesDBArray
        return promoCodesDB
       
        
    }
    

    
}

module.exports = PromoCodesService