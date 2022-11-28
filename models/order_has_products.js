const db = require('../config/config');

const OrderHasProducts = {};



OrderHasProducts.create = (id_order, id_product, quantity,cantExtra1,cantExtra2,cantExtra3) => {
    const sql = `
    INSERT INTO
        order_has_products(
            id_order,
            id_product,
            quantity,
            created_at,
            updated_at,
            cantExtra1,
            cantExtra2,
            cantExtra3
        )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    return db.none(sql, [
        id_order,
        id_product,
        quantity,
        new Date(),
        new Date(),
        cantExtra1,
        cantExtra2,
        cantExtra3
    ]);
}

module.exports = OrderHasProducts;