const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

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
const newItem2 = new Item({
        name: "hit the + button to add a new item"
    }
)
const newItem3 = new Item({
        name: "<-- hit this to delete an item"
    }
)
const defaultItem = [newItem1, newItem2, newItem3]

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
})

const List = mongoose.model("List", listSchema)

app.get('/', function (req, res) {

    Item.find({}, function (error, results) {
        if (results.length === 0) {
            Item.insertMany(defaultItem, function (error, result) {
                    if (error)
                        console.log(error)
                    else
                        console.log(result)
                }
            )
            res.redirect("/")
        } else {
            res.render('list', {ListTitle: "Today", NewListItem: results});
        }
    })
})


app.get("/:customListName", function (req, res) {
    const customListName = req.params.customListName
    let check = false
    List.find(function (error, lists) {
        console.log(lists)
        if (error)
            check = true
        if (!error) {
            lists.forEach(function (item) {
                if (item.name === customListName) {
                    console.log("this list olredy exists")
                    check = true
                }
            })
        }
    })

    if (check === false) {
        console.log("enter")
        console.log("enter")
        console.log("enter")
        console.log("enter")
        const list = new List({
            name: customListName,
            items: defaultItem
        })
        list.save()
        List.find({}, function (error, result) {
            if (!error)
                console.log(result)
        })
    }
    res.redirect("/")
})


//add new item to the todo list
app.post('/', function (req, res) {
    const itemName = req.body.newItem
    const newItem4 = Item({
        name: itemName
    })
    newItem4.save()
    res.redirect("/")
})


app.listen(port, function () {
    console.log(`Example app$ listening on port ${port}!`)
})

app.get('/Work', function (req, res) {
    res.render('list', {ListTitle: 'Work List', NewListItem: workItems})
})

app.post('/Work', function (req, res) {
    let item = req.body.newItem
    console.log(item)
    workItems.push(item)
    res.redirect('/Work')
})

app.post("/delete", function (req, res) {

    console.log(req.body.checkbox)

    Item.deleteOne({id: req.body.checkbox}, function (error) {
        if (!error)
            console.log("succes")
    })
    res.redirect("/")
})

app.get('/about', function (req, res) {
    res.render('about')
})