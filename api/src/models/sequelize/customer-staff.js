module.exports = function (sequelize, DataTypes) {
  const CustomerStaff = sequelize.define('CustomerStaff', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    staffCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Nombre".'
        }
      }
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Apellido".'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Email".'
        }
      }
    },
    language: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE,
      get () {
        return this.getDataValue('createdAt')
          ? this.getDataValue('createdAt').toISOString().split('T')[0]
          : null
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get () {
        return this.getDataValue('updatedAt')
          ? this.getDataValue('updatedAt').toISOString().split('T')[0]
          : null
      }
    }
  }, {
    sequelize,
    tableName: 'customer_staffs',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'id' }
        ]
      },
      {
        name: 'customer_staffs_customer_id_fk',
        using: 'BTREE',
        fields: [
          { name: 'customerId' }
        ]
      },
      {
        name: 'customer_staffs_staff_category_id_fk',
        using: 'BTREE',
        fields: [
          { name: 'staffCategoryId' }
        ]
      }
    ]
  })

  CustomerStaff.associate = function (models) {
    CustomerStaff.belongsTo(models.Customer, { as: 'customer', foreignKey: 'customerId' })
    CustomerStaff.belongsTo(models.StaffCategory, { as: 'staffCategory', foreignKey: 'staffCategoryId' })
    CustomerStaff.hasOne(models.CustomerStaffCredential, { as: 'customerStaffCredential', foreignKey: 'customerStaffId' })
    CustomerStaff.hasMany(models.CustomerStaffActivationToken, { as: 'customerStaffActivationTokens', foreignKey: 'customerStaffId' })
    CustomerStaff.hasOne(models.CustomerStaffActivationToken, { as: 'customerStaffActivationToken', foreignKey: 'customerStaffId', scope: { used: false } })
    CustomerStaff.hasMany(models.CustomerStaffResetPasswordToken, { as: 'customerStaffResetPasswordTokens', foreignKey: 'customerStaffId' })
    CustomerStaff.hasOne(models.CustomerStaffResetPasswordToken, { as: 'customerStaffResetPasswordToken', foreignKey: 'customerStaffId', scope: { used: false } })
    CustomerStaff.hasMany(models.SentEmail, { as: 'sentEmails', foreignKey: 'userId', scope: { userType: 'customerStaff' } })
    CustomerStaff.hasMany(models.EmailError, { as: 'emailErrors', foreignKey: 'userId', scope: { userType: 'customerStaff' } })
  }

  return CustomerStaff
}
