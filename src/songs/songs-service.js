 const xss = require('xss');

const SongsService = {
	/*
	The following functions are tasked with providing the api with an interface to
	utulize the database.
	 */
	
	/*
	Grabs all songs from the table called 'jams'
	 */
	getAllSongs(db) {
		return db.select('*').from('jams')
	},
	
	/*
	Inserts a user created song into the table called 'jams'
	 */
	insertSong(db, newSong) {
		return db
			.insert(newSong)
			.into('jams')
			.returning('*')
			.then(rows => {
				return rows[0]
			})
	},
	
	/*
	Finds a song based on the songs unique id
	 */
	getById(db, id) {
		return db
			.from('jams')
			.select('*')
			.where({ id })
			.first()
	},
	
	/*
	Removes a song from the database based on its unique id
	 */
	deleteSong(db, id) {
		return db('jams')
			.where({ id })
			.delete()
	},
	updateSong(db, id, newSongFields) {
		return db
			.from('jams')
			.where( id )
			.update(newSongFields)
	},
	
	serializeSongs(songs) {
		return songs.map(this.serializeSong)
	},
	
	serializeSong(song) {
	
			return {
				id: song.id,
				song: xss(song.song),
				artist: xss(song.artist),
				album: xss(song.album),
				venue: xss(song.venue),
				date: song.show_date
			}
		}
};


module.exports =  SongsService; 