const express = require('express');
const ObjectID = require('mongodb').ObjectID;

const router = express.Router();
const Issue = require('../model/Issue');
const Status = require('../model/Status');
const { ensureAuthenticated, ensureIsAdmin } = require('./middlewares');

const getIssueQuery = () => {
	return [
		// "merge" with status collection
		{
			$lookup: {
				from: 'status',
				localField: 'status',
				foreignField: '_id',
				as: 'status'
			}
		},
		{
			$lookup: {
				from: 'users',
				localField: 'assignTo',
				foreignField: '_id',
				as: 'assignTo'
			}
		},
		// "merge" with users collection
		{
			$lookup: {
				from: 'users',
				localField: 'reportedBy',
				foreignField: '_id',
				as: 'reportedBy'
			}
		},
		// create projection to extract specific fields ant to extract
		// first status and reportedBy form arrays
		{
			$project: {
				_id: 1,
				title: 1,
				content: 1,
				status: { $arrayElemAt: ['$status', 0] },
				reportedBy: {
					$arrayElemAt: ['$reportedBy', 0]
				},
				assignTo: {
					$arrayElemAt: ['$assignTo', 0]
				}
			}
		},
		// final set of fields that we are sending to the client
		{
			$project: {
				_id: 1,
				title: 1,
				content: 1,
				'status._id': 1,
				'status.name': 1,
				'reportedBy._id': 1,
				'reportedBy.username': 1,
				'reportedBy.firstName': 1,
				'reportedBy.lastName': 1,
				'assignTo._id': 1,
				'assignTo.username': 1,
				'assignTo.firstName': 1,
				'assignTo.lastName': 1
			}
		}
	];
};

router.post('/issue/assign', ensureAuthenticated, async (req, resp) => {
	const { id } = req.body;

	try {
		await Issue.updateMany(
			{ _id: id },
			{
				assignTo: req.user._id
			}
		);

		const query = getIssueQuery();
		query.unshift({ $match: { _id: ObjectID(id) } });
		const issues = await Issue.aggregate(query).exec();

		resp.json(issues[0]);
	} catch (error) {
		// TODO log error
		resp.status(500).json({
			error: 'INTERNAL_ERROR'
		});
	}
});

router.delete('/issue', ensureIsAdmin, async (req, resp) => {
	const { _id } = req.body;

	try {
		// do a hard delete only
		await Issue.deleteOne({ _id });

		resp.status(204).send();
	} catch (error) {
		// TODO log error
		resp.status(500).json({
			error: 'INTERNAL_ERROR'
		});
	}
});

router.post('/issue/archive', ensureAuthenticated, async (req, resp) => {
	const { _id } = req.body;

	try {
		// do a soft delete only
		await Issue.updateOne(
			{ _id },
			{
				deleted: true
			}
		);

		resp.status(204).send();
	} catch (error) {
		// TODO log error
		resp.status(500).json({
			error: 'INTERNAL_ERROR'
		});
	}
});

router.get('/issue/:id', async (req, resp) => {
	const issueId = req.params.id;

	try {
		const issue = await Issue.findById(issueId);

		resp.json(issue);
	} catch (error) {
		// TODO log error
		resp.status(500).json({
			error: 'INTERNAL_ERROR'
		});
	}
});

router.get('/issues', async (req, resp) => {
	try {
		const query = getIssueQuery();
		query.unshift(
			// exclude ones that are deleted
			{ $match: { deleted: false } }
		);
		const issues = await Issue.aggregate(query)
			.sort({ createdTimestamp: -1 })
			.exec();

		resp.json(issues);
	} catch (error) {
		// TODO log error
		resp.status(500).json({
			error: 'INTERNAL_ERROR'
		});
	}
});

router.post('/save-issue', ensureAuthenticated, async (req, resp) => {
	const { _id, title, content, status: statusId } = req.body;

	try {
		const statusCollection = _id
			? await Status.find({
					// when we update document
					_id: statusId
			  }).exec()
			: await Status.find() // when we create document set minimum status at the begin
					.sort({ priority: 1 })
					.limit(1)
					.exec();

		const status = statusCollection[0];

		if (status == null) {
			resp.status(400).json({
				error: 'STATUS_NOT_FOUND'
			});
			return;
		}

		const issue = new Issue({
			_id: _id || new ObjectID(),
			title,
			content,
			status: status._id,
			reportedBy: req.user._id // TODO security risk on update?
		});

		await Issue.updateOne({ _id: issue._id }, issue, {
			upsert: true
		});

		const query = getIssueQuery();
		query.unshift(
			// exclude ones that are deleted
			{ $match: { _id: issue._id } }
		);
		const issues = await Issue.aggregate(query).exec();

		resp.json(issues[0]);
	} catch (error) {
		// TODO log error
		resp.status(500).json({
			error: 'INTERNAL_ERROR'
		});
	}
});

module.exports = router;
