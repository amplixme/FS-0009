
const requireRole = (...roles) => {
    return (req, res, next) => {
        const rolUpper = req.user.role.toUpperCase();

        if (!req.user || roles.includes(rolUpper)) {
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