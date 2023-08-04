const Login = require('../models/LoginModel');
const Contacto = require('../models/ContactoModel');

exports.index = async (req, res) => {

    if (req.session.user) {
        const contactos = await Contacto.searchContacts();
        return res.render('index', { contactos });
    }
    res.render('login');
};
exports.register = async (req, res, next) => {
    try {
        const login = new Login(req.body);
        await login.register();
        if (login.errors.length > 0) {

            req.flash('errors', login.errors);
            req.session.save(function () {
                return res.redirect('back');
            });
            return;
        }
        req.flash('success', 'Seu usuário foi cadastrado com sucesso!');
        req.session.save(function () {
            return res.redirect('back');
        });

    } catch (e) {
        return res.render('404');
    }


};
exports.login = async (req, res, next) => {
    try {
        const login = new Login(req.body);
        await login.login();
        if (login.errors.length > 0) {

            req.flash('errors', login.errors);
            req.session.save(function () {
                return res.redirect('back');
            });
            return;
        }
        req.flash('success', 'Entrou no sistema!');
        req.session.user = login.user;
        req.session.save(function () {
            return res.redirect('back');
        });

    } catch (e) {
        return res.render('404');
    }


};
exports.logout = function (req, res) {
    req.session.destroy();
    res.redirect('/');
};

