import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import bcrypt from 'bcrypt';
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


export const getUsers = async () => {
    const users = await prisma.user.findMany();
    return users;
}