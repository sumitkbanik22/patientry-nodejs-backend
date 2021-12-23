require('dotenv').config();
const express = require('express');
const cors = require('cors');
const body_parser = require('body-parser');
const mongoose = require('mongoose');
const { port, base_url, db_user, db_pass, db_name } = require('./configs/config');

const app = express();

const PORT = port;

app.use(cors({
    origin: `${base_url}`
}));

// parse application/x-www-form-urlencoded
app.use(body_parser.urlencoded({ extended: false }));

// parse application/json
app.use(body_parser.json());


app.listen(PORT, (err) => {
    if (err) {
      console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${PORT}`);
});

mongoose.connect(`mongodb+srv://${db_user}:${db_pass}@cluster0.2v6t0.mongodb.net/${db_name}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to MongoDB.");
}).catch(err => {
    console.error("Connection error: ", err);
    process.exit();
});
