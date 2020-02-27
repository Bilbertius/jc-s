const express = require ('express');
const SongsService = require ('./SongsService');
const { requireAuth } = require('../middleware/jwt-auth');
const cors = require('cors');
const xss = require('xss')

const SongsRouter = express.Router();
jsonBodyParser = express.json();




SongsRouter
	.route('/')
	.get(jsonBodyParser, (req,res,next) => {
		const db = req.app.get('db');
		SongsService.getAllSongs(db)
			.then(songs => {
				res.json(SongsService.serializeSongs(songs))
			})
			.catch(next);
	});
SongsRouter
	.route('/')
	.post(jsonBodyParser, (req, res, next) => {
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




async function checkSongExists(req, res, next) {
	try {
		const song = await SongsService.getById(
			req.app.get('db'),
			req.params.song_id
		);
		
		if (!song)
			return res.status(404).json({
				error: `Song doesn't exist`
			});
		
		res.song = song;
		next()
	} catch (error) {
		next(error)
	}
}

module.exports = SongsRouter;

