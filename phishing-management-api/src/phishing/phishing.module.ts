import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PhishingController } from './phishing.controller';
import { PhishingService } from './phishing.service';
import {
  PhishingAttempt,
  PhishingAttemptSchema,
} from './schemas/phishing-attempt.schema';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PhishingAttempt.name,
        schema: PhishingAttemptSchema,
      },
    ]),
    HttpModule,
    ConfigModule,
  ],
  controllers: [PhishingController],
  providers: [PhishingService],
})
export class PhishingModule {}
