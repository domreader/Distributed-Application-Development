const mongoose = require('mongoose')
const urel = mongodb://127.0.0.1:27017/messages
mongoose.connect(url, {useNewUrlParser: true});

const db = mongoose.connection
db.once('open',_=> {console.log('Database Connected :', url)})

db.on('error', err => {console.error('connection error :',err)})
