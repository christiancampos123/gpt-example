module.exports = function (sequelize, DataTypes) {
  const Customer = sequelize.define('Customer', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    commercialCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Categoría de comercio".'
        },
        notEmpty: {
          msg: 'Por favor, rellena el campo "Categoría de comercio".'
        }
      }
    },
    commercialName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Nombre Commercial".'
        },
        notEmpty: {
          msg: 'Por favor, rellena el campo "Nombre Commercial".'
        }
      }
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
    tableName: 'customers',
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
        name: 'customers_commercialCategoryId_fk',
        using: 'BTREE',
        fields: [
          { name: 'commercialCategoryId' }
        ]
      }
    ]
  })

  Customer.associate = function (models) {
    Customer.belongsTo(models.CommercialCategory, { as: 'commercialCategory', foreignKey: 'commercialCategoryId' })
  }

  return Customer
}
