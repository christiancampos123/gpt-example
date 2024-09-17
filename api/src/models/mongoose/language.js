module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      name: String,
      alias: String,
      selected: Boolean,
      default: Boolean,
      deletedAt: Date
    },
    { timestamps: true }
  )

  const Language = mongoose.model('Language', schema, 'languages')
  return Language
}
