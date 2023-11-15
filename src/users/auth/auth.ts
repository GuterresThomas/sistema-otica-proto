import bcrypt from 'bcryptjs';
import { User } from '../models/user.entity';
import {UsersService } from '../users.service';


// Este seria um método de autenticação que recebe um email e uma senha e verifica se correspondem aos registros no banco de dados
