import express from 'express'
import storage from './api/storage'

const app = express()

app.get('/storage', storage)

app.listen(3000, function () {
  console.log('Monitora server listening on port 3000!')
})
