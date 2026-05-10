const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const Product = require('./src/models/Product');

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);
    
    for (const product of products) {
      product.slug = product.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      await product.save();
      console.log(`Updated: ${product.name} -> ${product.slug}`);
    }
    
    console.log('Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

migrate();
