import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../shared/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [],
  controllers: [],
  exports: [],
})
export class UsersModule {}
