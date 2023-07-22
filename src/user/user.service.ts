import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { compare, hash } from 'bcryptjs';
import { v4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userRepository: typeof User,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    try {
      const { login, password } = loginUserDto;
      const userByLogin = await this.getUserByLogin(login);
      if (!userByLogin) {
        throw new UnauthorizedException('Login or password is wrong');
      }
      const isMatchPass = await compare(password, userByLogin.hashed_password);
      if (!isMatchPass) {
        throw new UnauthorizedException('Login or password is wrong');
      }
      const token = await this.getToken(userByLogin);
      const user = await this.getOne(userByLogin.id);
      const response = {
        token,
        user,
      };
      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const userByLogin = await this.getUserByLogin(createUserDto.login);
      if (userByLogin) {
        throw new BadRequestException('Login already registered!');
      }
      const hashed_password = await hash(createUserDto.password, 7);
      const newUser = await this.userRepository.create({
        id: v4(),
        ...createUserDto,
        hashed_password,
      });
      return this.getOne(newUser.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      return this.userRepository.findAll({
        attributes: ['id', 'full_name', 'login'],
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      return this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.getOne(id);
      if (updateUserDto.login) {
        const userByLogin = await this.getUserByLogin(updateUserDto.login);
        if (userByLogin && userByLogin.id != id) {
          throw new BadRequestException('Login already registered!');
        }
      }
      if (updateUserDto.password) {
        const hashed_password = await hash(updateUserDto.password, 7);
        await this.userRepository.update(
          { hashed_password },
          { where: { id } },
        );
      }
      await this.userRepository.update(updateUserDto, {
        where: { id },
      });
      return this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const user = await this.getOne(id);
      await this.userRepository.destroy({ where: { id } });
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOne(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        attributes: ['id', 'full_name', 'login'],
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUserByLogin(login: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { login },
        attributes: ['id', 'full_name', 'login', 'hashed_password'],
      });
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getToken(user: User) {
    try {
      const jwtPayload = {
        id: user.id,
        login: user.login,
      };
      const token = await this.jwtService.signAsync(jwtPayload, {
        secret: process.env.TOKEN_KEY,
        expiresIn: process.env.TOKEN_TIME,
      });
      return token;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
