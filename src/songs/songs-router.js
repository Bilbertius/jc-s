const express = require ('express');
const SongsService = require ('./songs-service');
const logger = require('../logger');

const SongsRouter = express.Router();
const bodyParser = express.json();



SongsRouter
	.route('/')
	.get((req,res,next) => {
		const db = req.app.get('db');
		SongsService.getAllSongs(db)
			.then(songs => {
				res.json(SongsService.serializeSongs(songs))
			})
			.catch(next);
	})
	.post(bodyParser, (req, res, next) => {
		const db = req.app.get('db');
		
		const { song, artist, album, venue, show_date } = req.body;
		const newSong = { song, artist, album, venue, show_date };
		
		SongsService.insertSong(db, newSong)
			
			.then(song => {
				res
					.status(201)
					.location(`/songs/${song.id}`)
					.json(SongsService.serializeSong(newSong))
			})
			.catch(next);
});

SongsRouter
	.route('/songs/:song_id')
	.all((req,res,next) => {
		const db = req.app.get('db');
		const {song_id} = req.params;
		SongsService.getById(db, song_id).then(song => {
			if(!song) {
			logger.error(`Song with id of ${song_id} not found`)
			return res.status(404).json({
				error: {message: 'Song not found'}
			})
			}
				res.song = song;
				next()
			})
			.catch(next)
	})
	.get((req,res) => {
		res.json(SongsService.serializeSong(res.song));
	})
	.delete((req,res,next) => {
		const db = req.app.get('db');
		const { song_id } = req.params;
		SongsService.deleteSong(db, song_id).then(numRowsAffected => {
			logger.info(`Card with id ${bookmark_id} deleted.`)
			res.status(204).end()
			})
			.catch(next)
	})



module.exports = SongsRouter;

