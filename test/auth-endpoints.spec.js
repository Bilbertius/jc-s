const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('auth endpoints', function() {
	let db;
	
	const   testUsers  = helpers.makeUsersArray();
	const testUser = testUsers[0];
	
	beforeEach('make knex instance', () => {
		db = knex({
			client: 'pg',
			connection: process.env.TEST_DATABASE_URL,
		})
		app.set('db', db)
	})
	
	after('disconnect from db', () => db.destroy());
	
	before('cleanup', () => helpers.cleanTables(db));
	
	afterEach('cleanup', () => helpers.cleanTables(db));
	
	describe(`POST /api/auth/login`, () => {
		beforeEach('insert users', () =>
			helpers.seedUsers(
				db,
				testUsers,
			)
		)
		
		const requiredFields = ['user_name', 'password'];
		
		requiredFields.forEach(field => {
			const loginAttemptBody = {
				user_name: testUser.user_name,
				password: testUser.password,
					  };
					  it(`responds with 400 required error when '${field}' is missing`, () => {
					  	delete loginAttemptBody[field];
						  
						  return supertest(app)
							  .post('/api/auth/login')
						      .send(loginAttemptBody)
						      .expect(400, {
						      	error: `Missing '${field}' in request body`,
						      })
						  })
				})
	})
});