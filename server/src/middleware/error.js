const { StatusCodes, getReasonPhrase } = require('http-status-codes');

function notFound(req, res, next) {
	res.status(StatusCodes.NOT_FOUND).json({ message: 'Route not found' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
	const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
	const message = err.message || getReasonPhrase(status);
	if (process.env.NODE_ENV !== 'test') {
		// eslint-disable-next-line no-console
		console.error(err);
	}
	res.status(status).json({ message });
}

module.exports = { notFound, errorHandler };

