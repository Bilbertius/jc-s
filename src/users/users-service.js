const bcrypt = require('bcryptjs');
const xss = require('xss');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
	hasUserWithUserName(db, user_name) {
		return db('users')
			.where({ user_name })
			.first()
			.then(user => !!user)
	},
	insertUser(db, newUser) {
		return db
			.insert(newUser)
			.into('users')
			.returning('*')
			.then((user) => user[0])
	},
	validateEmail(email) {
		const VALID_EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		if(!VALID_EMAIL_REGEX.test(email) || !email) {
			return 'Please enter a valid e-mail address';
		}
		return null;
	},
	
	validatePassword(password) {
		if (password.length < 8) {
			return 'Password must be longer than 8 characters'
		}
		if (password.length > 72) {
			return 'Password must be less than 72 characters'
		}
		if (password.startsWith(' ') || password.endsWith(' ')) {
			return 'Password must not start or end with empty spaces'
		}
		if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
			return 'Password must contain one upper case, lower case, number and special character'
		}
		return null
	},
	hashPassword(password) {
		return bcrypt.hash(password, 6)
	},
	serializeUser(user) {
		return {
			id: user.id,
			user_name: xss(user.user_name),
			user_email: xss(user.user_name),
			date_created: new Date(user.date_created),
		}
	},
}

module.exports = UsersService;