const mongoose = require('mongoose');

async function connectToDatabase(mongoUri) {
	if (!mongoUri) {
		throw new Error('MONGO_URI is not defined');
	}
	// mongoose.set('strictQuery', true);
    console.log("ello")
	await mongoose.connect(mongoUri);
}

module.exports = { connectToDatabase };

