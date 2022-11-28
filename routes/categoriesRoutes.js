const CategoriesController = require('../controllers/categoriesController');
const passport = require('passport');
const db = require('../config/config');

module.exports = (app, upload) => {

    // TRAER DATOS
    app.get('/api/categories/getAll', passport.authenticate('jwt', {session: false}), CategoriesController.getAll);

    // GUARDAR DATOS
    app.post('/api/categories/create', passport.authenticate('jwt', {session: false}), upload.array('image', 1), CategoriesController.create);

    //ACTUALIZAR DATOS 
    app.put('/api/categories/update', upload.array('image', 1), CategoriesController.update);

    //ACTUALIZAR SOLO DATOS
    app.put('/api/categories/updateDatos', CategoriesController.update);

    //ELIMINAR DATOS
    app.delete('/api/categories/delete/:id', CategoriesController.delete);   

    //BUSCAR CATEGORIA POR ID
    app.get('/api/categories/findById/:id', CategoriesController.findById);  
    
    // 401 UNAUTHORIZED
}