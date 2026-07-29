import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PbbModule } from './pbb/pbb.module';
import { DatabaseModule } from './database/database.module';
import { TilesModule } from './tiles/tiles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    PbbModule,
    TilesModule,
  ],
})
export class AppModule {}
