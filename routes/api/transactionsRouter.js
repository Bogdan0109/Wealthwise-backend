const express = require('express');
const router = express.Router();
const {
  validation,
  controllerWrapper,
  isValidId,
  authMiddleware,
} = require('../../middlewares');
const { transactionsControllers: ctrl } = require('../../controllers');
const {
  transactionJoiSchemaPost,
} = require('../../models/transactionModel.js');
const validateMiddlewarePost = validation(transactionJoiSchemaPost);

//! 1. Receiving ALL USER TRANSACTIONS
router.get('/', authMiddleware, controllerWrapper(ctrl.getAllTransactions));

//! 2. Creating a NEW TRANSACTION Expenses or INCOME
router.post(
  '/',
  authMiddleware,
  validateMiddlewarePost,
  controllerWrapper(ctrl.addTransaction)
);

//! 3. Deleting ONE TRANSACTION Expenses or INCOME by id
router.delete(
  '/:transactionId',
  authMiddleware,
  isValidId,
  controllerWrapper(ctrl.removeTransaction)
);

//! 4. Receiving ALL TRANSACTIONS ON THE REPORT PAGE
router.get(
  '/report',
  authMiddleware,
  controllerWrapper(ctrl.getAllTransactionsReport)
);

module.exports = router;
