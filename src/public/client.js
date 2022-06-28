// Lado cliente
const socket = io() 
//Fecha
const tiempoTranscurrido = Date.now()
const hoy = new Date(tiempoTranscurrido)
const fecha= hoy.toLocaleDateString()
const hora= hoy.getHours()
const min=hoy.getMinutes()//ver si es menor de 10 me da sólo un número............
const sec= hoy.getSeconds()
console.log(`${fecha},${hora}:${min}:${sec} `)

//CHAT 
const formChat = document.querySelector('#formChat')
const mailInput = document.querySelector('#mailInput')
const messageInput = document.querySelector('#messageInput')


const totalMessages = document.querySelector('#totalMessages')
// EMITO MENSAJES AL SERVIDOR
function sendMessage() {
    try {
        const mail = mailInput.value
        const message = messageInput.value
    
        socket.emit('client:message', { mail, message }) //emito el mensaje al servidor
    } catch(error) {
        console.log(`Hubo un error ${error}`)
    }
}
//RENDER MENSAJES E INSERTO HTML
function renderMessages(messagesArray) {
    try {
        const html = messagesArray.map(messageInfo => {
            return(`<div>
                <strong style="color: blue;" >${messageInfo.mail}</strong>[
                <span style="color: brown;">${fecha},${hora}:${min}:${sec}</span>]:
                <em style="color: green;">${messageInfo.message}</em> </div>`)
        }).join(" ");

        totalMessages.innerHTML = html
    } catch(error) {
        console.log(`Hubo un error ${error}`)
    }
}
// ESCUCHO EVENTO - ENVIO CHAT
formChat.addEventListener('submit', event => {
    event.preventDefault()
    sendMessage()
    messageInput.value = "" 
})

// CAPTURO MENSAJES EMITIDOS AL SERVIDOR
socket.on('serverSend:message', renderMessages);

// 2  PARTE PRODUCTOS
const formProducts = document.querySelector('#formProducts')
const titleInput = document.querySelector('#title')
const priceInput = document.querySelector('#price')
const thumbnailInput = document.querySelector('#thumbnail')

const productosInsert = document.querySelector('#productosTabla')

// EMITO Productos AL SERVIDOR
function sendProduct() {
    try {
        const title = titleInput.value
        const price = priceInput.value
        const thumbnail = thumbnailInput.value
    
        socket.emit('client:enterProduct', { title, price, thumbnail }) //emito el mensaje al servidor
    } catch(error) {
        console.log(`Hubo un error ${error}`)
    }
}
//RENDER Productos E INSERTO HTML
async function renderProducts (productsArray) {
    try {
        const response = await fetch('/plantilla.hbs') //traemos la plantilla
        
        const plantilla = await response.text() //obtenemos el texto de la misma
        
        if (productsArray.length>0) {
            // const template = Handlebars.compile(plantilla)
            // const filled = template(productsArray, {noEscape:true}) 
            // document.querySelector('#productosTabla').innerHTML = filled
            
            productsArray.forEach(product => {
                const template = Handlebars.compile(plantilla)
                const filled = template(product) 
                document.querySelector('#productosTabla').innerHTML += filled
            });
            console.log(productsArray)
            
            
        }else{
            let div = document.createElement("div")
            document.querySelector('#noProducts').prepend("No hay ninguna producto :(", div )
        }
        
    } catch(error) {
        console.log(`Hubo un error ${error}`)
    }
}
// ESCUCHO EVENTO - ENVIO CHAT
formProducts.addEventListener('submit', event => {
    event.preventDefault()
    sendProduct()
    formProducts.value = "" 
})

// CAPTURO Productos EMITIDOS AL SERVIDOR
socket.on('serverSend:Products', productos=>{
      renderProducts(productos)
});




// async function renderProducts(products){
//     const response = await fetch('/plantilla.hbs') //traemos la plantilla
//     console.log(response)
//     const plantilla = await response.text() //obtenemos el texto de la misma
//     console.log(plantilla)
//     products.forEach(product => {
//         const template = Handlebars.compile(plantilla)
//         const html = template(product)
//         document.querySelector('#productos').innerHTML += html
//     })
// }
// renderProducts()
// socket.on('serverSend:Products', productos=>{
//     renderProducts(products)
// })