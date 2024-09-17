module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      name: String,
      environment: String,
      private: Boolean,
      items: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
      },
      deletedAt: Date
    },
    { timestamps: true }
  )

  const Menu = mongoose.model('Menu', schema, 'menus')
  return Menu
}
