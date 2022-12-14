const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const { deserializeUser } = require('./middlewares/deserializeUser')
const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')
const configurationRouter = require('./routes/configuration')

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(deserializeUser)

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
)

function main() {
  app.listen(4000, () => {
    console.log(`Server listening at http://localhost:4000`)
  })

  // routes(app);

  app.use('/api/configuration', configurationRouter)
  app.use('/api/post', postRouter)
  app.use('/api/auth', authRouter)
}

main()
