import dotenv from 'dotenv';
import { Router } from 'express';
import { PrismaPg } from "@prisma/adapter-pg";
import { validate } from '../middlewares/validate.middleware.js';
import { registerSchema } from '../schema/auth.schema.js';
import { PrismaClient } from "../generated/prisma/client.js";
import {register,getUser} from '../controllers/auth.controller.js';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const router = Router();

router.post('/auth/register', validate(registerSchema),register) //crea el usuario

export default router;