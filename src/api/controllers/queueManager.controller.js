const QueueService = require('../services/queue.service');

/**
 * @class QueueManagerController
 * @description Controller for QueueManager-specific actions
 */
class QueueManagerController {
  async addTripToQueue(req, res, next) {
    try {
      const { tripId } = req.body;
      // We could add validation here to ensure the queue manager is allowed to manage this trip's queue
      const result = await QueueService.addTripToQueue(tripId, req.io);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async removeTripFromQueue(req, res, next) {
    try {
      const { id } = req.params; // This would be the queue entry ID
      await QueueService.removeTripFromQueue(id, req.io);
      res.status(200).json({ success: true, message: 'Queue entry deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new QueueManagerController();
