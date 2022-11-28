const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const multer = require('multer');
const serviceAccount = require('./serviceAccountKey.json');
const admin = require('firebase-admin');
const io = require('socket.io')(server);
const ordersDeliverySocket = require('./sockets/orders_delivery_socket');
const mercadoPago = require('mercadopago');

mercadoPago.configure({
    access_token: 'TEST-6028900970379574-062302-e3e5d11b7871ee742832e6351694608f-191014229'
});

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


const upload = multer({
    storage: multer.memoryStorage()
});

/*
* RUTAS
*/
const users = require('./routes/usersRoutes');
const categories = require('./routes/categoriesRoutes');
const products = require('./routes/productsRoutes');
const address = require('./routes/addressRoutes');
const orders = require('./routes/ordersRoutes');
const mercadoPagoRoutes = require('./routes/mercadoPagoRoutes');

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

// console.log('PASSPORT', passport);

require('./config/passport')(passport);

app.disable('x-powered-by');

app.set('port', port);

/*
* LLAMANDO A LA RUTAS
*/
users(app, upload);
categories(app, upload);
address(app);
orders(app);
mercadoPagoRoutes(app);
products(app, upload);

/*
* LLAMAR A LOS SOCKETS
*/
ordersDeliverySocket(io);

/*server.listen(3000, '192.168.100.11' || 'localhost', function() {
    console.log('Aplicacion de NodeJS ' + port + ' Iniciada...')
});*/

//192.168.100.13
/*
server.listen(3000, '192.168.88.185' || 'localhost', function() {
    console.log('Aplicacion de NodeJS ' + port + ' Iniciada...')
});
*/

server.listen(port, function() {
    console.log('Listening on port ' + port)
});




// ERROR HANDLER
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

module.exports = {
    app: app,
    server: server
}

// 200 - ES UN RESPUESTA EXITOSA
// 404 - SIGNIFICA QUE LA URL NO EXISTE
// 500 - ERROR INTERNO DEL SERVIDOR