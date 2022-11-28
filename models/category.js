const db = require('../config/config');

const Category = {};

Category.getAll = () => {

    const sql = `
        SELECT
            id,
            name,
            image
        FROM
            categories
        ORDER BY
            name
    `;

    return db.manyOrNone(sql);

}

Category.create = (category) => {

    const sql = `
    INSERT INTO
        categories(
            name,
            image,
            created_at,
            updated_at
        )
    VALUES($1, $2, $3, $4) RETURNING id
    `;

    return db.oneOrNone(sql, [
        category.name,
        category.image,
        new Date(),
        new Date()
    ]);

}

Category.update = (category) => {
    
    const sql= `
    UPDATE
        categories
    SET
        name = $2,
        image = $3,
        updated_at = $4
    WHERE
        id = $1
    `;
    
    return db.none(sql,[
        category.id,
        category.name,
        category.image,
        new Date()
    ]);

}

Category.delete = (id) => {

    const sql= `DELETE FROM categories WHERE id = $1`;    
    return db.none(sql,[
        id
    ]);

}

Category.findById = (id) => {

    const sql = `
    SELECT
        id,
        name,
        image
    FROM
        categories
    WHERE
        id = $1
    `;

    return db.one(sql,[
        id
    ])
}


module.exports = Category;