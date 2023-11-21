import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {User} from './models/user.entity';
import * as bcrypt from 'bcryptjs'; 
import { hash } from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: Partial<User>): Promise<User> {
    const { password, ...userData } = user; // Extraia a senha do restante dos dados do usuário
  
    // Hash da senha antes de armazená-la no banco de dados
    const hashedPassword = await hash(password, 10); // O segundo argumento é o número de salt rounds
  
    const newUser = this.userRepository.create({
      ...userData,
      password: hashedPassword, // Use a senha hash no lugar da senha original
      id: uuidv4(), // Gere um novo UUID e atribua-o à propriedade id
    });
  
    return this.userRepository.save(newUser);
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    await this.userRepository.update(id, user);
    return this.userRepository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }


  async authenticateUser(email: string, password: string): Promise<User | null> {
    try {
      // Encontre o usuário pelo email fornecido
      const user = await this.userRepository.findOne({ where: { email } });
  
      if (!user) {
        // Se o usuário não existir, retorne null (usuário não encontrado)
        return null;
      }
  
      // Compare a senha fornecida com o hash de senha armazenado no banco de dados usando compareSync
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      console.log(password, user.password)
      if (!isPasswordValid) {
        // Se a senha não for válida, retorne null (autenticação falhou)
        return null;
      }
  
      // Se as credenciais estiverem corretas, retorne o usuário autenticado
      return user;
    } catch (error) {
      // Lidar com erros, como problemas de conexão com o banco de dados
      console.error('Erro durante a autenticação do usuário:', error);
      throw new Error('Erro durante a autenticação do usuário');
    }
  }


  async login(email: string, password: string): Promise<{token: string; name: string, id: string}> {
    try {
      // Encontre o usuário pelo email fornecido
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      // Compare a senha fornecida com o hash de senha armazenado no banco de dados
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      console.log(password, user.password)
      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      // Se as credenciais estiverem corretas, gera um token JWT
      const payload = { email: user.email, sub: user.id };
      const token = jwt.sign(payload, 'seu_segredo_secreto', { expiresIn: '1h' });
      const name = user.name;

      return { token, name, id: user.id};
    } catch (error) {
      console.error('Erro durante a autenticação do usuário:', error);
      throw new Error('Erro durante a autenticação do usuário');
    }
  } 
}

