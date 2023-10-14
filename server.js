const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan')
const bodyParser = require("body-parser")


const app = express();
const PORT = process.env.PORT || 3001;
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose
    .connect('mongodb+srv://kartikkulshreshtha2507:kartikkulshreshtha@cluster0.rrwzcse.mongodb.net/stock_tracker', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => { 
        console.error('MongoDB Atlas connection error:', err);
    });

const Schema = mongoose.Schema;

const StockSchema = new Schema({
    name: String,
    price: Number,
});

const Stock = mongoose.model("stock", StockSchema);

app.get("/api/stocks/:stock", async (req, res) => {
    try {
        const stock = req.params.stock;

        // Fetch the stock from MongoDB
        let stockModel = await Stock.findOne({ name: stock });

        // If the stock does not exist, create it
        if (!stockModel) {
            const price = Math.random() * 100;
            stockModel = new Stock({
                name: stock,
                price: price,
            });

            await stockModel.save();
        }

        // Return the stock price
        res.status(200).json({ price: stockModel.price });
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
