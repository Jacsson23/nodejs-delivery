const Order = require('../models/order');
const User = require('../models/user');
const OrderHasProduct = require('../models/order_has_products');
const timeRelative = require('../utils/time_relative');
const pushNotificationController = require('./pushNotificationController');

module.exports = {

    async findByStatus(req, res, next) {

        try {
            const status = req.params.status;
            if (status == "PAGADO") {
                let data = await Order.findByStatus(status, "PENDIENTE");
                data.forEach(d => {
                    d.timestamp = timeRelative(new Date().getTime(), d.timestamp);
                })

                // console.log('Order: ', data);
                return res.status(201).json(data);
            } else {
                let data = await Order.findByStatus(status, status);
                data.forEach(d => {
                    d.timestamp = timeRelative(new Date().getTime(), d.timestamp);
                })

                // console.log('Order: ', data);
                return res.status(201).json(data);
            }

        }
        catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                message: 'Hubo un error al tratar de obtener las ordenes por estado',
                error: error,
                success: false
            })
        }

    },

    async findByClientAndStatus(req, res, next) {

        try {
            const status = req.params.status;
            const id_client = req.params.id_client;
            let data = await Order.findByClientAndStatus(id_client, status);

            data.forEach(d => {
                d.timestamp = timeRelative(new Date().getTime(), d.timestamp);
            })

             //console.log('Order: ', data);

            return res.status(201).json(data);
        }
        catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                message: 'Hubo un error al tratar de obtener las ordenes por estado',
                error: error,
                success: false
            })
        }

    },

    async findByDeliveryAndStatus(req, res, next) {

        try {
            const status = req.params.status;
            const id_delivery = req.params.id_delivery;
            let data = await Order.findByDeliveryAndStatus(id_delivery, status);

            data.forEach(d => {
                d.timestamp = timeRelative(new Date().getTime(), d.timestamp);
            })

            // console.log('Order: ', data);

            return res.status(201).json(data);
        }
        catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                message: 'Hubo un error al tratar de obtener las ordenes por estado',
                error: error,
                success: false
            })
        }

    },

    async create(req, res, next) {
        try {

            let order = req.body;
            const data = await Order.create(order);

            console.log('LA ORDEN SE CREO CORRECTAMENTE');

            // RECORRER TODOS LOS PRODUCTOS AGREGADOS A LA ORDEN
            for (const product of order.products) {
                var extra1 = llenadoVacios(product, 1)
                var extra2 = llenadoVacios(product, 2)
                var extra3 = llenadoVacios(product, 3)
                //console.log("extra1",extra1,"extra2",extra2,"extra3",extra3)
                await OrderHasProduct.create(data.id, product.id, product.quantity, extra1, extra2, extra3);
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se creo correctamente',
                data: {
                    'id': data.id
                }
            });

        }
        catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error creando la orden',
                error: error
            });
        }
    },

    async updateToDispatched(req, res, next) {
        try {

            let order = req.body;
            order.status = 'DESPACHADO';
            await Order.update(order);

            const user = await User.getNotificationTokenById(order.id_delivery);


            await pushNotificationController.sendNotification(user.notification_token, {
                title: 'PEDIDO ASIGNADO',
                body: 'Te han asignado un pedido',
                id_notification: '2'
            })

            return res.status(201).json({
                success: true,
                message: 'La orden se actualizo correctamente',
            });

        }
        catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error creando la orden',
                error: error
            });
        }
    },
    async updateToOnTheWay(req, res, next) {
        try {

            let order = req.body;
            order.status = 'EN CAMINO';
            await Order.update(order);

            const user = await User.getNotificationTokenById(order.id_client);


            await pushNotificationController.sendNotification(user.notification_token, {
                title: 'TU PEDIDO ESTA EN CAMINO',
                body: 'Un repartidor esta en camino con tu pedido',
                id_notification: '3'
            })

            return res.status(201).json({
                success: true,
                message: 'La orden se actualizo correctamente',
            });

        }
        catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error creando la orden',
                error: error
            });
        }
    },
    async updateToDelivered(req, res, next) {
        try {

            let order = req.body;
            order.status = 'ENTREGADO';
            await Order.update(order);

            return res.status(201).json({
                success: true,
                message: 'La orden se actualizo correctamente',
            });

        }
        catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error creando la orden',
                error: error
            });
        }
    },
    async updateLatLng(req, res, next) {
        try {

            let order = req.body;

            await Order.updateLatLng(order);

            return res.status(201).json({
                success: true,
                message: 'La orden se actualizo correctamente',
            });

        }
        catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error creando la orden',
                error: error
            });
        }
    }

}

function llenadoVacios(producto, op)
{
    var valor = 0;
    if (op == 1) {
        if(producto.cantExtra1!=undefined && producto.cantExtra1!=null)
        {
            valor=producto.cantExtra1
        }else{
            valor=0
        }
    } else if (op == 2) {
        if(producto.cantExtra2!=undefined && producto.cantExtra2!=null)
        {
            valor=producto.cantExtra2
        }else{
            valor=0
        }
    } else if (op == 3) {
        if(producto.cantExtra3!=undefined && producto.cantExtra3!=null)
        {
            valor=producto.cantExtra3
        }else{
            valor=0
        }
    }
    return valor;
}