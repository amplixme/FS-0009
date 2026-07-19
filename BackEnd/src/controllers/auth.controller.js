import { registerUser, loginUser } from '../services/auth.service.js';

export const register = async (req, res, next) => {
    try {
        await registerUser(req.body);

        return res.status(201).json({
            message: 'Usuario registrado exitosamente'
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const result = await loginUser(req.body);

        return res.status(200).json({
            token: result.token,
            user: result.user
        });
    } catch (error) {
        next(error);
    }
};