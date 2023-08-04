const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);
class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }
    async login() {
        this.validar();
        if (this.errors.legth > 0) return;
        this.user = await LoginModel.findOne({ email: this.body.email });
        if (!this.user) {
            this.errors.push('User and password invalid');
            return;
        }
        if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push('User or password invalid');
            this.user = null;
            return;
        }
    }
    async register() {
        this.validar();
        if (this.errors.legth > 0) return;
        await this.userExist();
        if (this.errors.legth > 0) return;
        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);
        this.user = await LoginModel.create(this.body);

    }
    async userExist() {
        this.user = await LoginModel.findOne({ email: this.body.email });
        if (this.user) this.errors.push('user already exists');
    }
    validar() {
        this.cleanUp();
        if (!validator.isEmail(this.body.email)) {
            this.errors.push('E-mail invalid');
        }
        if (this.body.password.length < 3 || this.body.password.length > 50) {
            this.errors.push('Password must have characters between 3 and 50');
        }
    }
    cleanUp() {
        for (let key in this.body) {
            if (typeof this.body[key] !== 'string')
                this.body[key] = '';
        }
        this.body = {
            email: this.body.email,
            password: this.body.password
        }
    }
}
module.exports = Login;