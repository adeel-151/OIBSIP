import mongoose from 'mongoose';

const uri = 'mongodb+srv://adeelkhattak223_db_user:1aoP0ueKKceERcjH@cluster0.pfwrej6.mongodb.net/pizzaro?appName=Cluster0';

const ingredientSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  image: String,
  isAvailable: Boolean,
});

const inventorySchema = new mongoose.Schema({
  ingredientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true, unique: true },
  quantity: { type: Number, required: true, min: 0, default: 0 },
  threshold: { type: Number, required: true, min: 0, default: 10 },
  unit: { type: String, required: true, default: 'pcs' },
  lowStockAlertSent: { type: Boolean, default: false },
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
const Inventory = mongoose.model('Inventory', inventorySchema);

async function seedInventory() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const ingredients = await Ingredient.find();
    console.log(`Found ${ingredients.length} ingredients.`);

    let addedCount = 0;

    for (const ing of ingredients) {
      const existing = await Inventory.findOne({ ingredientId: ing._id });
      if (!existing) {
        let unit = 'pcs';
        let threshold = 50;
        let quantity = Math.floor(Math.random() * 200) + 100; // 100 to 300

        if (ing.category === 'BASE') {
          unit = 'pcs';
          threshold = 20;
          quantity = 150;
        } else if (ing.category === 'CHEESE') {
          unit = 'kg';
          threshold = 10;
          quantity = 50;
        } else if (ing.category === 'SAUCE') {
          unit = 'l';
          threshold = 5;
          quantity = 30;
        } else if (ing.category === 'VEGETABLE') {
          unit = 'kg';
          threshold = 5;
          quantity = 25;
        }

        await Inventory.create({
          ingredientId: ing._id,
          quantity,
          threshold,
          unit,
        });
        addedCount++;
        console.log(`Created inventory for ${ing.name}`);
      } else {
        console.log(`Inventory already exists for ${ing.name}`);
      }
    }

    console.log(`Successfully added ${addedCount} new inventory items.`);
  } catch (error) {
    console.error('Error seeding inventory:', error);
  } finally {
    mongoose.disconnect();
  }
}

seedInventory();
