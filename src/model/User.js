const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;
const HASH_SALT = 10;

const userSchema = new Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	createdTimestamp: { type: Date, default: Date.now },
	admin: { type: Boolean, default: false },
	activated: { type: Boolean, default: false }
});

userSchema.pre('save', function(done) {
	const user = this;
	if (user.isModified('password') === false) {
		return done();
	}

	bcrypt.genSalt(HASH_SALT, (err, salt) => {
		if (err) {
			done(err);
			return;
		}

		bcrypt.hash(user.password, salt, (err, hash) => {
			if (err) {
				done(err);
				return;
			}

			user.password = hash;

			done();
		});
	});
});

userSchema.methods.checkPassword = function(guess) {
	return bcrypt.compare(guess, this.password);
};

userSchema.methods.fullName = function() {
	return `${this.firstName} ${this.lastName}`;
};

const User = mongoose.model('users', userSchema);

module.exports = User;
