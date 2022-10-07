
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()


// const items = []
// const workItems = []



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))
const port = 3000

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true})

const itemsSchema = new mongoose.Schema({
    name: String
})

const Item = mongoose.model("Item", itemsSchema)
const newItem1 = new Item({
        name: "welcome to your todo list"
    }
)
const newItem2= new Item({
        name: "hit the + button to add a new item"
    }
)
const newItem3 = new Item({
        name: "<-- hit this to delete an item"
    }
)
const defaultItem = [newItem1, newItem2, newItem3]

// Item.insertMany( defaultItem, function (error, result){
//     if (error)
//         console.log(error)
//     else
//         console.log(result)
//     }
// )


app.get('/', function(req, res){

    Item.find({}, function (error, results){
        res.render('list', {ListTitle: "Today", NewListItem: results});
    })


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