/*const HomeModel = require('../models/HomeModel');

HomeModel.create({
    titulo: 'Um título de testes',
    discricao: 'Uma descricao de teste.'
})
    .then(dados => console.log(dados)).catch(e => console.log(e));*/
const Contacto = require('../models/ContactoModel');
exports.index = async (req, res, next) => {
    const contactos = await Contacto.searchContacts();
    res.render('index', { contactos });
};
