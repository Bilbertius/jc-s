const express = require ('express');
const SongsService = require ('./songs-service');
const path = require('path');
const SongsRouter = express.Router();
const bodyParser = express.json();
const { getSongValidationError } = require('./song-validator');


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
					.location(path.posix.join(req.originalUrl, `${song.id}`))
					.json(SongsService.serializeSong(song))
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
	
	.get((req,res) => {
		res.json(SongsService.serializeSong(res.song))
	})
	
	.delete((req,res,next) => {
		const db = req.app.get('db');
		const songID = req.params;
		
	
		SongsService.deleteSong(db, songID)
			.then(numRowsAffected => {
				res.status(204).end()
			})
			.catch(next);
	})
	
	.patch(bodyParser, (req,ers,next) => {
		const { song, artist, album, venue, show_date } = req.body;
		const songToUpdate = { song, artist, album, venue, show_date };
		
		const numberOfValues = Object.values(songToUpdate).filter(Boolean).length;
		if (numberOfValues === 0) {
			return res.status(400).json({
				error: {
					message: `Request body must content either 'song', 'artist', 'album', 'venue' or 'date'`
				}
			})
		}
		
		const error =  getSongValidiationError(songToUpdate);
		
		if (error) return res.status(400).send(error);
		
		SongsService.updateSong(
			req.app.get('db'),
			req.params.song_id,
			songToUpdate
		)
			.then(res => {
				res.status(204).end()
			})
			.catch(next)
	});




module.exports = SongsRouter;

