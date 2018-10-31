const express = require('express');
const ObjectID = require('mongodb').ObjectID;
const { check, validationResult } = require('express-validator/check');

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

router.post(
	'/issue/assign',
	ensureAuthenticated,
	[
		check('id')
			.exists()
			.isString()
	],
	async (req, resp) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return resp.status(422).json({ errors: errors.array() });
		}

		const { id } = req.body;

		try {
			await Issue.updateOne(
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
	}
);

router.delete(
	'/issue',
	ensureIsAdmin,
	[
		check('id')
			.exists()
			.isString()
	],
	async (req, resp) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return resp.status(422).json({ errors: errors.array() });
		}

		const { id } = req.body;

		try {
			// do a hard delete only
			await Issue.deleteOne({ _id: ObjectID(id) });

			resp.status(204).send();
		} catch (error) {
			// TODO log error
			resp.status(500).json({
				error: 'INTERNAL_ERROR'
			});
		}
	}
);

router.post(
	'/issue/archive',
	ensureAuthenticated,
	[
		check('id')
			.exists()
			.isString()
	],
	async (req, resp) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return resp.status(422).json({ errors: errors.array() });
		}

		const { id } = req.body;

		try {
			// do a soft delete only
			await Issue.updateOne(
				{ _id: Object(id) },
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
	}
);

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

router.post(
	'/save-issue',
	ensureAuthenticated,
	[
		check('title')
			.isLength({ min: 1 })
			.isString(),
		check('content')
			.isLength({ min: 1 })
			.isString(),
		check('statusId')
			.optional()
			.isString()
	],
	async (req, resp) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return resp.status(422).json({ errors: errors.array() });
		}

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

			const query = getIssueQuery();
			if (_id) {
				await Issue.findOneAndUpdate(
					{ _id },
					{
						title,
						content,
						status: status._id
					}
				);
				query.unshift({ $match: { _id: ObjectID(_id) } });
			} else {
				const issue = new Issue({
					_id: new ObjectID(),
					title,
					content,
					status: status._id,
					reportedBy: req.user._id
				});
				await issue.save();

				query.unshift({ $match: { _id: issue._id } });
			}

			const issues = await Issue.aggregate(query).exec();

			resp.json(issues[0]);
		} catch (error) {
			// TODO log error
			resp.status(500).json({
				error: 'INTERNAL_ERROR'
			});
		}
	}
);

module.exports = router;
