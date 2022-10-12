const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const _ = require("lodash")

const app = express()

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))
const port = 3000

mongoose.connect("mongodb+srv://admin-kalish:15273Mmk" +
    "@cluster0.a63bpoh.mongodb.net/todolistDB", {useNewUrlParser: true})

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
    const customListName = _.capitalize(req.params.customListName)
    List.findOne({name: customListName}, function (error, result) {
        if (!error) {
            if (!result) {
                const list = new List(
                    {
                        name: customListName,
                        items: defaultItem
                    }
                )
                list.save()
                res.redirect("/" + customListName)
            } else {
                console.log("succes")
                res.render("list", {ListTitle: result.name, NewListItem: result.items})

            }
        }
    })


})


//add new item to the todo list
app.post('/', function (req, res) {
    const itemName = req.body.newItem
    const listName = req.body.list

    const newItem4 = Item({
        name: itemName
    })
    if (listName === "Today") {
        newItem4.save()
        res.redirect("/")
    }
    else {
        List.findOne({name: listName}, function (error, result) {
            if (!error){
                result.items.push(newItem4)
                result.save()
                res.redirect("/" + listName)
            }
        })
    }
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
    console.log(req.body.listName)
    const checkedItem = req.body.checkbox
    const listName = req.body.listName
    if (listName === "Today"){
        Item.deleteOne({id: checkedItem}, function (error) {
            if (!error)
                console.log("succes")
        })
        res.redirect("/")
    }
    else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItem}}}, function (error, result) {
            if (!error){
                res.redirect("/" + listName)
            }
        })
    }

})

app.get('/about', function (req, res) {
    res.render('about')
})