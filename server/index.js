const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectToDatabase } = require('./src/config/db');
const taskRoutes = require('./src/routes/taskRoutes');
const { notFound, errorHandler } = require('./src/middleware/error');

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
	res.json({ status: 'ok' });
});

app.use('/api/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;


connectToDatabase(MONGO_URI)
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server listening on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.error('Failed to connect to database', err);
		process.exit(1);
	});

