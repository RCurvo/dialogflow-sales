import express from "express";
import { productRepository } from "../server.js";


export const getProducts = express.Router();

getProducts.get("/", async (req, res) => {
    const search = req.query.search
    res.send(productRepository.list(search))
})