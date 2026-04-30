import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

interface IUser {
  id: number;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: any;
  fcmToken?: string;
  roleId?: number;
}

class User extends Model<IUser> implements IUser {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public phone!: string;
  public picture!: any;
  public fcmToken!: string;
  public roleId?: number;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING,
    },

    phone: {
      type: DataTypes.STRING,
      unique: true,
    },

    picture: {
      type: DataTypes.JSONB, // 🔥 store imageUrl + public_id
    },
        roleId: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },

    fcmToken: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  }
);

export default User;
