if (process.env.NODE_ENV === 'production') {
  module.exports = { mongoURI: 'mongodb://krohitm:krohitm@ds119772.mlab.com:19772/vidjot-prod' }
}
else {
  module.exports = { mongoURI: 'mongodb://localhost/vidjot-dev' }
}