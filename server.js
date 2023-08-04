require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');
const path = require('path');
const { myMiddleware, checkCsrfError, csrfMiddleware } = require('./src/middleware/middleware');
const mongoose = require('mongoose');
const helmet = require('helmet');
const csrf = require('csurf');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');

mongoose.connect(process.env.CONNECTIONSTRING).
    then(() => {
        console.log('BD online');
        app.emit('pronto');
    }).catch(e => console.error(e));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
const sessionOptions = session({
    secret: 'sd8sd5sds8aswffg8gghw+w3 sjdsdsi +232dsds',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});

app.use(sessionOptions);
app.use(flash());
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');
app.use(csrf());
app.use(myMiddleware);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

/*app.post('/', function (req, res) {
    res.send(`O que enviaste é ${req.body.name}`);
});

app.get('/Contacto/:id_usuario?', function (req, res) {
    res.send(req.params.id_usuario || 'Olá mundo');
});
*/
app.on('pronto', () => {
    app.listen('3000', () => {
        console.log('listening on http://localhost:3000');
    });
});
