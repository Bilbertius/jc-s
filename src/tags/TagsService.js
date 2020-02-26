const TagsService = {
    getAllTags(db) {
        return db
            .select('*')
            .from('tags')
    },

    insertTag(db, newTag) {
        return db
            .insert(newTag)
            .into('tags')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(db, id) {
        return db
            .from('tags')
            .select('*')
            .where({ id })
            .first()
    },

    deleteTag(db, id) {
        return db
            .from('tags')
            .where({ id })
            .delete()
    },

    updateTag(db, id, newTagFields) {
        return db
            .from('tags')
            .where({ id })
            .update(newTagFields)
    },
}

module.exports = TagsService;