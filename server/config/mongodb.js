const mongoose = require('mongoose')

// Connect to MongoDB using MONGO_URI and exit process on fatal connection errors.
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
