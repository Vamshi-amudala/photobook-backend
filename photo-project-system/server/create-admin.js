// server/adminSetup.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

// --- Admin Schema ---
const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, default: 'admin' },
    permissions: [String],
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
adminSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Admin model
const Admin = mongoose.model('Admin', adminSchema);

// --- Create Admin Function ---
async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'photobook',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB Atlas');

    // Delete old admin if exists
    const existingAdmin = await Admin.findOne({ email: 'ayan.v2001@gmail.com' });
    if (existingAdmin) {
      await Admin.deleteOne({ email: 'ayan.v2001@gmail.com' });
      console.log('🗑️ Deleted old admin:', existingAdmin.email);
    }

    // Create new admin
    const adminData = {
      name: 'Ayan',
      email: 'ayan.v2001@gmail.com',
      password: 'ayan123', // Will be hashed automatically
      permissions: ['manage_users', 'manage_photographers', 'view_stats', 'approve_profiles'],
    };

    const admin = await Admin.create(adminData);
    console.log('✅ New admin created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🆔 User ID:', admin._id);
    console.log('🔐 Permissions:', admin.permissions);

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
}

createAdmin();
