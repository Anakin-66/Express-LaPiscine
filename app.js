const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const path = require('path')
const cors = require("cors");
const app = express()
const port = 3002

// const { sequelize } = require('./db/sequelizeSetup')

app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cors())

app.get('/', (req, res) => {
    // Exemple d'un cookie de première visite d'un site

    // console.log(req.cookies);
    // res.cookie('estDejaVenuSurLeSite', true)
    // if (req.cookies.estDejaVenuSurLeSite) {
    //     res.json('Hello World !')
    // } else {
    //     res.json('Hello you are new !')
    // }

    res.json('Hello World !')

})

const coworkingRouter = require('./routes/coworkingRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')

app.use('/images', express.static(__dirname + '/images'));

app.use('/api/coworkings', coworkingRouter)
app.use('/api/users', userRouter)
app.use('/api/reviews', reviewRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// MVC : la manière dont on a organisé notre projet, notre CRUD(web app). M = Model, V = Vue(React), C = Controllers