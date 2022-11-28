const ProductsController = require('../controllers/productsController');
const passport = require('passport');

module.exports = (app, upload) => {

    app.get('/api/products/findByCategory/:id_category', passport.authenticate('jwt', {session: false}), ProductsController.findByCategory);

    app.post('/api/products/create', passport.authenticate('jwt', {session: false}), upload.array('image', 3), ProductsController.create);

    app.get('/api/products/getAll', passport.authenticate('jwt', {session: false}), ProductsController.getAll);

    app.delete('/api/products/delete/:id', ProductsController.delete);   

    app.get('/api/products/findById/:id', ProductsController.findById);

    app.put('/api/products/update', upload.array('image', 3), ProductsController.update);

    app.put('/api/products/updateDatos', ProductsController.update);

}