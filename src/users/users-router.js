const express = require('express');
const UsersService = require('./users-service');
const UsersRouter = express.Router();
const jsonBodyParser = express.json();





UsersRouter.route('/')
	.post(jsonBodyParser, (req, res, next) => {
		const { user_name, user_email, password } = req.body;
		
		for (const field of [ 'user_name','user_email', 'password'])
			if (!req.body[field])
				return res.status(400).json({
					error: `Missing '${field}' in request body`
				})
		const passwordError = UsersService.validatePassword(password);
		
		if (passwordError)
			return res.status(400).json({ error: passwordError });
		
		const emailError = UsersService.validateEmail(user_email);
		
		if (emailError)
			return res.status(400).json({error: emailError});
	
		
		UsersService.hasUserWithUserName(
			req.app.get('db'),
			user_name
		)
			.then(hasUserWithUserName => {
				if (hasUserWithUserName)
					return res.status(400).json({ error: `Username already taken` })
				return UsersService.hashPassword(password)
					.then(hashedPassword => {
						const newUser = {
							user_name,
							user_email,
							password: hashedPassword,
							date_joined: 'now()'
						}
						return UsersService.insertUser(req.app.get('db'), newUser)
							.then(user => {
								res
									.status(201)
									.json(UsersService.serializeUser(user))
							})
					})
			})
			.catch(next)
	})

module.exports = UsersRouter;