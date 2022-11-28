const db = require('../config/config');

const Product = {};


Product.findByCategory = (id_category) => {
    const sql = `
    SELECT
        P.id,
        P.name,
        P.description,
        P.price,
        P.image1,
        P.image2,
        P.image3,
        P.id_category,
        P.extra1,
        P.extra2,
        P.extra3,
        P.extprecio1,
        P.extprecio2,
        P.extprecio3
    FROM
        products AS P
    INNER JOIN
        categories AS C
    ON
        P.id_category = C.id
    WHERE
        C.id = $1
    `;

    return db.manyOrNone(sql, id_category);
}


Product.create = (product) => {
    const sql = `
    INSERT INTO
        products(
            name,
            description,
            price,
            image1,
            image2,
            image3,
            id_category,
            created_at,
            updated_at,
            extra1,
            extra2,
            extra3,
            extprecio1,
            extprecio2,
            extprecio3
        )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id
    `;
    return db.oneOrNone(sql, [
        product.name,
        product.description,
        product.price,
        product.image1,
        product.image2,
        product.image3,
        product.id_category,
        new Date(),
        new Date(),
        product.extra1,
        product.extra2,
        product.extra3,
        product.extprecio1,
        product.extprecio2,
        product.extprecio3
    ]);
}

Product.update = (product) => {
    console.log(product)
    const sql = `
    UPDATE
        products
    SET
        name = $2,
        description = $3,
        price = $4,
        image1 = $5,
        image2 = $6,
        image3 = $7,
        id_category = $8,
        updated_at = $9,
        extra1 = $10,
        extra2 = $11,
        extra3 = $12,
        extprecio1 = $13,
        extprecio2 = $14,
        extprecio3 = $15
    WHERE
        id = $1
    `;
    return db.none(sql, [
        product.id,
        product.name,
        product.description,
        product.price,
        product.image1,
        product.image2,
        product.image3,
        product.id_category,
        new Date(),
        product.extra1,
        product.extra2,
        product.extra3,
        product.extprecio1,
        product.extprecio2,
        product.extprecio3
    ]);
}

Product.getAll = () => {
    const sql = `
    SELECT
        P.id,
        P.name,
        P.description,
        P.price,
        P.image1,
        P.image2,
        P.image3,
        P.id_category,
        P.extra1,
        P.extra2,
        P.extra3,
        P.extprecio1,
        P.extprecio2,
        P.extprecio3
    FROM
        products AS P
    INNER JOIN
        categories AS C
    ON
        P.id_category = C.id
    `;

    return db.manyOrNone(sql);
}

Product.delete = (id) => {

    const sql= `DELETE FROM products WHERE id = $1`;    
    return db.none(sql,[
        id
    ]);

}

Product.findById = (id) => {
    const sql = `
    SELECT
        P.id,
        P.name,
        P.description,
        P.price,
        P.image1,
        P.image2,
        P.image3,
        P.id_category,
        P.extra1,
        P.extra2,
        P.extra3,
        P.extprecio1,
        P.extprecio2,
        P.extprecio3
    FROM
        products AS P
    INNER JOIN
        categories AS C
    ON
        P.id_category = C.id
    WHERE
        P.id = $1
    `;
    return db.one(sql, id);
}

module.exports = Product;