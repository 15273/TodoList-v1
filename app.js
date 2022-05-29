
const express = require('express')
const bodyParser = require('body-parser')
const date = require(__dirname + '/date.js')
const app = express()

const items = []
const workItems = []

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))
const port = 3000

app.get('/', function(req, res){
    let day = date.getDay()
    res.render('list', {ListTitle: day, NewListItem: items});

})

app.post('/', function(req ,res){
    let item =  req.body.newItem
    console.log(req.body)
    if (req.body.list === 'Work List'){
        workItems.push(item)
        res.redirect('/Work')
    }
    else{
        items.push(item)
        res.redirect('/')
    }
    
})

app.listen(port, function(){
    console.log(`Example app$ listening on port ${port}!`)
})

app.get('/Work', function(req, res){
    res.render('list', {ListTitle: 'Work List', NewListItem: workItems})
})

app.post('/Work', function(req, res){
    let item = req.body.newItem
    console.log(item)
    workItems.push(item)
    res.redirect('/Work')
})

app.get('/about', function(req, res){
    res.render('about')
})