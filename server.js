const express = require("express")

const server = express()

server.all("/", (req,res) => {
  res.send("Crypto Bot is still up")
})

function keepAlive() {
  server.listen(1, () => {
    console.log("Server is up")
  })
}

module.exports = keepAlive