const TeamService = require('../services/team.service');

/**
 * @class TeamController
 * @description Controller for team management operations
 */
class TeamController {
  async createTeam(req, res, next) {
    try {
      const team = await TeamService.createTeam(req.body);
      res.status(201).json({ success: true, data: team });
    } catch (error) {
      next(error);
    }
  }

  async getTeams(req, res, next) {
    try {
      const teams = await TeamService.getTeams();
      res.status(200).json({ success: true, data: teams });
    } catch (error) {
      next(error);
    }
  }

  async getTeamById(req, res, next) {
    try {
      const { id } = req.params;
      const team = await TeamService.getTeamById(id);
      res.status(200).json({ success: true, data: team });
    } catch (error) {
      next(error);
    }
  }

  async updateTeam(req, res, next) {
    try {
      const { id } = req.params;
      const team = await TeamService.updateTeam(id, req.body);
      res.status(200).json({ success: true, data: team });
    } catch (error) {
      next(error);
    }
  }

  async deleteTeam(req, res, next) {
    try {
      const { id } = req.params;
      await TeamService.deleteTeam(id);
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      next(error);
    }
  }

  async addMemberToTeam(req, res, next) {
    try {
      const { id, userId } = req.params;
      const team = await TeamService.addMemberToTeam(id, userId);
      res.status(200).json({ success: true, data: team });
    } catch (error) {
      next(error);
    }
  }

  async removeMemberFromTeam(req, res, next) {
    try {
      const { id, userId } = req.params;
      const team = await TeamService.removeMemberFromTeam(id, userId);
      res.status(200).json({ success: true, data: team });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TeamController();
