import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from 'pg';
import axios from "axios";
import cheerio from "cheerio";

const app = express();
const port = process.env.PORT || 3000;
const {Pool} = pg;

app.use(bodyParser.json());
app.use(cors());

const pool = new pg.Pool({
  connectionString: process.env.POSTGRES_URL,
});

// const pool = new Pool({
//   connectionString: "postgres://default:tZ1NPMmXhl2e@ep-tight-unit-a4bx5ubo-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
// })

app.get("/api/v1/search", async (req, res) => {
  const input = req.query.name;
  try {
    const result = await pool.query("SELECT * FROM recipe WHERE recipename ILIKE $1", ["%" + input + "%"]);
    res.send(result.rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.sendStatus(404);
  }
});
app.get("/api/v1/suggest", async (req, res) => {
  const input = req.query.name;
  try {
    const result = await pool.query("SELECT * FROM recipe WHERE recipename ILIKE $1 LIMIT 10", ["%" + input + "%"]);
    res.send(result.rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.sendStatus(404);
  }
});

app.get("/api/v1/biryani", async (req, res) => {
  const sNos = req.query.srno.split(',');
  const numbers = sNos.map(numString => parseInt(numString));
  const queryText = `SELECT * FROM recipe WHERE srno IN (${numbers.map((_, i) => '$' + (i + 1)).join(',')})`;
  try {
    const result = await pool.query(queryText, numbers);
    res.send(result.rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.sendStatus(404);
  }
});

app.get("/api/v1/veg", async (req, res) => {
  const sNos = req.query.srno.split(',');
  const numbers = sNos.map(numString => parseInt(numString));
  const queryText = `SELECT * FROM recipe WHERE srno IN (${numbers.map((_, i) => '$' + (i + 1)).join(',')})`;
  try {
    const result = await pool.query(queryText, numbers);
    res.send(result.rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.sendStatus(404);
  }
});

app.get("/api/v1/image", async (req, res) => {
  const recipeUrl = req.query.url; 
  try {
    const response = await axios.get(recipeUrl);
    const htmlContent = response.data;
    const $ = cheerio.load(htmlContent);
    const imageUrl = $('div.recipe-image img').attr('src');
    res.send(imageUrl);
  } catch (error) {
    console.error('Error extracting image from recipe page:', error);
    res.sendStatus(404);
  }
});

app.get("/api/v1/random", async (req, res) => {
  try {
    const totalRowsResult = await pool.query('SELECT COUNT(*) FROM recipe');
    const totalRows = totalRowsResult.rows[0].count;
    const randomIndex = Math.floor(Math.random() * totalRows) + 1;
    const randomRecipe = await pool.query('SELECT * FROM recipe OFFSET $1 LIMIT 1', [randomIndex - 1]);
    res.send(randomRecipe.rows);
  } catch (error) {
    console.error('Error fetching random recipe:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Backend server started at port number ${port}`);
});
