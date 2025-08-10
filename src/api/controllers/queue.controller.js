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
}

module.exports = new QueueController();
