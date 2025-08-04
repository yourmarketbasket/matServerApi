const QueueService = require('../services/queue.service');

/**
 * @class QueueController
 * @description Controller for queue management
 */
class QueueController {
  async getQueues(req, res, next) {
    try {
      const { routeId } = req.params;
      const result = await QueueService.getQueueByRoute(routeId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async createQueue(req, res, next) {
    try {
      const { tripId } = req.body;
      const result = await QueueService.addTripToQueue(tripId, req.io);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async deleteQueue(req, res, next) {
    try {
      const { id } = req.params;
      await QueueService.removeTripFromQueue(id, req.io);
      res.status(200).json({ success: true, message: 'Queue entry deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new QueueController();
