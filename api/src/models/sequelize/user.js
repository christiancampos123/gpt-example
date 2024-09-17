module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
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
      tableName: 'users',
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
    }
  )

  User.associate = function (models) {
    User.hasOne(models.UserCredential, { as: 'userCredential', foreignKey: 'userId' })
    User.hasMany(models.UserActivationToken, { as: 'userActivationTokens', foreignKey: 'userId' })
    User.hasOne(models.UserActivationToken, { as: 'userActivationToken', foreignKey: 'userId', scope: { used: false } })
    User.hasMany(models.UserResetPasswordToken, { as: 'userResetPasswordTokens', foreignKey: 'userId' })
    User.hasOne(models.UserResetPasswordToken, { as: 'userResetPasswordToken', foreignKey: 'userId', scope: { used: false } })
    User.hasMany(models.SentEmail, { as: 'sentEmails', foreignKey: 'userId', scope: { userType: 'userStaff' } })
    User.hasMany(models.EmailError, { as: 'emailErrors', foreignKey: 'userId', scope: { userType: 'userStaff' } })
  }

  return User
}
