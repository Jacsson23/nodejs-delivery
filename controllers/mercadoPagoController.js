const mercadoPago = require('mercadopago');
const Order = require('../models/order');
const User = require('../models/user');
const OrderHasProduct = require('../models/order_has_products');
const pushNotificationController = require('../controllers/pushNotificationController');


mercadoPago.configure({
    sandbox: true,
    access_token: 'TEST-6028900970379574-062302-e3e5d11b7871ee742832e6351694608f-191014229'
});

module.exports = {

    async createPayment(req, res, next) {

        let payment = req.body;

        console.log('Datos enviados', payment);

        const payment_data = {
            transaction_amount: payment.transaction_amount,
            token: payment.token,
            description: payment.description,
            installments: payment.installments,
            payment_method_id: payment.payment_method_id,
            issuer_id: payment.issuer_id,
            payer: {
              email: payment.payer.email,
            }
        };

        const data = await mercadoPago.payment.create(payment_data).catch((err) => {
            console.log('Error:', err);
            return res.status(501).json({
                message: `Error al crear el pago: ${err}`,
                success: false,
                error: err 
            });
        })

        if (data) {
            // EL PAGO SE REALIZO CORRECTAMENTE
            
            const tokens = await User.getAdminsNotificationsTokens();
            let tokensString = []

            tokens.forEach(t => {
                tokensString.push(t.notification_token)
            })

            console.log('TOKENS', tokensString);
            
            pushNotificationController.sendNotificationToMultipleDevices(tokensString, {
                title: 'COMPRA REALIZADA',
                body: 'Un cliente ha realizado una compra',
                id_notification: '1'                
            });

            // pushNotificationController.sendNotification('eDZOcDqWTi2ns6p-_ZRxYl:APA91bGeb1O7swBV0ZJPExkSBqE7cIyfglsQwYZ8d2_xSjGl2JT4PpxWeM98EWcMjOL9Bp9sGEZYlcXzinzwBONYZumoX1cKAy6vyUhj3MCTEvDcUeSYpv2BHtYtam2kwePuepbBNuTR', {
            //     title: 'COMPRA REALIZADA',
            //     body: 'Un cliente ha realizado una compra',
            //     id_notification: '1'                
            // });

            let order = payment.order;
            order.status = 'PAGADO';
            const orderData = await Order.create(order);
            
            console.log('LA ORDEN SE CREO CORRECTAMENTE');

            // RECORRER TODOS LOS PRODUCTOS AGREGADOS A LA ORDEN
            for (const product of order.products) {
                await OrderHasProduct.create(orderData.id, product.id, product.quantity);
            }
            
            console.log('Respuesta de mercado pago', data.response);

            return res.status(201).json({
                message: `El pago se ha realizo correctamente`,
                success: true,
                data: data.response 
            })
        }
        else {
            // EL PAGO NO SE REALIZO CORRECTAMENTE
            return res.status(501).json({
                message: `Error algun dato esta mal en la peticion`,
                success: false
            });
        }

    }

}