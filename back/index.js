const app = require('./app')
// import app from './app'

const { API_PORT} = process.env


app.listen(process.env.PORT, ()=>{
    console.log(`listening ${process.env.PORT}`)
})


