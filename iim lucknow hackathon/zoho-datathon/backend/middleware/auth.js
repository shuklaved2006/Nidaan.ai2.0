const catalyst = require('zcatalyst-sdk-node');

/**
 * Role-Based Authentication Middleware
 * 
 * Supported roles:
 * - 'Command Centre'
 * - 'Investigation Officer'
 * - 'Station Administrator'
 * - 'System Administrator'
 * 
 * Checks for roles in the following order:
 * 1. Custom 'x-user-role' header (useful for development, API testing, and simulator)
 * 2. Zoho Catalyst SDK user session role (production)
 */
function authorize(allowedRoles = []) {
  return async (req, res, next) => {
    try {
      // Use Zoho Catalyst SDK for authentication
      const catalystApp = res.locals.catalyst || catalyst.initialize(req);
      const currentUser = await catalystApp.userManagement().getCurrentUser();
      
      if (currentUser && currentUser.roleDetails) {
        userRole = currentUser.roleDetails.roleName;
        userDetails = currentUser;
      } else {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required. No user session found.'
        });
      }

      // Check if user's role is in the list of allowed roles
      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return res.status(403).json({
          status: 'error',
          message: `Forbidden. Role '${userRole}' does not have access to this resource. Required roles: ${allowedRoles.join(', ')}`
        });
      }

      // Attach user details to request object for downstream controllers
      req.user = {
        role: userRole,
        details: userDetails
      };

      next();
    } catch (error) {
      console.error('Authorization middleware error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error during authorization verification.'
      });
    }
  };
}

module.exports = {
  authorize,
  ROLES: {
    COMMAND_CENTRE: 'Command Centre',
    INVESTIGATION_OFFICER: 'Investigation Officer',
    STATION_ADMIN: 'Station Administrator',
    SYSTEM_ADMIN: 'System Administrator'
  }
};
