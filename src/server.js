const express = require('express')
const app = express()
const puerto =8080
const path = require('path')
const { Server: IOServer } = require('socket.io')
const expressServer = app.listen(puerto, (err) => {
    if(err) {
        console.log(`Se produjo un error al iniciar el servidor: ${err}`)
    } else {
        console.log(`Servidor escuchando puerto: ${puerto}`)
    }
})
const io = new IOServer(expressServer)

const messages= []
const productos= []

app.use(express.static(path.join(__dirname,'/public')))

// LADO SERVIDOR
io.on('connection', async socket=>{
    console.log('se conecto un usuario')

    io.emit('serverSend:Products', productos) //envio todos los productos

    socket.on('client:enterProduct', productInfo=>{
        productos.push(productInfo) //recibo productos
        io.emit('serverSend:Products', productos)//emito productos recibidos a los usuarios
    })
    // PARTE CHAT _ LADO SERVIDOR
    io.emit('serverSend:message',messages) //envio CHATS a todos los usuarios

    socket.on('client:message', messageInfo=>{
        messages.push(messageInfo) //RECIBO mensaje y lo anido
        io.emit('serverSend:message', messages)//EMITO CHATS
    })

    // socket.emit('serverSend:Products',products)
})
