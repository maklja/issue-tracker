const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const IssueSchema = new Schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
	reportedBy: { type: Schema.Types.ObjectId, ref: 'users' },
	status: { type: Schema.Types.ObjectId, ref: 'status' },
	deleted: { type: String, default: false }
});

const Issue = mongoose.model('issues', IssueSchema);

module.exports = Issue;
