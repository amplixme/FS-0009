import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export const registerUser = async (userData) => {

    //Encripto la contraseña enviada
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    try {
        // Creo el usuario con la contraseña encriptada
        const newUser = await prisma.user.create({
            data: {
                ...userData,
                password: hashedPassword,
                role: 'USER'
            },
        });
        return newUser;
    } catch (error) {
        if (error.code === 'P2002') {
            error.meta = {
                target: 'email'
            };
        }
        throw error;
    }
};

export const loginUser = async ({ email, password }) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        const error = new Error('Credenciales inválidas');
        error.status = 401;
        throw error;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        const error = new Error('Credenciales inválidas');
        error.status = 401;
        throw error;
    }

    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name
        }
    };
}