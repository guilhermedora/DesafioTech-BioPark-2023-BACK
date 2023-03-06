const express = require('express');
require('dotenv').config()
const cors = require('cors')
const routes = require('./routes');
const app = express();

app.use(express.json());

app.use(cors())

app.use(routes);

app.listen(process.env.PORT || 3001, () => {
    console.log(`Server On`);
}); 