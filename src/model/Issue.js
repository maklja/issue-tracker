const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const IssueSchema = new Schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
	createdTimestamp: { type: Date, default: Date.now },
	reportedBy: { type: Schema.Types.ObjectId, ref: 'users' }, // which user created issue
	assignTo: { type: Schema.Types.ObjectId, ref: 'users' }, // issue is assign to usef
	status: { type: Schema.Types.ObjectId, ref: 'status' },
	deleted: { type: Boolean, default: false } // is issue archived
});

const Issue = mongoose.model('issues', IssueSchema);

module.exports = Issue;
