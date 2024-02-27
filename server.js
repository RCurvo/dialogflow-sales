import express, { json } from 'express';
import cors from 'cors';
import { textQuery } from "./use-cases/chatbot.js";
import { CustomerRepository } from './db/customer-repository.js';
import { ProductsRepository } from './db/products-repository.js';


const app = express()
const port = process.env.PORT || 3030;

const customerRepository = new CustomerRepository();
const prductsRepository = new ProductsRepository();


app.get("/customers", async (req, res) => {
     res.send(customerRepository.list())
})

app.get("/products", async (req, res) => {
    res.send(prductsRepository.list())
})

app.post("/chat", json(), async (req, res) => {
    const {userText, userId} = req.body;
    const resultQuery = await textQuery(userText, userId)
    const responseObject = {
        responseId: resultQuery[0].responseId,
        userQuery: resultQuery[0].queryResult.queryText,
        response: resultQuery[0].queryResult.fulfillmentMessages[0].text.text[0],
        customerParams: resultQuery[0].queryResult.parameters
    }
    const fields = responseObject.customerParams.fields

    if(JSON.stringify(fields) !== "{}"){
        if(fields.CPF.stringValue !== "" && fields.name.stringValue !== "" && fields.email.stringValue !== ""){
            customerRepository.create({
                CPF: fields.CPF.stringValue,
                name: fields.name.stringValue,
                email: fields.email.stringValue
            })
        }
    }
    res.send(resultQuery)
    // res.send(responseObject)
})

app.listen(port, () => {
    console.log("server is running")
})


