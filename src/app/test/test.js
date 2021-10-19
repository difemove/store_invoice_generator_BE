
let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);
const url= 'http://localhost:3000/api';

describe('Testing all elements', function() {
  describe('Testing Products ', function() {
    it('should return all test products', (done) => {
      chai.request(url)
      .get('/products')
      .then( function(err,res){
        console.log(res.body)
        expect(res).to.have.status(200);
        expect(res.body.length).to.equal(4);
        done()
      })
    })
    /*
    it('should return all test clients', function() {
      

    })

    it('should return all test promocodes', function() {
      

    })

    it('should return all test invoices', function() {
      

    })*/


     
  })
})

