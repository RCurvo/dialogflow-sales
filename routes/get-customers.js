import express from "express";
import { customerRepository } from "../server.js";

export const getCustumers = express.Router();

getCustumers.get("/", async (req, res) => {
    const search = req.query.search
    res.send(customerRepository.list(search))
})