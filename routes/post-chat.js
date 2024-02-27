import { textQuery } from "../use-cases/chatbot.js";
import express, {json} from "express"
import { customerRepository } from "../server.js";

export const postChat = express.Router();

postChat.post("/", json(), async (req, res) => {
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
            console.log("validação feita criando usuário")
            customerRepository.create({
                CPF: fields.CPF.stringValue,
                name: fields.name.stringValue,
                email: fields.email.stringValue
            })
        }
    }
    // res.send(resultQuery)
    res.send(responseObject)
})