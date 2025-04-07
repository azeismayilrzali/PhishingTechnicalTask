import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import {
  PhishingAttempt,
  PhishingAttemptDocument,
  PhishingAttemptStatus,
} from './schemas/phishing-attempt.schema';
import { CreatePhishingDto } from './dto/create-phishing.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class PhishingService {
  constructor(
    @InjectModel(PhishingAttempt.name)
    private phishingAttemptModel: Model<PhishingAttemptDocument>,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async create(
    createPhishingDto: CreatePhishingDto,
    user: User,
  ): Promise<PhishingAttempt> {
    const phishingAttempt = new this.phishingAttemptModel({
      ...createPhishingDto,
      createdBy: user._id,
    });
    return phishingAttempt.save();
  }

  async findAll(query: any = {}): Promise<PhishingAttempt[]> {
    return this.phishingAttemptModel
      .find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<PhishingAttempt> {
    return this.phishingAttemptModel
      .findById(id)
      .populate('createdBy', 'name email')
      .exec();
  }

  async sendPhishingEmail(id: string): Promise<PhishingAttempt> {
    // Find the phishing attempt
    const phishingAttempt = await this.phishingAttemptModel.findById(id).exec();
    if (!phishingAttempt) {
      throw new HttpException(
        'Phishing attempt not found',
        HttpStatus.NOT_FOUND,
      );
    }

    // Check if it's not already sent
    if (phishingAttempt.status !== PhishingAttemptStatus.PENDING) {
      throw new HttpException(
        'Phishing attempt already processed',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // Call the Phishing Simulation server
      const simulationServerUrl =
        this.configService.get('PHISHING_SIMULATION_URL') ||
        'http://localhost:3001';

      await firstValueFrom(
        this.httpService.post(`${simulationServerUrl}/phishing/send`, {
          email: phishingAttempt.targetEmail,
          template: phishingAttempt.templateName,
          metadata: {
            attemptId: phishingAttempt._id,
            ...phishingAttempt.metadata,
          },
        }),
      );

      // Update phishing attempt status
      phishingAttempt.status = PhishingAttemptStatus.SENT;
      phishingAttempt.sentAt = new Date();
      await phishingAttempt.save();

      return phishingAttempt;
    } catch (error) {
      // Update status to failed
      phishingAttempt.status = PhishingAttemptStatus.FAILED;
      await phishingAttempt.save();

      throw new HttpException(
        `Failed to send phishing email: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePhishingStatus(
    id: string,
    status: {
      opened?: boolean;
      openedAt?: Date;
      clicked?: boolean;
      clickedAt?: Date;
    },
  ): Promise<PhishingAttempt> {
    return this.phishingAttemptModel
      .findByIdAndUpdate(id, status, { new: true })
      .exec();
  }
}
