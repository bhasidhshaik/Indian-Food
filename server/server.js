import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import env from "dotenv";
import axios from "axios";
import cheerio from "cheerio"

const app = express();
const port = 3000;
app.use(bodyParser.json());
env.config();
app.use(cors());
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.get("/search", async (req, res) => {
  const input = req.query.name;
  const result = await db.query(
    "SELECT * FROM recipe WHERE recipename ILIKE $1",
    ["%" + input + "%"]
  );
  res.send(result.rows);
});
app.get("/biryani" , async(req , res)=>{
  const sNos = req.query.srno.split(',');
  const numbers = sNos.map(numString => parseInt(numString));
  const queryText = `SELECT * FROM recipe WHERE srno IN (${numbers.map((_, i) => '$' + (i + 1)).join(',')})`;

  try {
    const result = await db.query(queryText , numbers);
    res.send(result.rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.sendStatus(404)
  }
  
})
app.get("/veg" , async(req , res)=>{
  const sNos = req.query.srno.split(',');
  const numbers = sNos.map(numString => parseInt(numString));
  const queryText = `SELECT * FROM recipe WHERE srno IN (${numbers.map((_, i) => '$' + (i + 1)).join(',')})`;

  try {
    const result = await db.query(queryText , numbers);
    res.send(result.rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.sendStatus(404)
  }
  
})
app.get("/image", async (req, res) => {
  const recipeUrl = req.query.url; 
  try {
    const response = await axios.get(recipeUrl);
    const htmlContent = response.data;

    const $ = cheerio.load(htmlContent);

    const imageUrl = $('div.recipe-image img').attr('src');
// console.log(imageUrl);
    res.send(imageUrl);
  } catch (error) {
    console.error('Error extracting image from recipe page:', error);
    res.sendStatus(404);
  }
});
app.get("/random", async (req, res) => {
  try {
    const totalRowsResult = await db.query('SELECT COUNT(*) FROM recipe');
    const totalRows = totalRowsResult.rows[0].count;

    const randomIndex = Math.floor(Math.random() * totalRows) + 1;

    const randomRecipe = await db.query('SELECT * FROM recipe OFFSET $1 LIMIT 1', [randomIndex - 1]);
    res.send(randomRecipe.rows);
  } catch (error) {
    console.error('Error fetching random recipe:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Backend server started at port number ${port}`);
});
