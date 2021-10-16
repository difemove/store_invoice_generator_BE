const express = require('express')

const app = express()
const port = 3000; 

app.use(express.json())


app.get('/', (req, res) => res.send('Hello World!'));

app.get('/products', (req, res) => res.send({
    products: [
        {
            id: 1,
            name: 'Product 1'
        }
    ]
}));
app.listen(port,() => {
    console.log (`Server listening on port ${port}`)
})
