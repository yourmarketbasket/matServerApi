const Team = require('../models/team.model');

/**
 * @class TeamService
 * @description Handles team management logic.
 */
class TeamService {
  /**
   * @description Create a new team
   * @param {object} teamData - The data for the new team
   * @returns {Promise<object>} The created team
   */
  async createTeam(teamData) {
    const team = await Team.create(teamData);
    return team;
  }

  /**
   * @description Get all teams
   * @returns {Promise<object[]>} A list of all teams
   */
  async getTeams() {
    const teams = await Team.find().populate('teamLead', 'name email').populate('members', 'name email');
    return teams;
  }

  /**
   * @description Get a single team by its ID
   * @param {string} teamId - The ID of the team to retrieve
   * @returns {Promise<object>} The team object
   */
  async getTeamById(teamId) {
    const team = await Team.findById(teamId).populate('teamLead', 'name email').populate('members', 'name email');
    if (!team) {
      throw new Error('Team not found.');
    }
    return team;
  }

  /**
   * @description Updates a team
   * @param {string} teamId - The ID of the team to update
   * @param {object} updateData - The data to update
   * @returns {Promise<object>} The updated team object
   */
  async updateTeam(teamId, updateData) {
    const team = await Team.findByIdAndUpdate(teamId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!team) {
      throw new Error('Team not found.');
    }
    return team;
  }

  /**
   * @description Deletes a team
   * @param {string} teamId - The ID of the team to delete
   * @returns {Promise<object>}
   */
  async deleteTeam(teamId) {
    const team = await Team.findByIdAndDelete(teamId);
    if (!team) {
      throw new Error('Team not found.');
    }
    return team;
  }

  /**
   * @description Add a member to a team
   * @param {string} teamId - The ID of the team
   * @param {string} userId - The ID of the user to add
   * @returns {Promise<object>} The updated team object
   */
  async addMemberToTeam(teamId, userId) {
    const team = await Team.findById(teamId);
    if (!team) {
      throw new Error('Team not found.');
    }
    if (team.members.includes(userId)) {
      throw new Error('User is already a member of this team.');
    }
    team.members.push(userId);
    await team.save();
    return team;
  }

  /**
   * @description Remove a member from a team
   * @param {string} teamId - The ID of the team
   * @param {string} userId - The ID of the user to remove
   * @returns {Promise<object>} The updated team object
   */
  async removeMemberFromTeam(teamId, userId) {
    const team = await Team.findById(teamId);
    if (!team) {
      throw new Error('Team not found.');
    }
    if (!team.members.includes(userId)) {
      throw new Error('User is not a member of this team.');
    }
    team.members.pull(userId);
    await team.save();
    return team;
  }
}

module.exports = new TeamService();
