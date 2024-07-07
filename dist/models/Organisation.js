"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../sequelize"));
const User_1 = __importDefault(require("./User"));
class Organisation extends sequelize_1.Model {
}
Organisation.init({
    orgId: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
    },
    owner_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: User_1.default,
            key: 'userId',
        },
    },
}, {
    sequelize: sequelize_2.default,
    tableName: 'organisations',
});
Organisation.belongsTo(User_1.default, { foreignKey: 'owner_id' });
User_1.default.hasMany(Organisation, { foreignKey: 'owner_id' });
exports.default = Organisation;
