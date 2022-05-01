const express = require('express');
const fs = require('fs');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: ture}));

app.use(express.static('public'));

