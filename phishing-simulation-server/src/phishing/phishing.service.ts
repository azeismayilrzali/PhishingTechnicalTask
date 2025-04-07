import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import {
  PhishingAttempt,
  PhishingAttemptStatus,
} from './schemas/phishing-attempt.schema';
import { SendPhishingDto } from './dto/send-phishing.dto';
import { EmailService } from './email.service';
import { PhishingStatusGateway } from '../shared/gateways/phishing-status.gateway';

@Injectable()
export class PhishingService {
  private readonly logger = new Logger(PhishingService.name);

  constructor(
    @InjectModel(PhishingAttempt.name)
    private phishingAttemptModel: Model<PhishingAttempt>,
    private emailService: EmailService,
    private phishingStatusGateway: PhishingStatusGateway,
  ) {}

  async sendPhishingEmail(
    sendPhishingDto: SendPhishingDto,
  ): Promise<PhishingAttempt> {
    const trackingId = uuidv4();

    const phishingAttempt = new this.phishingAttemptModel({
      email: sendPhishingDto.email,
      templateId: sendPhishingDto.templateId,
      status: PhishingAttemptStatus.PENDING,
      trackingId,
      metadata: sendPhishingDto.metadata || {},
    });

    this.phishingStatusGateway.notifyStatusChange(phishingAttempt);

    try {
      const { subject, html } = this.emailService.getPhishingTemplate(
        sendPhishingDto.templateId,
        trackingId,
      );

      await this.emailService.sendEmail(sendPhishingDto.email, subject, html);

      phishingAttempt.status = PhishingAttemptStatus.SENT;
      phishingAttempt.sentAt = new Date();
      await phishingAttempt.save();

      this.phishingStatusGateway.notifyStatusChange(phishingAttempt);

      this.logger.log(
        `Phishing email sent successfully to ${sendPhishingDto.email}`,
      );
      return phishingAttempt;
    } catch (error) {
      this.logger.error(
        `Failed to send phishing email to ${sendPhishingDto.email}`,
        error.stack,
      );

      phishingAttempt.status = PhishingAttemptStatus.FAILED;
      this.phishingStatusGateway.notifyStatusChange(phishingAttempt);
      await phishingAttempt.save();

      throw error;
    }
  }

  async recordClick(trackingId: string): Promise<PhishingAttempt> {
    const phishingAttempt = await this.phishingAttemptModel.findOne({
      trackingId,
    });

    if (!phishingAttempt) {
      this.logger.warn(
        `No phishing attempt found with tracking ID: ${trackingId}`,
      );
      throw new NotFoundException(
        `No phishing attempt found with tracking ID: ${trackingId}`,
      );
    }

    phishingAttempt.status = PhishingAttemptStatus.CLICKED;
    phishingAttempt.clickedAt = new Date();
    await phishingAttempt.save();

    this.phishingStatusGateway.notifyStatusChange(phishingAttempt);

    this.logger.log(
      `Phishing link clicked for email: ${phishingAttempt.email}`,
    );
    return phishingAttempt;
  }
}
