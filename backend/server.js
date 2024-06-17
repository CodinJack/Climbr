const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

require("dotenv").config();

const app = express();
const PORT = 5000
const path = require("path");

app.use(cors);
app.use(express.json());

const url = "mongodb+srv://jaikhanna615:xQ9EPYcArWbjx7aK@chatcluster.fxx8b1c.mongodb.net/?retryWrites=true&w=majority&appName=ChatCluster"


