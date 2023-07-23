import { Module, forwardRef } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Follow } from './models/follow.model';
import { UserModule } from '../user/user.module';

@Module({
  imports: [SequelizeModule.forFeature([Follow]), forwardRef(() => UserModule)],
  controllers: [FollowController],
  providers: [FollowService],
  exports: [FollowService],
})
export class FollowModule {}
