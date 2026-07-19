
const requireRole = (...roles) => {
    return (req, res, next) => {

        if (!req.user || !req.user.role) {
            return res.status(403).json({
                error: {
                    message: "No tienes permisos para realizar esta acción"
                }
            });
        }

        const rolUpper = req.user.role.toUpperCase();

        const allowedRolesUpper = roles.map(role => role.toUpperCase());

        if (!allowedRolesUpper.includes(rolUpper)) {
            return res.status(403).json({
                error: {
                    message: "No tienes permisos para esta acción"
                }
            });
        }

        next();
    };
};

export default requireRole;