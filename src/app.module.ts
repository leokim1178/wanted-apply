import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruitModule } from './apis/recruit/recruit.module';

@Module({
  imports: [
    RecruitModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'wanted-database',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'wanted-database',
      entities: [__dirname + '/apis/**/**/*.entity.*'],
      synchronize: true,
      logging: true,
      retryAttempts: 30,
      retryDelay: 5000,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
