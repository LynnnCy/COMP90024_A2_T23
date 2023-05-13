const express = require('express')
var cors = require('cors')
const path = require('path');

const app = express()

app.use(cors())

app.use(express.static('build'));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

const PORT = 3001;
console.log('server started on port:', PORT);
app.listen(PORT);