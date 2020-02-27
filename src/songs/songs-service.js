const xss = require('xss');

const SongsService = {
	getAllSongs(db) {
		return db.select('*').from('jams')
	},
	insertSong(db, newSong) {
		return db
			.insert(newSong)
			.into('jams')
			.returning('*')
			.then(rows => {
				return rows[0]
			})
	},
	getById(db, id) {
		return db.from('jams').select('*').where('id', id).first()
	},
	deleteSong(db, id) {
		return db
			.from('jams')
			.select('*')
			.where( 'id' , id)
			.delete()
	},
	updateSong(db, id, newSongFields) {
			return db('jams')
				.where({ id })
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
				date: new Date(song.show_date)
			}
		}
}


module.exports =  SongsService; 