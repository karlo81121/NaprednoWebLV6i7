const express = require('express')
const app = express()
const router = express.Router()

app.set('view engine', 'ejs');

router.get("/register", (req, res) => {
    res.render('regsiter.ejs')
})

module.exports = router