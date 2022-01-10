require('dotenv').config();
const express = require('express');
const cors = require('cors');
const body_parser = require('body-parser');
const mongoose = require('mongoose');
const { port, base_url, db_user, db_pass, db_name, node_env } = require('./configs/config');

const app = express();

const PORT = process.env.port || 3000;

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(body_parser.urlencoded({ extended: false }));

// parse application/json
app.use(body_parser.json());

// log in development environment
if (node_env === "development") {
    const morgan = require("morgan");
    app.use(morgan("dev"));
  }

// routes

app.get('/', (req, res) => {
    res
      .status(200)
      .send('Hello patientry server is running')
      .end();
});

require('./routes/auth.routes')(app);

// page not found error handling  middleware

app.use("*", (req, res, next) => {
    const error = {
      status: 404,
      message: 'API endpoint does not found',
    };
    next(error);
});
  
// global error handling middleware
app.use((err, req, res, next) => {
    console.log(err);
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
    const data = err.data || null;
    res.status(status).json({
        type: "error",
        message,
        data,
    });
});


app.listen(process.env.PORT, '0.0.0.0', (err) => {
    if (err) {
      console.log(`Error in running the server: ${process.env.PORT}`);
    }
    console.log(`Server is running on port: ${process.env.PORT}`);
});

mongoose.connect(`mongodb+srv://sumitkb:champ221@cluster0.2v6t0.mongodb.net/patientry_db?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to MongoDB.");
}).catch(err => {
    console.error("Connection error: ", err);
    process.exit(1);
});
