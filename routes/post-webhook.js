import fulfilment from "dialogflow-fulfillment"
import express from "express"
import { productRepository } from "../server.js";

export const postWebhook = express.Router();

postWebhook.post("/", express.json(), (req, res)=>{
    const agent = new fulfilment.WebhookClient({
        request: req,
        response: res
    })

    function discountResponse(agent){
        agent.add(`Esses são nossos produtos em promoção ${JSON.stringify(productRepository.list())}`)
    }

    const intentMap = new Map();
    intentMap.set("Promoção", discountResponse)

    agent.handleRequest(intentMap)
})