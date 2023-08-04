const mongoose = require('mongoose');
const validator = require('validator');
const ContactoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    data: { type: Date, default: Date.now },
});

const ContactoModel = mongoose.model('Contacto', ContactoSchema);

function Contacto(body) {
    this.body = body;
    this.errors = [];
    this.contacto = null;
}
Contacto.searchId = async function (id) {
    const contacto = await ContactoModel.findById(id);
    return contacto;

}
Contacto.searchContacts = async function () {
    const contacto = await ContactoModel.find().sort({ criadoEm: -1 });
    return contacto;

}
Contacto.prototype.register = async function () {
    this.validar();
    if (this.errors.legth > 0) return;
    this.contacto = await ContactoModel.create(this.body);
};

Contacto.prototype.validar = function () {
    this.cleanUp();
    if (this.body.email && !validator.isEmail(this.body.email))
        this.errors.push('E-mail invalid');
    if (!this.body.nome) this.errors.push('Name is required');
    if (!this.body.email && !this.body.telefone) this.errors.push('E-mail or phone number is required');

};
Contacto.prototype.cleanUp = function () {
    for (let key in this.body) {
        if (typeof this.body[key] !== 'string')
            this.body[key] = '';
    }
    this.body = {
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone
    }
};
Contacto.prototype.edit = async function (id) {
    if (typeof id !== 'string') return;
    this.validar();
    if (this.errors.legth > 0) return;
    this.Conctato = await ContactoModel.findByIdAndUpdate(id, this.body, { new: true });
}
Contacto.delete = async function (id) {
    if (typeof id !== 'string') return;
    const contacto = await ContactoModel.findByIdAndDelete(id);
    return contacto;
}
module.exports = Contacto;