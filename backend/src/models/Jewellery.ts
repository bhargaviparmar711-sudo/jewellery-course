import { Schema, model, models } from 'mongoose';

const JewellerySchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  tags: [{ type: String }],
  description: String
}, { timestamps: true });

const Jewellery = models.Jewellery || model('Jewellery', JewellerySchema);

export default Jewellery;
