const https = require('https');
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');



module.exports = {

    sendNotification(token, data) {
        
        const notification = JSON.stringify({
            'to': token,
            "data": {
                'title': data.title,
                'body': data.body,
                'id_notification': data.id_notification,
            },
            'priority': 'high',
            'ttl': '4500s'
        });

        const options = {
            hostname: 'fcm.googleapis.com',
            path: '/fcm/send',
            method: 'POST',
            port: 443,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAAnHAkkqY:APA91bGw-pBU8FR_HJRma_C3GsPanXeXJejbKPKM2gPqM4nNBOYj38wqUPcqFbGX1iVdy8FVK17V4awYVOU8qzul-TqTE-vaV_Lj51QeTE0534X9zCuK153jftxrdJyNBFAE2qDbewHY'
            }
        }

        const req = https.request(options, (res) => {
            console.log('Status code Notificattion', res.statusCode);
            res.on('data', (d) => {
                process.stdout.write(d)
            })
        })

        req.on('error', (error) => {
            console.error(error)
        })

        req.write(notification);
        req.end();

    },
    sendNotificationToMultipleDevices(tokens, data) {
        
        const notification = JSON.stringify({
            'registration_ids': tokens,
            "data": {
                'title': data.title,
                'body': data.body,
                'id_notification': data.id_notification,
            },
            'priority': 'high',
            'ttl': '4500s'
        });

        const options = {
            hostname: 'fcm.googleapis.com',
            path: '/fcm/send',
            method: 'POST',
            port: 443,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAAnHAkkqY:APA91bGw-pBU8FR_HJRma_C3GsPanXeXJejbKPKM2gPqM4nNBOYj38wqUPcqFbGX1iVdy8FVK17V4awYVOU8qzul-TqTE-vaV_Lj51QeTE0534X9zCuK153jftxrdJyNBFAE2qDbewHY'
            }
        }

        const req = https.request(options, (res) => {
            console.log('Status code Notificattion', res.statusCode);
            res.on('data', (d) => {
                process.stdout.write(d)
            })
        })

        req.on('error', (error) => {
            console.error(error)
        })

        req.write(notification);
        req.end();

    }

}