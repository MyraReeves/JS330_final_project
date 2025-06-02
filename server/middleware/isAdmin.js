const isAdmin = (req, res, next) => {
    // Troubleshooting code to check that the middleware received the correct info from the decoded token:
    console.log("🛡️ Checking the admin role for:", req.user);

    // Before granting access, check who the user is, their role, and that their role includes "admin":
    if (req.user && req.user.roles && req.user.roles.includes("admin")) {
      return next();
    }
    // If they are not an Admin, return a 403 "Forbidden" error:
    return res.sendStatus(403);
  };
  
  module.exports = isAdmin;