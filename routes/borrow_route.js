const Borrow = require('../controllers/borrow');

module.exports = (app) => {
    app.route('/api/v1/borrow').post(Borrow.borrow);

    app.route('/api/v1/return').post(Borrow.return);

}