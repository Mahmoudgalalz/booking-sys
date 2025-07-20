import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../repositories/user.repository';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/users.entity';
import { RegisterValidation } from '../auth/validation/register.validation';
import { LoginValidation } from './validation/login.validation';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(data: RegisterValidation): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = this.userRepository.create({
        ...data,
        password: hashedPassword,
      });
      return this.userRepository.save(user);
    } catch (error) {
      throw new HttpException(
        'Error while sign up user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getProfile(id: number) {
    return this.userRepository.findOne({ where: { id }, relations: ['provider'] });
  }

  async login(data: LoginValidation) {
    const loggedInUser = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if(!loggedInUser) {
      throw new UnauthorizedException('User not found');
    }
    const payload = {
      email: loggedInUser.email,
      userId: loggedInUser.id,
      role: loggedInUser.role
    };
    return {
      user: loggedInUser,
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.expiresIn'),
      }),
      role: loggedInUser.role,
    };
  }
}
