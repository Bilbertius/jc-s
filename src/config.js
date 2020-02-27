module.exports = {
	PORT: process.env.PORT || 8000,
	NODE_ENV: process.env.NODE_ENV || 'development',
	DATABASE_URL:process.env.DATABASE_URL || '$(heroku config:get DATABASE_URL -a your-app)',
	JWT_SECRET: process.env.JWT_SECRET,
	CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'https://jamclouds.now.sh/'
};