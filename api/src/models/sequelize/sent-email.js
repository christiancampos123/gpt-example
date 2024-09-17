module.exports = function (sequelize, DataTypes) {
  const SentEmail = sequelize.define('SentEmail', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    emailTemplate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sendAt: {
      type: DataTypes.DATE
    },
    readedAt: {
      type: DataTypes.DATE
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull: false
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
    tableName: 'sent_emails',
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
      }
    ]
  })

  SentEmail.associate = function (models) {
    SentEmail.belongsTo(models.User, { as: 'user', foreignKey: 'userId' })
    SentEmail.belongsTo(models.CustomerStaff, { as: 'customerStaff', foreignKey: 'userId' })
  }

  return SentEmail
}
