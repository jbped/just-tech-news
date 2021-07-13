const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Post extends Model {}

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false, 
            
        },
        post_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isURL:true
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            // FOREIGN KEY
            references: {
                // TABLE
                model: "user",
                // COL
                key: "id"
            }
        }
    },
    {
        sequelize,
        freezeTableName: true, 
        underscored: true,
        modelName: "post"
    }
)

module.exports = Post;