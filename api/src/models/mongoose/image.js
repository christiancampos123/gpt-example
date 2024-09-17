module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      filename: String,
      deletedAt: Date
    },
    { timestamps: true }
  )

  const Image = mongoose.model('Image', schema, 'images')
  return Image
}
