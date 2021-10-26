//const dbPool=require('../model/dbConnection')
const ProductModel=require('../model/product')
const productsArray= require('../test/products.json')
const productsDBArray = require('../test/productsDB.json')
class ProductsService{
    
    constructor(){
        this.products=[]
    this.generate()}
        
    generate() {
       const products_array=   productsArray
            products_array.forEach(product=>{
                const {id,name,value}=product
                this.products.push(new ProductModel(id,name,value))
            }
            )
    }
    
    find(){
        
        return this.getProducts()
    }

    findOne(id){
        return this.products.find(product=>product.id === id)
    }
    findIndex(id){
        return this.products.findIndex(product=>product.id === id)
    }

    createProduct(body){
        const newProduct=new ProductModel(body.id,body.name,body.value)
        this.products.push(newProduct)
        return newProduct
    }

    update(id,bodyChanges){
        const productIndex=this.findIndex(id)
        if (productIndex===-1){
            throw new Error('Product not found')
        }
        const product=this.products[productIndex]
        this.products[productIndex]={
            ...product,
            ...bodyChanges
        }
        return this.products[productIndex]
    }

    delete(id){
        const productIndex=this.findIndex(id)
        if (productIndex===-1){
            throw new Error('Product not found')
        }
        this.products.splice(productIndex,1)
    }

     loadProducts(){
        this.getProducts()
    }
    
    async getProducts(){
        this.getProductsFromDB()
        .then(
            productsDB=>{
                this.products=this.constructProductsFromDB(productsDB)
                 
            }
        )
        
        return this.products
        
    }

    constructProductsFromDB(productsDB){
        const products=[]
        productsDB.forEach(product=>{
            const id=product.PRODUCT_ID 
            const name= product.PRODUCT_NAME
            const value = product.PRODUCT_VALUE
            products.push(new ProductModel(id,name,value))
        })
        return products
    }

    constructProductsDTOFromDBMapping(productsInvoiceDB){
        const productDTOs=[]
        productsInvoiceDB.forEach(productInvoiceDB=>{
            const product =this.findOne(productInvoiceDB.PRODUCT_ID)
            const productDTO={
                id: product.id,
                name: product.name,
                price: product.price, 
                quantity: productInvoiceDB.QUANTITY}
            productDTOs.push(productDTO)
        })
        return productDTOs
    }
    
    async getProductsFromDB(){
        //CHANGE FOR MAPPING WITH DB
        const productsDB= productsDBArray
        return productsDB
       
       

    }
    

    
}

module.exports = ProductsService