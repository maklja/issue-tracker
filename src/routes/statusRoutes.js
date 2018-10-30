const express = require('express');

const router = express.Router();
const Status = require('../model/Status');

router.get('/status', (req, resp) => {
	Status.find(
		{},
		{
			// do projection to extract only specific properties
			priority: 1,
			name: 1,
			_id: 1
		}
	)
		.sort({ priority: 1 }) // sort by priority
		.exec((err, data) => {
			if (err) {
				resp.status(500).json({
					error: 'INTERNAL_ERROR'
				});
				return;
			}

			resp.json(data);
		});
});

module.exports = router;
