// import { DataTypes, Model, Optional } from "sequelize";
// import sequelize from "../config/db";

// /* =======================
//    INTERFACE
// ======================= */

// interface INotification {

//   id: number;

//   userId?: number;
//   hospitalId?: number;
//   labId?: number;
//   staffId?: number;
//   pharmacyId?: number;
//   doctorId?: number;

//   message: string;

//   userIsRead: boolean;
//   hospitalIsRead: boolean;
//   labIsRead: boolean;
//   staffIsRead: boolean;
//   pharmacyIsRead: boolean;
//   doctorIsRead: boolean;
// }

// /* =======================
//    OPTIONAL FIELDS
// ======================= */

// type NotificationCreationAttributes =
//   Optional<
//     INotification,
//     | "id"
//     | "userIsRead"
//     | "hospitalIsRead"
//     | "doctorIsRead"
//     | "labIsRead"
//     | "pharmacyIsRead"
//     | "staffIsRead"
//   >;

// /* =======================
//    MODEL CLASS
// ======================= */

// class Notification
//   extends Model<
//     INotification,
//     NotificationCreationAttributes
//   >
//   implements INotification
// {

//   public id!: number;

//   public userId?: number;
//   public hospitalId?: number;
//   public labId?: number;
//   public staffId?: number;
//   public pharmacyId?: number;
//   public doctorId?: number;

//   public message!: string;

//   public userIsRead!: boolean;
//   public hospitalIsRead!: boolean;
//   public labIsRead!: boolean;
//   public staffIsRead!: boolean;
//   public pharmacyIsRead!: boolean;
//   public doctorIsRead!: boolean;
// }

// /* =======================
//    INIT
// ======================= */

// Notification.init(

//   {

//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },

//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },

//     hospitalId: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },

//     labId: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },

//     staffId: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },

//     pharmacyId: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },

//     doctorId: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },

//     message: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },

//     /* READ STATUS */

//     userIsRead: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },

//     hospitalIsRead: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },

//     labIsRead: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },

//     staffIsRead: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },

//     pharmacyIsRead: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },

//     doctorIsRead: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },

//   },

//   {
//     sequelize,
//     modelName: "Notification",
//     tableName: "notification",
//     timestamps: true,
//   }

// );

// export default Notification;





import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";

import sequelize from "../config/db";

/* =======================
   INTERFACE
======================= */

interface INotification {

  id: number;

  userIds?: number[];
  hospitalIds?: number[];
  doctorIds?: number[];
  staffIds?: number[];
  pharmacyIds?: number[];
  labIds?: number[];
  superAdminIds?: number[];

  message: string;

  userReadStatus?: object;
  hospitalReadStatus?: object;
  doctorReadStatus?: object;
  staffReadStatus?: object;
  pharmacyReadStatus?: object;
  labReadStatus?: object;
  superAdminReadStatus?: object;
}

/* =======================
   OPTIONAL FIELDS
======================= */

type NotificationCreationAttributes =
  Optional<
    INotification,
    | "id"
    | "userIds"
    | "hospitalIds"
    | "doctorIds"
    | "staffIds"
    | "pharmacyIds"
    | "labIds"
    | "superAdminIds"
    | "userReadStatus"
    | "hospitalReadStatus"
    | "doctorReadStatus"
    | "staffReadStatus"
    | "pharmacyReadStatus"
    | "labReadStatus"
    | "superAdminReadStatus"
  >;

/* =======================
   MODEL
======================= */

class Notification
  extends Model<
    INotification,
    NotificationCreationAttributes
  >
  implements INotification
{

  public id!: number;

  public userIds?: number[];
  public hospitalIds?: number[];
  public doctorIds?: number[];
  public staffIds?: number[];
  public pharmacyIds?: number[];
  public labIds?: number[];
  public superAdminIds?: number[];

  public message!: string;

  public userReadStatus?: object;
  public hospitalReadStatus?: object;
  public doctorReadStatus?: object;
  public staffReadStatus?: object;
  public pharmacyReadStatus?: object;
  public labReadStatus?: object;
  public superAdminReadStatus?: object;
}

/* =======================
   INIT
======================= */

Notification.init(

  {

    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    /* RECEIVER IDS */

    userIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },

    hospitalIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },

    doctorIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },

    staffIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },

    pharmacyIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },

    labIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },

    superAdminIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },

    /* MESSAGE */

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    /* READ STATUS */

    userReadStatus: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },

    hospitalReadStatus: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },

    doctorReadStatus: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },

    staffReadStatus: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },

    pharmacyReadStatus: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },

    labReadStatus: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },

    superAdminReadStatus: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },

  },

  {
    sequelize,
    modelName: "Notification",
    tableName: "notifications",
    timestamps: true,
  }

);

export default Notification;