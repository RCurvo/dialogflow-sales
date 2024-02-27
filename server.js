import express, { json } from 'express';
import { getProducts } from './routes/get-products.js';
import { postChat } from './routes/post-chat.js';
import { getCustumers } from './routes/get-customers.js';
import { CustomerRepository } from './db/customer-repository.js';
import { ProductsRepository } from './db/products-repository.js';


const app = express()
const port = process.env.PORT || 3030;
export const customerRepository = new CustomerRepository()
export const productRepository = new ProductsRepository()

app.use("/products", getProducts)

app.use("/chat", postChat)

app.use("/customers", getCustumers)

app.listen(port, () => {
    console.log("server is running")
})


