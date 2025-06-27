const {Pool} = require('pg');
require('dotenv').config();
const fs = require('fs')


const pool = new Pool({
    connectionString : process.env.DATABASE_URL
})





module.exports = pool