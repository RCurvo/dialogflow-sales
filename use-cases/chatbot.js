import dialogflow from 'dialogflow'
import { googlePrivateKey, googleProjectId, dialogFlowSessionID, googleClientEmail, dialogFLowSessionLanguageCode } from "../config/devkeys.js"

const privateKey = googlePrivateKey
const projectId = googleProjectId
const sessionId = dialogFlowSessionID

const credentials = {
    client_email: googleClientEmail,
    private_key: privateKey
}



const sessionClient = new dialogflow.SessionsClient({projectId, credentials})

export const textQuery = async(userText, userId) => {
    const sessionPath = sessionClient.sessionPath(projectId, sessionId+userId)
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: userText,
                languageCode: dialogFLowSessionLanguageCode
            }
        }
    }
    try {
        const response = await sessionClient.detectIntent(request)
        return response
    } catch(error) {
        console.log(error)
    }
}