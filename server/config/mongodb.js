const mongoose = require('mongoose')

module.exports = function connectDB() {
  const uri = process.env.MONGO_URI
  if (!uri) {
    console.error('MONGO_URI not set in environment')
    process.exit(1)
  }
  mongoose
    .connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
      console.error('Mongo connect error', err)
      process.exit(1)
    })
}
