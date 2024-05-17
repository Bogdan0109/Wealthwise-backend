const express = require('express');
const router = express.Router();
const {
  validation,
  controllerWrapper,
  authMiddleware,
  uploadMiddleware,
  resizeXandYbyJimpMiddleware,
  passport,
} = require('../../middlewares');
const { authControllers: ctrl } = require('../../controllers');
const {
  registerJoiSchema,
  loginJoiSchema,
} = require('../../models/userModel.js');
const validateMiddlewareRegister = validation(registerJoiSchema);
const validateMiddlewarelogin = validation(loginJoiSchema);

//! 0. Google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  controllerWrapper(ctrl.googleAuth)
);

//! 1. Registration
router.post(
  '/signup',
  validateMiddlewareRegister,
  controllerWrapper(ctrl.registrationController)
);

//! 2. Login
router.post(
  '/login',
  validateMiddlewarelogin,
  controllerWrapper(ctrl.loginController)
);

//! 3. Logout
router.get('/logout', authMiddleware, controllerWrapper(ctrl.logoutController));

//! 4. Current user
router.get(
  '/current',
  authMiddleware,
  controllerWrapper(ctrl.getCurrentController)
);

//! 5. Avatar update (avatarURL)
router.patch(
  '/avatars',
  authMiddleware,
  uploadMiddleware.single('avatar'),
  resizeXandYbyJimpMiddleware,
  controllerWrapper(ctrl.updateAvatar)
);

//! 6. GET user balance
router.get('/balance', authMiddleware, controllerWrapper(ctrl.getBalance));

//! 7. CHANGE user balance
router.patch('/balance', authMiddleware, controllerWrapper(ctrl.updateBalance));

//! 8. CHANGE user status --> user.isNewUser: false (if balanceNew === 0)
router.patch(
  '/isnotnewuser',
  authMiddleware,
  controllerWrapper(ctrl.changeIsNotNewUser)
);

module.exports = router;
