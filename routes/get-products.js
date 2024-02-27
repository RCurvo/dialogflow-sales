import express from "express";
import { ProductsRepository } from "../db/products-repository.js";


export const getProducts = express.Router();
const productsRepository = new ProductsRepository();

getProducts.get("/", async (req, res) => {
    res.send(productsRepository.list())
})