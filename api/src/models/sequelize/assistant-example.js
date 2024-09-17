module.exports = function (sequelize, DataTypes) {
  const AssistantExample = sequelize.define('AssistantExample', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    assistantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Assistant',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Título".'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Descripción".'
        }
      }
    },
    prompt: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "Prompt".'
        }
      }
    }
  }, {
    sequelize,
    tableName: 'assistant_examples',
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
        name: 'chat_assistantId_fk',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'assistantId' }
        ]
      }
    ]
  })

  AssistantExample.associate = function (models) {
    AssistantExample.belongsTo(models.Assistant, { as: 'assistant', foreignKey: 'assistantId' })
  }

  return AssistantExample
}
