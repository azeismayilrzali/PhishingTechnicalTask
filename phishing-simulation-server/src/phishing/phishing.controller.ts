import { Controller, Post, Body, Get, Param, Logger } from '@nestjs/common';
import { PhishingService } from './phishing.service';
import { SendPhishingDto } from './dto/send-phishing.dto';

@Controller('phishing')
export class PhishingController {
  private readonly logger = new Logger(PhishingController.name);

  constructor(
    private readonly phishingService: PhishingService,
  ) {}

  @Post('send')
  async sendPhishingEmail(@Body() sendPhishingDto: SendPhishingDto) {
    this.logger.log(`Sending phishing email to ${sendPhishingDto.email}`);
    const result =
      await this.phishingService.sendPhishingEmail(sendPhishingDto);
    return {
      message: 'Phishing email sent successfully',
      trackingId: result.trackingId,
    };
  }

  @Get('track/:trackingId')
  async trackClick(@Param('trackingId') trackingId: string) {
    this.logger.log(`Phishing link clicked for tracking ID: ${trackingId}`);
    await this.phishingService.recordClick(trackingId);
    return { message: 'This was a phishing simulation test' };
  }
}
