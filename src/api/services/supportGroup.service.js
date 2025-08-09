const SupportGroup = require('../models/supportGroup.model');

/**
 * @class SupportGroupService
 * @description Handles support group management logic.
 */
class SupportGroupService {
  /**
   * @description Create a new support group
   * @param {object} groupData - The data for the new group
   * @returns {Promise<object>} The created group
   */
  async createSupportGroup(groupData) {
    const group = await SupportGroup.create(groupData);
    return group;
  }

  /**
   * @description Get all support groups
   * @returns {Promise<object[]>} A list of all support groups
   */
  async getSupportGroups() {
    const groups = await SupportGroup.find().populate('supervisor', 'name email').populate('members', 'name email');
    return groups;
  }

  /**
   * @description Get a single support group by its ID
   * @param {string} groupId - The ID of the group to retrieve
   * @returns {Promise<object>} The group object
   */
  async getSupportGroupById(groupId) {
    const group = await SupportGroup.findById(groupId).populate('supervisor', 'name email').populate('members', 'name email');
    if (!group) {
      throw new Error('Support group not found.');
    }
    return group;
  }

  /**
   * @description Updates a support group
   * @param {string} groupId - The ID of the group to update
   * @param {object} updateData - The data to update
   * @returns {Promise<object>} The updated group object
   */
  async updateSupportGroup(groupId, updateData) {
    const group = await SupportGroup.findByIdAndUpdate(groupId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!group) {
      throw new Error('Support group not found.');
    }
    return group;
  }

  /**
   * @description Deletes a support group
   * @param {string} groupId - The ID of the group to delete
   * @returns {Promise<object>}
   */
  async deleteSupportGroup(groupId) {
    const group = await SupportGroup.findByIdAndDelete(groupId);
    if (!group) {
      throw new Error('Support group not found.');
    }
    return group;
  }

  /**
   * @description Add a member to a support group
   * @param {string} groupId - The ID of the group
   * @param {string} userId - The ID of the user to add
   * @returns {Promise<object>} The updated group object
   */
  async addMemberToSupportGroup(groupId, userId) {
    const group = await SupportGroup.findById(groupId);
    if (!group) {
      throw new Error('Support group not found.');
    }
    if (group.members.includes(userId)) {
      throw new Error('User is already a member of this group.');
    }
    group.members.push(userId);
    await group.save();
    return group;
  }

  /**
   * @description Remove a member from a support group
   * @param {string} groupId - The ID of the group
   * @param {string} userId - The ID of the user to remove
   * @returns {Promise<object>} The updated group object
   */
  async removeMemberFromSupportGroup(groupId, userId) {
    const group = await SupportGroup.findById(groupId);
    if (!group) {
      throw new Error('Support group not found.');
    }
    if (!group.members.includes(userId)) {
      throw new Error('User is not a member of this group.');
    }
    group.members.pull(userId);
    await group.save();
    return group;
  }
}

module.exports = new SupportGroupService();
