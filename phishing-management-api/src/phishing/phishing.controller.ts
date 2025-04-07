import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PhishingService } from './phishing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiSecurity } from '@nestjs/swagger';

@Controller('phishing')
@UseGuards(JwtAuthGuard)
@ApiSecurity('jwt')
export class PhishingController {
  constructor(private readonly phishingService: PhishingService) {}

  @Get()
  async findAll() {
    return this.phishingService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.phishingService.findOne(id);
  }
}
