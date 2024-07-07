import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';

interface UserAttributes {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'userId'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public userId!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public phone!: string;
}

User.init(
  {
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: 'users',
  }
);

export default User;
