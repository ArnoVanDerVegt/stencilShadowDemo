const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const port       = 3001;
const ip         = '127.0.0.1'; //'192.168.178.24';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./'));

app.listen(
    port,
    ip,
    function() {
        console.log('');
        console.log('Running at http://' + ip + ':' + port);
        console.log('');
    }
);