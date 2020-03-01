const app = require('../src/app');

describe('App', () =>{
	it('GET / responds with  containing "Hello, world!"', () =>{
		return supertest(app)
			.get('/')
			.set('Authorization', `Bearer ${process.env.API_KEY}`)
			.expect(200, 'Hello, world!');
	});
});