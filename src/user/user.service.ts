import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { compare, hash } from 'bcryptjs';
import { v4 } from 'uuid';
import { Blog } from '../blog/models/blog.model';
import { Follow } from '../follow/models/follow.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userRepository: typeof User,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    try {
      const { username, password } = loginUserDto;
      const userByUsername = await this.getUserByUsername(username);
      if (!userByUsername) {
        throw new UnauthorizedException('Username or password is wrong');
      }
      const isMatchPass = await compare(
        password,
        userByUsername.hashed_password,
      );
      if (!isMatchPass) {
        throw new UnauthorizedException('Username or password is wrong');
      }
      const token = await this.getToken(userByUsername);
      const user = await this.getOne(userByUsername.id);
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
      const userByUsername = await this.getUserByUsername(
        createUserDto.username,
      );
      if (userByUsername) {
        throw new BadRequestException('Username already registered!');
      }
      // const userByEmail = await this.getUserByEmail(createUserDto.email);
      // if (userByEmail) {
      //   throw new BadRequestException('Email already registered!');
      // }
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
        attributes: ['id', 'full_name', 'username'],
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
      if (updateUserDto.username) {
        const userByUsername = await this.getUserByUsername(
          updateUserDto.username,
        );
        if (userByUsername && userByUsername.id != id) {
          throw new BadRequestException('Username already registered!');
        }
      }
      // if (updateUserDto.email) {
      //   const userByEmail = await this.getUserByEmail(updateUserDto.email);
      //   if (userByEmail && userByEmail.id != id) {
      //     throw new BadRequestException('Email already registered!');
      //   }
      // }
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
        attributes: ['id', 'full_name', 'username'],
        include: [
          {
            model: Blog,
            attributes: ['id', 'title', 'body', 'views', 'createdAt'],
          },
          {
            model: Follow,
            as: 'followers',
            attributes: ['id'],
            include: [
              {
                model: User,
                as: 'follower',
                attributes: ['id', 'full_name', 'username'],
              },
            ],
          },
          {
            model: Follow,
            as: 'followings',
            attributes: ['id'],
            include: [
              {
                model: User,
                as: 'following',
                attributes: ['id', 'full_name', 'username'],
              },
            ],
          },
        ],
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUserByUsername(username: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { username },
        attributes: ['id', 'full_name', 'username', 'hashed_password'],
      });
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // async getUserByEmail(email: string) {
  //   try {
  //     const user = await this.userRepository.findOne({
  //       where: { email },
  //       attributes: ['id', 'full_name', 'username', 'email', 'hashed_password'],
  //     });
  //     return user;
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }

  async getToken(user: User) {
    try {
      const jwtPayload = {
        id: user.id,
        username: user.username,
        // email: user.email,
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
