const BusOperator = require('../models/busOperator.model');

/**
 * @class BusOperatorService
 * @description Handles bus operator management logic.
 */
class BusOperatorService {
  /**
   * @description Register a new bus operator
   * @param {object} operatorData - The data for the new operator
   * @returns {Promise<object>} The created operator
   */
  async registerOperator(operatorData) {
    const operator = await BusOperator.create(operatorData);
    return operator;
  }

  /**
   * @description Get all bus operators
   * @returns {Promise<object[]>} A list of all operators
   */
  async getOperators() {
    const operators = await BusOperator.find().populate('createdBy', 'name email');
    return operators;
  }

  /**
   * @description Get a single bus operator by its ID
   * @param {string} operatorId - The ID of the operator to retrieve
   * @returns {Promise<object>} The operator object
   */
  async getOperatorById(operatorId) {
    const operator = await BusOperator.findById(operatorId).populate('createdBy', 'name email');
    if (!operator) {
      throw new Error('Bus operator not found.');
    }
    return operator;
  }

  /**
   * @description Updates a bus operator's status
   * @param {string} operatorId - The ID of the operator to update
   * @param {string} status - The new status
   * @returns {Promise<object>} The updated operator object
   */
  async updateOperatorStatus(operatorId, status) {
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status provided.');
    }
    const operator = await BusOperator.findByIdAndUpdate(
      operatorId,
      { status },
      { new: true, runValidators: true }
    );
    if (!operator) {
      throw new Error('Bus operator not found.');
    }
    return operator;
  }

  /**
   * @description Updates a bus operator
   * @param {string} operatorId - The ID of the operator to update
   * @param {object} updateData - The data to update
   * @returns {Promise<object>} The updated operator object
   */
  async updateOperator(operatorId, updateData) {
    const operator = await BusOperator.findByIdAndUpdate(operatorId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!operator) {
      throw new Error('Bus operator not found.');
    }
    return operator;
  }

  /**
   * @description Deletes a bus operator
   * @param {string} operatorId - The ID of the operator to delete
   * @returns {Promise<object>}
   */
  async deleteOperator(operatorId) {
    const operator = await BusOperator.findByIdAndDelete(operatorId);
    if (!operator) {
      throw new Error('Bus operator not found.');
    }
    return operator;
  }
}

module.exports = new BusOperatorService();
