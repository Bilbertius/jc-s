const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
	return [
		{
			id: 1,
			user_name: 'JohnBGood',
			user_email: 'John@b.good',
			password: null,
			date_joined: new Date()
		},
		{
			id: 2,
			user_name: 'AwesomeUserName',
			user_email: 'iamawesome@cool.com',
			password: null,
			date_joined: new Date()
		},
		{
			id: 3,
			user_name: 'JohnBGoodJr',
			user_email: 'Johnjr@good.b',
			password_hash: null,
			date: new Date()
		},
		
	]
}

function makeSongsArray() {
	return [
		{
			id: 1,
			song: 'this is a song i swear it',
			artist: 'art without the garfunkel',
			album: 'an album too',
			venue: 'egypt',
			show_date: '1989-05-25'
			
		},
		{
			id: 2,
			song: 'this is a song i swear it',
			artist: 'garfunkel formerly known as art',
			album: 'an album too',
			venue: 'egypt',
			show_date: '1979-05-25'
			
		},
		{
			id: 3,
			song: 'song2 or 3',
			artist: 'art without the garfunkel',
			album: 'an album too',
			venue: 'egypt',
			show_date: '1909-05-25'
			
		},
		{
			id: 4,
			song: 'rap song with naughty words',
			artist: 'garfunkel sans art',
			album: 'an album toom',
			venue: 'egypt',
			show_date: '1909-05-25'
			
		}
	]
}

function makeExpectedSong() {
	return {
		id: song.id,
		song: song.song,
		artist: song.artist,
		album: sond.album,
		venue: song.venue,
		show_date: song.show_date
	}
}



function makeMaliciousSong(user) {
	const maliciousSong = {
		id: 911,
		song: 'Naughty naughty very naughty <script>alert("xss");</script>',
		artist: song.artist,
		content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
	}
	const expectedSong = {
		...makeExpectedSong([user], maliciousSong),
		song: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
		content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
	}
	return {
		maliciousSong,
		expectedSong,
	}
}

function makeSongsFixtures() {
	const testUsers = makeUsersArray()
	const testSongs = makeSongsArray(testUsers)

	return { testUsers, testSongs }
}

function cleanTables(db) {
	return db.raw(
		`TRUNCATE
      jams,
      users,
      RESTART IDENTITY CASCADE`
	)
}

function seedSongsTables(db, users, jams) {
	return db
		.into('users')
		.insert(users)
		.then(() =>
			db
				.into('jams')
				.insert(jams)
		)
		
}

function seedMaliciousSong(db, user, song) {
	return db
		.into('users')
		.insert([user])
		.then(() =>
			db
				.into('jams')
				.insert([song])
		)
}

module.exports = {
	makeUsersArray,
	makeSongsArray,
	makeExpectedSong,

	makeMaliciousSong,
	
	
	makeSongsFixtures,
	cleanTables,
	seedSongsTables,
	seedMaliciousSong,
}


