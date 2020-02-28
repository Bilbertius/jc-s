module.exports = {
	PORT: process.env.PORT || 8000,
	NODE_ENV: process.env.NODE_ENV || 'development',
	DATABASE_URL:process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432/jamcloud',
	JWT_SECRET: process.env.JWT_SECRET || 'dummy-jwt-secret',
	CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'https://jamclouds.now.sh/',
	API_KEY: process.env.API_KEY,
};