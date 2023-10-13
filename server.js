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
mongoose.connect('mongodb://localhost/stock_tracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Schema = mongoose.Schema;

const StockSchema = new Schema({
    name: String,
    price: Number,
});

const Stock = mongoose.model("Stock", StockSchema);

app.get("/api/stocks/:stock", async (req, res) => {
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
    res.json({ price: stockModel.price });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
