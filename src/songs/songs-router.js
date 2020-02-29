const express = require ('express');
const SongsService = require ('./songs-service');

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
		
		for (const [key, value] of Object.entries(newSong)) {
			if (value === null ) {
				return res.json({
					error: { message : `Missing ${key} in request body`}
				})
			}
		}
		
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
	.route('/:song_id')
	.all((req,res,next) => {
		const db = req.app.get('db');
		
		SongsService.getById(db, req.params.song_id)
			.then(song => {
			if(!song) {
			return res.status(404).json({
				error: {message: 'Song not found'}
			})
			}
				res.song = song;
				next()
			})
			.catch(next)
	})
	
	.get((req,res,next) => {
		res.json(SongsService.serializeSong(res.song))
	})
	
	.delete((req,res,next) => {
		const db = req.app.get('db');
		
		SongsService.deleteSong(db, req.params.song_id)
			.then(() => {
				res.status(204).end()
			})
			.catch(next)
	});



module.exports = SongsRouter;

