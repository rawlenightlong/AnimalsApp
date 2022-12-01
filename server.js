require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const app = express()
const PORT = process.env.PORT

///////////////////////////////
//Database Connection
///////////////////////////////


const data_url = process.env.DATA_URL
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(data_url, CONFIG)
mongoose.connection
.on("open", () => console.log("Connected to Mongoose"))
.on("close", () => console.log("Disconnected from Mongoose"))
.on("error", (error) => console.log(error))

///////////////
//Animal Model
//////////////

const {Schema, model} = mongoose
const animalSchema = new Schema({
    species: String,
    extinct: Boolean,
    location: String,
    lifeExpectancy: Number
})

const Animal = model("Animal", animalSchema)

////////////////
//Middleware
////////////////

app.use(morgan('tiny'))
app.use(methodOverride("_method"))
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))


////////////////
// LANDING PAGE
///////////////

app.get('/', (req, res) => {
    res.redirect('/animals')
})

// SEED ROUTE
app.get('/animals/seed', (req, res) => {
    const startAnimals = [
        { species: "Dog", extinct: false, location: "house", lifeExpectancy: 15},
        { species: "Elephant", extinct: false, location: "grasslands", lifeExpectancy: 65 },
        { species: "Cheetah", extinct: false, location: "desert", lifeExpectancy: 10 },
        { species: "T-Rex", extinct: true, location: "museums", lifeExpectancy: 1000000 },
      ]
      Animal.deleteMany({}, (err, data) => {
        Animal.create(startAnimals, (err, data) => {
            res.json(data)
            })
      })
})


//landing page
app.get('/', (req, res) => {
    res.redirect('/animals')
})

// INDEX ROUTE
app.get('/animals', (req, res) => {
    Animal.find({})
    .then((animals) => {
        res.render('animals/index.ejs', {animals})
    })
})


// NEW ROUTE
app.get('/animals/new', (req, res) => {
    res.render('animals/new.ejs')
})

// CREATE ROUTE
app.post('/animals', (req, res) => {
    req.body.extinct = req.body.extinct === "on" ? true : false 
    if (req.body.extinct === true){
        animal.status = "No, sadly it is extinct"
    }else animal.status = "Yes!"
    req.body.lifeExpectancy = parseInt(req.body.lifeExpectancy)
    Animal.create(req.body, (err, animal) => {
        res.redirect('/animals')
    })
})

// EDIT ROUTE
app.get('/animals/:id/edit', (req, res) => {
    Animal.findById(req.params.id, (err, animal) => {
        res.render('animals/edit.ejs', {animal})
    })
})

//DESTROY ROUTE
app.delete('/animals/:id', (req, res) => {
    Animal.findByIdAndRemove(req.params.id, (err, animal) => {
        res.redirect('/animals')
    })
})

// UPDATE ROUTE
app.put('/animals/:id', (req, res) => {
    req.body.extinct = req.body.extinct === "on" ? true : false
    if (req.body.extinct === true){
        animal.status = "No; sadly it is extinct."
    }else animal.status = "Yes!"
    req.body.lifeExpectancy = parseInt(req.body.lifeExpectancy)
    console.log(req.body)
    Animal.findByIdAndUpdate(req.params.id,req.body, {new: true}, (err, animal) => {
        console.log(animal)
        res.redirect('/animals')
    })
})

// SHOW ROUTE
app.get('/animals/:id', (req, res) => {
    Animal.findById(req.params.id)
    .then((animal) => {
        if (animal.extinct === true){
            animal.status = "No; sadly, it is extinct"
        }else{
            animal.status = "Yes!"
        }
        res.render('animals/show.ejs', {animal})
    })
})




// APP LISTENER
app.listen(PORT, () => {
    console.log(`Hey there Delilah, what's it like in Port ${PORT}`)
})