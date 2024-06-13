import Quotes from "../models/quotes.model.js"
import axios from 'axios';

export const createQuotes = async (req, res) => {
    try {
        const response = await axios.get('https://zenquotes.io/api/quotes');
        const quoteList = response.data;

        // Batch size
        const batchSize = 10;

        // Process quotes in batches
        for (let i = 0; i < quoteList.length; i += batchSize) {
            const batch = quoteList.slice(i, i + batchSize);
            const uniqueQuotes = [];

            // Check for duplicates within the batch
            for (const quote of batch) {
                const existingQuote = await Quotes.findOne({ quote: quote.q });
                if (!existingQuote) {
                    uniqueQuotes.push(quote);
                }
            }

            // Insert unique quotes into the database
            if (uniqueQuotes.length > 0) {
                await Quotes.insertMany(uniqueQuotes.map(quote => ({
                    quote: quote.q,
                    author: quote.a
                })));
            }
        }

        res.status(200).json({
            success: true,
            message: 'Quotes stored successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error: Unable to fetch or store quotes"
        });
    }
}



export const getByIdQuotes = async(req , res)=>{
    try{
        const quoteId = req.params.id;
        const quote = await Quotes.findById(quoteId);
        if(!quote){
            return res.status(404).json({
                success:false,
                message:"quote not found"
            })
        }

        res.status(200).json({
            success:true,
            data:quote,
            message : "Quotes data is fetched"
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: "Cannot fetch Quotes",
        });
    }
};

export const getAllQuotes = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10; 
        const page = parseInt(req.query.page) || 1; 
        const skip = (page - 1) * limit;

        const quotes = await Quotes.find().limit(limit).skip(skip).exec();

        const totalCount = await Quotes.countDocuments();

        if (quotes.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No quotes found",
            });
        }

        res.status(200).json({
            success: true,
            data: quotes,
            totalCount,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                limit,
            },
            message: "Quotes data fetched successfully",
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export const deleteQuotes= async(req , res)=>{
    try{
        const quoteId = req.params.id
        const quote = await Quotes.findByIdAndDelete(quoteId);
        if(!quote){
            return res.status(404).json({
                success:false,
                message:"Quote not found"
            })
        }

        res.status(200).json({
            success:true,
            message : "Quptes deleted successfully"
        })

    }catch(err){
        res.status(500).json({
            success: false,
            message: "Cannot delete Quotes",
        });
    }
};