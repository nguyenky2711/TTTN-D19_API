const connection = require("../../config/database");
const { getItemById } = require("../items/item.service");
const { getSizeById } = require("../sizes/size.service");
module.exports = {
    createProduct: async (data) => {
        try {
            const [rows, fields] = await connection.execute(
                `INSERT INTO Products (item_id, size_id)
          VALUES (?,?)`,
                [
                    data.item_id,
                    data.size_id,
                ]
            );

            // Check if the insert operation was successful
            if (rows.affectedRows === 1) {
                return rows.insertId // Return the inserted ID
            } else {
                throw new Error("Failed to insert user");
            }
        } catch (error) {
            throw error;
        }
    },
    getProductById: async (id) => {
        try {
            const [rows, fields] = await connection.execute(
                `SELECT * FROM Products WHERE (id = ?)`,
                [id]
            );
            const [rows2, fields2] = await connection.execute(
                `SELECT * FROM Prices WHERE product_id = ? and status_id=1`,
                [rows[0].id]
            );
            const [rows3, fields3] = await connection.execute(
                `SELECT stock FROM Inventory WHERE (product_id = ?)`,
                [rows[0].id]
            );
            const [rows4, fields4] = await connection.execute(
                `SELECT * FROM Items WHERE id = ?`,
                [rows[0].item_id]
            );
            const [rows5, fields5] = await connection.execute(
                `SELECT * FROM Images WHERE item_id = ?`,
                [rows4[0].id]
            );
            const sizeDTO = await getSizeById(rows[0].size_id)

            const data = {
                id: rows[0].id,
                itemDTO: { data: rows4[0], imageDTO: rows5 },
                sizeDTO: sizeDTO,
                stockDTO: rows3,
                priceDTO: rows2
            }
            return data;
        } catch (error) {
            throw error;
        }
    },
    getProductByIdPriceId: async (id, priceID) => {
        try {
            const [rows, fields] = await connection.execute(
                `SELECT * FROM Products WHERE (id = ?)`,
                [id]
            );
            const [rows2, fields2] = await connection.execute(
                `SELECT * FROM Prices WHERE product_id = ? and id=? `,
                [rows[0].id, priceID]
            );
            const [rows3, fields3] = await connection.execute(
                `SELECT stock FROM Inventory WHERE (product_id = ?)`,
                [rows[0].id]
            );
            const [rows4, fields4] = await connection.execute(
                `SELECT * FROM Items WHERE id = ?`,
                [rows[0].item_id]
            );
            const [rows5, fields5] = await connection.execute(
                `SELECT * FROM Images WHERE item_id = ?`,
                [rows4[0].id]
            );
            const sizeDTO = await getSizeById(rows[0].size_id)

            const data = {
                id: rows[0].id,
                itemDTO: { data: rows4[0], imageDTO: rows5 },
                sizeDTO: sizeDTO,
                stockDTO: rows3,
                priceDTO: rows2
            }
            return data;
        } catch (error) {
            throw error;
        }
    },
    getProductByItemId: async (id,) => {
        try {
            const [rows, fields] = await connection.execute(
                `SELECT * FROM Products WHERE (item_id = ?)`,
                [id]
            );
            return rows
        } catch (error) {
            throw error;
        }
    },
    getProductByItemSizeId: async (data) => {
        try {
            const [rows, fields] = await connection.execute(
                `SELECT * FROM Products WHERE (item_id = ? AND size_id=?)`,
                [
                    data.item_id,
                    data.size_id,
                ]
            );
            return rows[0]
        } catch (error) {
            throw error;
        }
    },
    getProductDTOByItemId: async (data) => {
        const object = data;
        try {
            // const [rows, fields] = await connection.execute(
            //     `SELECT * FROM Products WHERE (item_id = ?)`,
            //     [data.id]
            // );
            const [rows2, fields2] = await connection.execute(
                `SELECT price, discounted_price FROM Prices WHERE product_id = ? and status_id =1`,
                [object.id]
            );
            const [rows3, fields3] = await connection.execute(
                `SELECT stock FROM Inventory WHERE (product_id = ?)`,
                [object.id]
            );
            const [rows4, fields4] = await connection.execute(
                `SELECT * FROM Items WHERE id = ?`,
                [object.item_id]
            );
            const [rows5, fields5] = await connection.execute(
                `SELECT * FROM Images WHERE item_id = ?`,
                [rows4[0].id]
            );

            const sizeDTO = await getSizeById(object.size_id)
            const data = {
                id: object.id,
                itemDTO: { data: rows4[0], imageDTO: rows5 },
                sizeDTO: sizeDTO,
                stockDTO: rows3,
                priceDTO: rows2,
            }
            return data;
        } catch (error) {
            throw error;
        }
    },
    getReviewsByItemId: async (item_id,) => {
        try {
            const [rows, fields] = await connection.execute(
                `SELECT * FROM Review WHERE item_id = ?`,
                [item_id]
            );
            return rows
        } catch (error) {
            throw error;
        }
    },
    getReviewById: async (id) => {
        try {
            const [rows, fields] = await connection.execute(
                `SELECT * FROM Review WHERE id = ?`,
                [
                    id
                ]
            );
            return rows
        } catch (error) {
            throw error;
        }
    },
    getLikesByReviewId: async (id,) => {
        try {
            const [rows, fields] = await connection.execute(
                `SELECT * FROM Likes WHERE review_id = ?`,
                [id]
            );
            return rows
        } catch (error) {
            throw error;
        }
    },
    getLikesByReviewUserId: async (data) => {
        try {
            const [rows, fields] = await connection.execute(
                `SELECT * FROM Likes WHERE review_id = ? and created_by=?`,
                [
                    data.review_id,
                    data.created_by,
                ]
            );
            return rows
        } catch (error) {
            throw error;
        }
    },
    deleteLikesByReviewUserId: async (data) => {
        try {
            const [rows, fields] = await connection.execute(
                `DELETE FROM Likes WHERE review_id = ? and created_by=?`,
                [
                    data.review_id,
                    data.created_by,
                ]
            );
            return rows
        } catch (error) {
            throw error;
        }
    },
    getDislikesByReviewId: async (id,) => {
        try {
            const [rows, fields] = await connection.execute(
                `SELECT * FROM Dislikes WHERE review_id = ?`,
                [id]
            );
            return rows
        } catch (error) {
            throw error;
        }
    },
    getDislikesByReviewUserId: async (data) => {
        try {
            const [rows, fields] = await connection.execute(
                `SELECT * FROM Dislikes WHERE review_id = ? and created_by=?`,
                [
                    data.review_id,
                    data.created_by,
                ]
            );
            return rows
        } catch (error) {
            throw error;
        }
    },
    deleteDislikesByReviewUserId: async (data) => {
        try {
            const [rows, fields] = await connection.execute(
                `DELETE FROM Dislikes WHERE review_id = ? and created_by=?`,
                [
                    data.review_id,
                    data.created_by,
                ]
            );
            return rows
        } catch (error) {
            throw error;
        }
    },
    createDislike: async (data) => {
        try {
            const [rows, fields] = await connection.execute(
                `INSERT INTO Dislikes (created_at, created_by, review_id)
          VALUES (?,?,?)`,
                [
                    data.created_at,
                    data.created_by,
                    data.review_id,
                ]
            );
            if (rows.affectedRows === 1) {
                return rows.insertId // Return the inserted ID
            } else {
                throw new Error("Failed to insert dislike");
            }
        } catch (error) {
            throw error;
        }
    },
    deleteDislike: async (data) => {
        try {
            const [rows, fields] = await connection.execute(
                `DELETE  From Dislikes WHERE review_id = ? and created_by=?`
                ,
                [
                    data.review_id,
                    data.created_by,
                ]
            );
            if (rows.affectedRows === 1) {
                return true;  // Return the inserted ID
            } else {
                throw new Error("Failed to delete dislike");
            }
        } catch (error) {
            throw error;
        }
    },
    createLike: async (data) => {
        try {
            const [rows, fields] = await connection.execute(
                `INSERT INTO Likes (created_at, created_by, review_id)
          VALUES (?,?,?)`,
                [
                    data.created_at,
                    data.created_by,
                    data.review_id,
                ]
            );
            if (rows.affectedRows === 1) {
                return rows.insertId // Return the inserted ID
            } else {
                throw new Error("Failed to insert Like");
            }
        } catch (error) {
            throw error;
        }
    },
    deleteLike: async (data) => {
        try {
            const [rows, fields] = await connection.execute(
                `DELETE  From Likes WHERE review_id = ? and created_by=?`
                ,
                [
                    data.review_id,
                    data.created_by,
                ]
            );
            if (rows.affectedRows === 1) {
                return true; // Return the inserted ID
            } else {
                throw new Error("Failed to delete Like");
            }
        } catch (error) {
            throw error;
        }
    },
    getProducts: async () => {
        const [rows, fields] = await connection.execute('SELECT * FROM Products');

        return rows
    },

    getStockByProductId: async (product_id) => {
        try {
            const [rows, fields] = await connection.execute(
                `SELECT * FROM Inventory WHERE product_id = ?`,
                [product_id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    },
    createInventoryItem: async (data) => {
        try {
            const [rows, fields] = await connection.execute(
                `INSERT INTO Inventory (product_id, stock)
          VALUES (?,?)`,
                [
                    data.product_id,
                    data.stock,
                ]
            );

            // Check if the insert operation was successful
            if (rows.affectedRows === 1) {
                return rows.insertId // Return the inserted ID
            } else {
                throw new Error("Failed to insert inventory item");
            }
        } catch (error) {
            throw error;
        }
    },
    updateInventoryByProductId: async (data) => {
        try {
            const [rows, fields] = await connection.execute(
                `update Inventory set stock=? where product_id=?`,
                [
                    data.stock,
                    data.product_id,
                ]);
            if (rows.affectedRows === 0) {
                throw new Error('Inventory item not found');
            }

            return rows
        } catch (error) {
            throw error;
        }
    },

    getPriceByProductId: async (product_id) => {
        try {
            const [rows, fields] = await connection.execute(
                `SELECT * FROM Prices WHERE product_id = ?`,
                [product_id]
            );
            return rows[rows.length - 1];
        } catch (error) {
            throw error;
        }
    },

    createPriceItem: async (data) => {
        console.log(data)
        try {
            const [rows, fields] = await connection.execute(
                `INSERT INTO Prices (product_id, price, modifield_time,discounted_price, status_id)
          VALUES (?,?,?,?,?)`,
                [
                    data.product_id,
                    data.price,
                    data.modifield_time,
                    data.discounted_price,
                    1,
                ]
            );

            // Check if the insert operation was successful
            console.log(rows)
            if (rows.affectedRows === 1) {
                return rows.insertId // Return the inserted ID
            } else {
                throw new Error("Failed to insert price item");
            }
        } catch (error) {
            throw error;
        }
    },
    updatePriceByProductId: async (data) => {
        try {
            const [rows, fields] = await connection.execute(
                `update Prices set price=?, modifield_time=?, discounted_price=?, status_id=? where product_id=?`,
                [
                    data.price,
                    data.modifield_time,
                    data.discounted_price,
                    data.status_id,
                    data.product_id,
                ]);
            if (rows.affectedRows === 0) {
                throw new Error('Price item not found');
            }

            return rows[0]
        } catch (error) {
            throw error;
        }
    },

    getImageByProductId: async (product_id) => {
        try {
            const [rows, fields] = await connection.execute(
                `SELECT * FROM Images WHERE product_id = ?`,
                [product_id]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    },
    createImageItem: async (data) => {
        try {
            const [rows, fields] = await connection.execute(
                `INSERT INTO Images (product_id, name)
          VALUES (?,?)`,
                [
                    data.product_id,
                    data.name,
                ]
            );

            // Check if the insert operation was successful
            if (rows.affectedRows === 1) {
                return rows.insertId // Return the inserted ID
            } else {
                throw new Error("Failed to insert image item");
            }
        } catch (error) {
            throw error;
        }
    },
    updatePriceByProductId: async (data) => {
        try {
            const [rows, fields] = await connection.execute(
                `update Prices set price=?, modifield_time=?,discounted_price=? where product_id=? and id =?`,
                [
                    data.price,
                    data.modifield_time,
                    data.discounted_price,
                    data.product_id,
                    data.id,
                ]);
            if (rows.affectedRows === 0) {
                throw new Error('Price item not found');
            }

            return rows[0]
        } catch (error) {
            throw error;
        }
    },
    createImport: async (data) => {
        try {
            const [rows, fields] = await connection.execute(
                `INSERT INTO Imports (created_at, created_by)
          VALUES (?,?)`,
                [
                    data.created_at,
                    data.created_by,
                ]
            );

            // Check if the insert operation was successful
            if (rows.affectedRows === 1) {
                return rows.insertId // Return the inserted ID
            } else {
                throw new Error("Failed to insert image item");
            }
        } catch (error) {
            throw error;
        }
    },
    createImportDetail: async (data) => {
        try {
            const [rows, fields] = await connection.execute(
                `INSERT INTO Import_detail (quantity, raw_price, product_id, import_id)
          VALUES (?,?,?,?)`,
                [
                    data.quantity,
                    data.raw_price,
                    data.product_id,
                    data.import_id,
                ]
            );

            // Check if the insert operation was successful
            if (rows.affectedRows === 1) {
                return rows.insertId // Return the inserted ID
            } else {
                throw new Error("Failed to insert image item");
            }
        } catch (error) {
            throw error;
        }
    },
    getDiscountById: async (id) => {
        try {
            const [rows, fields] = await connection.execute(
                `SELECT * FROM Discounts WHERE id = ?`,
                [id]
            );

            return rows[0];
        } catch (error) {
            throw error;
        }
    },
    getDiscountByItemId: async (id) => {
        try {
            const [rows, fields] = await connection.execute(
                `SELECT * FROM Discounts WHERE item_id = ?`,
                [id]
            );

            return rows[rows.length - 1];
        } catch (error) {
            throw error;
        }
    },
    getDiscounts: async (data) => {
        try {
            const [rows, fields] = await connection.execute(
                `SELECT * FROM Discounts `,
            );

            return rows;
        } catch (error) {
            throw error;
        }
    },
    updateDiscount: async (data) => {
        console.log(data)
        try {
            const [rows, fields] = await connection.execute(
                `UPDATE Discounts
                SET status_id = ?, modifield_time = ?, startDate = ?, endDate = ?, percentDiscount = ?, item_id = ?
                WHERE id = ?`,
                [
                    data.status_id,
                    data.modifield_time,
                    data.startDate,
                    data.endDate,
                    data.percentDiscount,
                    data.item_id,
                    data.id
                ]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    },
    createDiscount: async (data) => {
        try {
            const [rows, fields] = await connection.execute(
                `INSERT INTO Discounts
                (status_id, modifield_time, startDate, endDate, percentDiscount, item_id, id)
                VALUES (?, ?, ?, ?, ?, ?,?)`,
                [
                    1,
                    data.modifield_time,
                    data.startDate,
                    data.endDate,
                    data.percentDiscount,
                    data.item_id,
                    data.id,
                ]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    },
    getPrices: async (data) => {
        try {
            const [rows, fields] = await connection.execute(
                `SELECT * FROM Prices`
            )
            return rows;

        } catch (error) {
            throw error;

        }
    }
    // createImport
};