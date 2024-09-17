module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      entity: String,
      entityId: mongoose.Schema.Types.ObjectId,
      environment: String,
      filename: String,
      languageAlias: String,
      url: String,
      title: String,
      description: String,
      redirect: mongoose.Schema.Types.ObjectId,
      changeFrequency: String,
      priority: Number,
      sitemap: Boolean,
      slugs: [
        {
          entityId: mongoose.Schema.Types.ObjectId,
          url: String,
          title: String,
          description: String,
          deletedAt: Date
        }
      ],
      deletedAt: Date
    },
    { timestamps: true }
  )

  const LocaleSeo = mongoose.model('LocaleSeo', schema, 'locale-seos')
  return LocaleSeo
}
