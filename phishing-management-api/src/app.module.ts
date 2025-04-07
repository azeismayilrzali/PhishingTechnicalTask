import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PhishingModule } from './phishing/phishing.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
        user: configService.get('MONGODB_USER'),
        pass: configService.get('MONGODB_PASSWORD'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    PhishingModule,
  ],
})
export class AppModule {}
