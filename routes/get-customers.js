import express from "express";
import { customerRepository } from "../server.js";

export const getCustumers = express.Router();

getCustumers.get("/", async (req, res) => {
    res.send(customerRepository.list())
})