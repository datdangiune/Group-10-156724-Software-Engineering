const auth = require('./auth');
const admin = require('./admin');
const base = 'api/v1/'
function routes(app) {
    app.use(`/${base}auth`, auth);
    app.use(`/${base}admin`, admin);
}
module.exports = routes;