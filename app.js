const express = require('express');
const app = express();


// setup the middleware the application should use
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended:false }));

// here we setup the routes folder link
app.use('/', require('./routes/index'));


const port = 4500 || process.env.PORT;
app.listen(port, ()=>{
    console.log(`Server started on port ${port} ...`);
});