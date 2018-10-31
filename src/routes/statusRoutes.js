const express = require('express');
const ObjectID = require('mongodb').ObjectID;
const { check, validationResult } = require('express-validator/check');

const { ensureIsAdmin } = require('./middlewares');

const router = express.Router();
const Status = require('../model/Status');

const getQuery = () => [
	{
		$lookup: {
			from: 'users',
			localField: 'createdBy',
			foreignField: '_id',
			as: 'createdBy'
		}
	},
	{
		$project: {
			priority: 1,
			name: 1,
			_id: 1,
			createdBy: {
				$arrayElemAt: ['$createdBy', 0]
			}
		}
	},
	{
		$project: {
			priority: 1,
			name: 1,
			_id: 1,
			'createdBy.username': 1,
			'createdBy.firstName': 1,
			'createdBy.lastName': 1,
			'createdBy._id': 1
		}
	},
	{
		$sort: { priority: 1 }
	}
];

router.get('/status', async (req, resp) => {
	try {
		const statusData = await Status.aggregate(getQuery()).exec();

		resp.json(statusData);
	} catch (err) {
		resp.status(500).json({
			error: 'INTERNAL_ERROR'
		});
	}
});

router.post(
	'/save-status',
	ensureIsAdmin,
	[
		check('name')
			.isLength({ min: 1 })
			.isString(),
		check('priority').isAlphanumeric()
	],
	async (req, resp) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return resp.status(422).json({ errors: errors.array() });
		}

		const { _id, name, priority } = req.body;
		const query = getQuery();
		try {
			if (_id) {
				await Status.findOneAndUpdate(
					{ _id },
					{
						name,
						priority
					}
				);
				query.unshift({ $match: { _id: ObjectID(_id) } });
			} else {
				const existingStatus = await Status.findOne({ name });
				if (existingStatus != null) {
					return resp.status(400).json({
						error: 'STATUS_EXITS'
					});
				}

				const status = new Status({
					_id: new ObjectID(),
					name,
					priority,
					createdBy: req.user._id
				});
				await status.save();

				query.unshift({ $match: { _id: status._id } });
			}

			const savedStatus = await Status.aggregate(query).exec();

			resp.json(savedStatus[0]);
		} catch (error) {
			// TODO log error
			resp.status(500).json({
				error: 'INTERNAL_ERROR'
			});
		}
	}
);

router.delete(
	'/delete-status',
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
			const result = await Status.aggregate([
				{ $match: { _id: ObjectID(id) } },
				{
					$lookup: {
						from: 'issues',
						localField: '_id',
						foreignField: 'status',
						as: 'statusInUse'
					}
				},
				{
					$project: {
						_id: 0,
						statusInUseNumber: {
							$size: '$statusInUse'
						}
					}
				}
			]).exec();

			if (result[0].statusInUseNumber > 0) {
				resp.status(403).json({
					error: 'IS_ATTACHED_TO_ISSUES'
				});
				return;
			}

			// do a hard delete only
			await Status.deleteOne({ _id: id });

			resp.status(204).send();
		} catch (error) {
			// TODO log error
			resp.status(500).json({
				error: 'INTERNAL_ERROR'
			});
		}
	}
);

module.exports = router;
