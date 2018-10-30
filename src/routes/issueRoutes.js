const express = require('express');
const ObjectID = require('mongodb').ObjectID;

const router = express.Router();
const Issue = require('../model/Issue');
const Status = require('../model/Status');
const { ensureAuthenticated, ensureIsAdmin } = require('./middlewares');

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
		const issues = await Issue.aggregate([
			// exclude ones that are deleted
			{ $match: { deleted: false } },
			// "merge" with status collection
			{
				$lookup: {
					from: 'status',
					localField: 'status',
					foreignField: '_id',
					as: 'status'
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
					'reportedBy.lastName': 1
				}
			}
		])
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
			reportedBy: req.user._id
		});

		await Issue.updateOne({ _id: issue._id }, issue, {
			upsert: true
		});

		resp.json(issue);
	} catch (error) {
		// TODO log error
		resp.status(500).json({
			error: 'INTERNAL_ERROR'
		});
	}
});

module.exports = router;
