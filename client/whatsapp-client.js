import axios from "axios";
import { response } from "express";
import qrcode from "qrcode-terminal"
import { Client } from "whatsapp-web.js";
const client = new Client();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('Client is ready!');
    const testAPICall = await axios("https://edb6-2804-1b1-2108-5fd2-8d48-6742-4d0e-c9b.ngrok-free.app/products")
});

client.on('message', async (message) => {
    const requestBody = {
        userText: message.body,
        userId: "userTest-fsafa"
    }
    const response = await axios.post("https://edb6-2804-1b1-2108-5fd2-8d48-6742-4d0e-c9b.ngrok-free.app/chat", requestBody)
    const data = response.data


	await client.sendMessage(message.from, data.response);

});

client.initialize();