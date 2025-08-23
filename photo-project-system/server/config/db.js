import mongoose from 'mongoose';

export async function connectDB(uri) {
  try {
    console.log('Connecting to MongoDB URI:', uri); // debug
    await mongoose.connect(uri, { 
      dbName: 'photobook',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      tls: true, // Force TLS
      tlsAllowInvalidCertificates: false, 
    });
    console.log('MongoDB Atlas connected successfully');
  } catch (err) {
    console.error('MongoDB connection error', err.message);
    process.exit(1);
  }
}
