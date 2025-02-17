import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import client from "./database";
import pg from "pg";
dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

client.connect((err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Connected to the database");
    }
});

const PORT = process.env.PORT || 3000;

app.get("/", async (req: Request, res: Response) => {
    const query = `SELECT * FROM Product`;
    const result = await client.query(query);
    res.json({
        success: true,
        message: "Data amjilttai orloo",
        data: result.rows,
    });
});

app.post("/pro", async (req: Request, res: Response) => {
    const { id, name, price } = req.body;
    const query = `
    INSERT INTO Product (id, name, price)
    VALUES ($1, $2, $3)
    `;
    try {
        await client.query(query, [id, name, price]);
        res.status(201).json({ message: "Product-d amjilttai nemegdlee" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Product-d nemehed aldaa garlaa" });
    }
});

app.put("/put", async (req: Request, res: Response) => {
    const { id, name, price } = req.body;

    try {
        
        const query = 'UPDATE Product SET name = $1, price = $2 WHERE id = $3';
        const values = [name, price, id];

        const result = await client.query(query, values);

        if (result && result.rowCount && result.rowCount > 0) {
            res.json({ message: 'Product amjilttai shinechlegdlee' });
        } else {
            res.status(404).json({ message: 'Product oldsongui' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Product-d nemehed aldaa garlaa" });
    }
});

app.patch("/patch", async (req: Request, res: Response) => {
    const { id, name, price } = req.body;

    try {
        
        const query = 'UPDATE Product SET name = $1, price = $2 WHERE id = $3';
        const values = [name, price, id];

        const result = await client.query(query, values);
        
        if (result && result.rowCount && result.rowCount > 0) {
            res.json({ message: 'Product amjilttai shinechlegdlee' });
        } else {
            res.status(404).json({ message: 'Product oldsongui' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Product-d nemehed aldaa garlaa" });
    }
});

app.delete("/delete", async (req: Request, res: Response) => {
    const { id } = req.body; 
    try {
        const query = 'DELETE FROM Product WHERE id = $1';
        const values = [id];

        const result = await client.query(query, values);

        if (result && result.rowCount && result.rowCount > 0) {
            res.json({ message: 'Product amjilttai ustgagdsan' });
        } else {
            res.status(404).json({ message: 'Product oldsongui' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Product-d ustgahad aldaa garlaa" });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
