const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const port       = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./'));

app.listen(
    port,
    function() {
        console.log('');
        console.log('Running at http://127.0.0.1:' + port);
        console.log('');
    }
);