import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers['authorization'];

    //Verifico si el header existe y si empieza con 'Bearer ', sino doy mensaje de error No Autorizado
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: { message: 'No autorizado' }
        });
    }

    //Extraigo el token del header
    const token = authHeader.split(' ')[1];

    try {
        const userVerify = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: userVerify.id,
            email: userVerify.email,
            name: userVerify.name
        };

        next();

    } catch (error) {

        //Manejo de error si el token expiró
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: { message: 'Token expirado' }
            });
        }

        //Cualquier otro error excepto token expirado que está controlado arriba
        return res.status(401).json({
            error: { message: 'No autorizado' }
        });

    }
}

export default authMiddleware;