import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../sequelize';
import User from './User';

interface OrganisationAttributes {
  orgId: string;
  name: string;
  description?: string;
  owner_id: string;
}

interface OrganisationCreationAttributes extends Optional<OrganisationAttributes, 'orgId'> {}

class Organisation extends Model<OrganisationAttributes, OrganisationCreationAttributes> implements OrganisationAttributes {
  public orgId!: string;
  public name!: string;
  public description?: string;
  public owner_id!: string;
}

Organisation.init(
  {
    orgId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'userId',
      },
    },
  },
  {
    sequelize,
    tableName: 'organisations',
  }
);

Organisation.belongsTo(User, { foreignKey: 'owner_id' });
User.hasMany(Organisation, { foreignKey: 'owner_id' });

export default Organisation;
