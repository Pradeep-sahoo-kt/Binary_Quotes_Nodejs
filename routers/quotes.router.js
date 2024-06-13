import express from "express"
const router = express.Router()
import {createQuotes , getByIdQuotes , getAllQuotes , deleteQuotes} from "../controller/quotes.controller.js"

router.get("/get_quotes_list" , createQuotes)
router.get("/quote/:id" , getByIdQuotes)
router.get("/quotes_list" , getAllQuotes)
router.delete("/delete_quotes/:id" , deleteQuotes)

export default router