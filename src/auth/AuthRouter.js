const express = require('express');
const AuthService = require('./AuthService');
const AuthRouter = express.Router();
const jsonBodyParser = express.json();

AuthRouter
	.route('/')
	.post(jsonBodyParser, (req, res, next) => {
		console.log(req);
		const {user_name, password} = req.body;
		const loginUser = {user_name, password};
		
		for(const [key, value] of Object.entries(loginUser))
			if(value == null)
				return res.status(400).json({
					error: `Missing '${key}' in request body`
				});
		
		AuthService.getUserWithUserName(
			req.app.get('db'),
			loginUser.user_name
		)
			.then(User =>{
				if(!User)
					return res.status(400).json({
						error: `Incorrect username or password`
					});
				
				return AuthService.comparePasswords(loginUser.password, User.password_hash)
					.then(match =>{
						if(!match)
							return res.status(400).json({
								error: `Incorrect username or password`
							});
						const sub = User.user_name;
						const payload = {user_id: User.id};
						
						res.send({
							authToken: AuthService.createJwt(sub, payload),
						})
					})
			})
			.catch(next)
	});

module.exports = AuthRouter;



