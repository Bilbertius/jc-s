const path = require('path');
const express = require('express');
const xss = require('xss');
const TagsService = require('./TagsService');

const TagsRouter = express.Router();
const jsonBodyParser = express.json();

const serializeTag = tag => ({
    id: tag.id,
    jam_id: tag.jam_id,
    user_id: tag.user_id,
    tag_content: xss(tag.tag_content),
})

TagsRouter
  .route('/')
  .get((req, res, next) => {
    const db = req.app.get('db');
    TagsService.getAllTags(db)
      .then(tags => {
        res.json(tags.map(serializeTag))
      })
      .catch(next)
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { tag_name, user_id, jam_id, tag_content } = req.body;
    const newTag = { tag_name, user_id, jam_id };

    for (const [key, value] of Object.entries(newTag))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });

    newTag.modified = modified;
    newTag.tag_content = tag_content;
    TagsService.insertTag(
      req.app.get('db'),
      newTag
    )
      .then(tag => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${tag.id}`))
          .json(serializeTag(tag))
      })
      .catch(next)
  });

TagsRouter
  .route('/:tag_id')
  .all((req, res, next) => {
    TagsService.getById(
      req.app.get('db'),
      req.params.tag_id
    )
      .then(tag => {
        if (!tag) {
          return res.status(404).json({
            error: { message: `Tag doesn't exist` }
          })
        }
        res.tag = tag ;// save the tag for the next middleware
        next() // don't forget to call next so the next middleware happens!
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeTag(res.tag))
  })
  .delete((req, res, next) => {
    TagsService.deleteTag(
      req.app.get('db'),
      req.params.tag_id
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonBodyParser, (req, res, next) => {
          const { tag_id, jam_id, tag_content } = req.body;
    const tagToUpdate = { tag_id, jam_id };

    const numberOfValues = Object.values(tagToUpdate).filter(Boolean).length;
        return res.status(400).json({
          error: {
            message: `Request body must contain a tag id`
          }
        })
    
    tagToUpdate.tag_content = tag_content;
    TagsService.updateTag(
      req.app.get('db'),
      req.params.tag_id,
      tagToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next);
  })

module.exports = TagsRouter;