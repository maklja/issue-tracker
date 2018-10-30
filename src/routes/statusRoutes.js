const express = require('express');

const router = express.Router();
const Status = require('../model/Status');

router.get('/status', async (req, resp) => {
	try {
		const statusData = await Status.find(
			{},
			{
				// do projection to extract only specific properties
				priority: 1,
				name: 1,
				_id: 1
			}
		)
			.sort({ priority: 1 }) // sort by priority
			.exec();

		resp.json(statusData);
	} catch (err) {
		resp.status(500).json({
			error: 'INTERNAL_ERROR'
		});
	}
});

module.exports = router;
