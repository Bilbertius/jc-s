const express = require('express');
const path = require('path');
const UserService = require('./UserService');

const UserRouter = express.Router();
const jsonBodyParser = express.json();

UserRouter
	.route('/')
	.post(jsonBodyParser,  (req, res, next) => {
		console.log(req)
		const { user_name, user_email, password } = req.body;
		
		for (const field of ['user_name', 'user_email', 'password'])
			if (!req.body[field])
				return res.status(400).json({
					error: `Missing '${field}' in request body`
				});
		

		
		const passwordError = UserService.validatePassword(password);
		
		if (passwordError){
			return res.status(400).json({ error: passwordError });
		}
		const emailError = UserService.validateEmail(user_email);
		
		if (emailError) {
			return res.status(400).json({error: emailError});
		}
		UserService.hasUserWithUserName(
			req.app.get('db'),
			user_name
		)
			.then(hasUserWithUserName => {
				if (hasUserWithUserName)
					return res.status(400).json({ error: `Username already taken` })
				
				return UserService.hashPassword(password)
					.then(hashedPassword => {
						const newUser = {
							user_name,
							user_email,
							password_hash: hashedPassword,
							date_joined: 'now()',
						};
						
						return UserService.insertUser(
							req.app.get('db'),
							newUser
						)
							.then(user => {
								res
									.status(201)
									.location(path.posix.join(req.originalUrl, `/${user.id}`))
									.json(UserService.serializeUser(user))
							})
					})
			})
			.catch(next)
	})

module.exports = UserRouter;