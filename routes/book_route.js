const Book = require('../controllers/book');

module.exports = (app) => {
    app.route('/api/v1/books').get(Book.get_all);

    app.route('/api/v1/books/:bookCode').get(Book.get_by_id);

    app.route('/api/v1/books').post(Book.create);

    app.route('/api/v1/books').put(Book.update);

    app.route('/api/v1/books/:bookCode').delete(Book.delete);

}