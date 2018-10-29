const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StatusSchema = new Schema({
	name: { type: String, required: true, unique: true },
	priority: { type: String, default: -1 },
	createdBy: { type: Schema.Types.ObjectId, ref: 'users' }
});

const Issue = mongoose.model('status', StatusSchema);

module.exports = Issue;
