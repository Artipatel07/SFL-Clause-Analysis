const mongoose = require('mongoose')
const express = require('express')
const users = require('./routes/DB_Routes/users')
const group = require('./routes/DB_Routes/group')
const analysis = require('./routes/DB_Routes/analysis')
const clause = require('./routes/DB_Routes/clauses')
const SFL = require('./routes/SFL_Routes/sfl')
const path = require('path')
const cors = require('cors');
const port2 = "http://localhost:3000/";

const app = express()
mongoose
    .connect('mongodb+srv://sfluser:goforsilver@cluster0.qna2i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB....'))
    .catch(err => console.error('Could not connect...', err))

app.use(express.json())
app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: false }))
app.use('/users', users)
app.use('/group', group)
app.use('/clause', clause)
app.use('/analysis', analysis)
app.use('/views', SFL)

    //view engine set up
app.use(express.static(__dirname + '/view'));
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;


app.listen(port, () => console.log(`Listening on port ${port}...`));