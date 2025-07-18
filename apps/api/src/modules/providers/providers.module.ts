import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provider } from '../shared/entities/providers.entity';
import { User } from '../shared/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Provider, User])],
  providers: [],
  controllers: [],
  exports: [],
})
export class ProvidersModule {}
