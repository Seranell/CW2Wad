const express = require('express');
const app = express();

const path = require('path');
const public = path.join(__dirname,'public');
app.use(express.static(public));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));

const mustache = require('mustache-express');
app.engine('mustache', mustache());
app.set('view engine', 'mustache');

const router = require('./routes/routes');
app.use('/', router); 

const port = process.env.PORT || 3000;
app.listen(port, () =>
 console.log(
  `Express started on http://localhost:${port}` +
   "; press Ctrl-C to terminate."
 )
);

