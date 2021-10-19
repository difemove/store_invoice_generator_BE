class PromoCode{

    constructor(id,code,validFrom,validTo,description,percentage){
        this.id = id
        this.code = code
        this.validFrom = validFrom
        this.validTo = validTo
        this.description = description
        this.percentage = percentage

    }
}

module.exports = PromoCode