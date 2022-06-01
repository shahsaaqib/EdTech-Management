const mongoose = require('mongoose');
const slugify = require('slugify');

const SchoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters'],
    },
    slug: String,
    city: {
      type: String,
      required: [true, 'Please add an city'],
    },
    state: {
      type: String,
      required: [true, 'Please add an state'],
    },
    country: {
      type: String,
      required: [true, 'Please add an country'],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create school slug from the name
SchoolSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Cascade delete students when a school is deleted
SchoolSchema.pre('remove', async function (next) {
  console.log(`Students being removed from school ${this._id}`);
  await this.model('Student').deleteMany({ school: this._id });
  next();
});

// Reverse populate with virtuals
SchoolSchema.virtual('students', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'school',
  justOne: false,
});

module.exports = mongoose.model('School', SchoolSchema);
