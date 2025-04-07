import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const token = this.generateToken(user._id as string, user.email);
    return { user, token };
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.usersService.findByEmail(email);
    const isPwValid = await this.validatePassword(password, user.password);

    if (!isPwValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user._id as string, user.email);
    return { user, token };
  }

  async validateUser(userId: string) {
    return this.usersService.findById(userId);
  }

  private async validatePassword(
    providedPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(providedPassword, storedPassword);
  }

  private generateToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }
}
