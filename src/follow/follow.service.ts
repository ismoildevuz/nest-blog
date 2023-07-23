import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { Follow } from './models/follow.model';
import { InjectModel } from '@nestjs/sequelize';
import { UserService } from '../user/user.service';
import { v4 } from 'uuid';
import { User } from '../user/models/user.model';
import { Op } from 'sequelize';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(Follow)
    private readonly followRepository: typeof Follow,
    private readonly userService: UserService,
  ) {}

  async create(createFollowDto: CreateFollowDto, authHeader: string) {
    const user = await this.userService.verifyToken(authHeader);

    try {
      const { following_id } = createFollowDto;
      await this.userService.getOne(following_id);
      const follow = await this.checkFollow(user.id, following_id);
      if (follow) {
        await this.followRepository.destroy({ where: { id: follow.id } });
        return { message: 'Unfollowed' };
      } else {
        await this.followRepository.create({
          id: v4(),
          ...createFollowDto,
          follower_id: user.id,
        });
        return { message: 'Followed' };
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(authHeader: string) {
    const user = await this.userService.verifyToken(authHeader);

    try {
      return this.followRepository.findAll({
        where: {
          [Op.or]: [{ follower_id: user.id }, { following_id: user.id }],
        },
        attributes: ['id'],
        include: [
          {
            model: User,
            as: 'follower',
            attributes: ['id', 'full_name', 'username'],
          },
          {
            model: User,
            as: 'following',
            attributes: ['id', 'full_name', 'username'],
          },
        ],
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string, authHeader: string) {
    await this.userService.verifyToken(authHeader);

    try {
      return this.getOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOne(id: string) {
    try {
      const follow = await this.followRepository.findOne({
        where: { id },
        attributes: ['id'],
        include: [
          {
            model: User,
            as: 'follower',
            attributes: ['id', 'full_name', 'username'],
          },
          {
            model: User,
            as: 'following',
            attributes: ['id', 'full_name', 'username'],
          },
        ],
      });
      if (!follow) {
        throw new HttpException('Follow not found', HttpStatus.NOT_FOUND);
      }
      return follow;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async checkFollow(follower_id: string, following_id: string) {
    try {
      const follow = await this.followRepository.findOne({
        where: { follower_id, following_id },
        attributes: ['id', 'follower_id', 'following_id'],
      });
      return follow;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
