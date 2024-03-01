import fulfilment from "dialogflow-fulfillment"
import express, { request } from "express"
import { productRepository } from "../server.js";
import { customerRepository } from "../server.js";
import Joi from "joi"
import { isValid as isValidCpf } from "@fnando/cpf";

export const postWebhook = express.Router();

postWebhook.post("/", express.json(), (req, res)=>{
    const agent = new fulfilment.WebhookClient({
        request: req,
        response: res
    })


    function validationCheck(agent){
        const userSchema = Joi.object({
            name: Joi.string().min(1)
            .max(100) 
            .pattern(/^[a-zA-Z\s\-']+$/)
            .message('insira um nome válido').required(),
            email: Joi.string().email().message('digite um email valido').required(),
            Produto: Joi.string().allow(""),
            CPF: Joi.string()
        });
        const { error, value } = userSchema.validate(agent.parameters);
        if(error) {
            agent.add(`Não foi possível realizar seu pedido. Por favor digite comprar para começar novo e ${error.message}`)
        }
        const fields = agent.parameters
        if(!isValidCpf(fields.CPF)){
            agent.add(`Não foi possível realizar seu pedido. Por favor digite comprar para começar novo e insira um CPF válido`)
        }
            if(fields.CPF.stringValue !== "" && fields.name.stringValue !== "" && fields.email.stringValue !== "" && !error){
                customerRepository.create(agent.parameters)
            }
        agent.add(`Dados registrados com sucesso. Em breve um atendente falará com você. Se quiser ver nossos produtos em _*promoção*_ diga promoção`)
    }
    
    function discountResponse(agent){
        const productList = productRepository.list();
        agent.add(`Esses são nossos produtos em promoção: ${productList.map(product => {
            return `\n *${product.productName}*\n *Preço:* R$${product.price.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n *Link de Compra:* ${product.url}`
        })}`)
    }

    const intentMap = new Map();
    intentMap.set("Promoção", discountResponse)
    intentMap.set("PedidoCliente", validationCheck)

    agent.handleRequest(intentMap)
})