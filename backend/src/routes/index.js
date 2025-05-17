const auth = require('./auth');
const base = 'api/v1/'
function routes(app) {
    app.use(`/${base}auth`, auth);

}
module.exports = routes;