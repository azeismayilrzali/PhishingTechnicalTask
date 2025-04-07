import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum PhishingAttemptStatus {
  PENDING = 'pending',
  SENT = 'sent',
  CLICKED = 'clicked',
  FAILED = 'failed',
}

@Schema({ timestamps: true })
export class PhishingAttempt extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  templateId: string;

  @Prop({ required: true, default: PhishingAttemptStatus.PENDING })
  status: PhishingAttemptStatus;

  @Prop()
  sentAt: Date;

  @Prop()
  clickedAt: Date;

  @Prop()
  trackingId: string;

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const PhishingAttemptSchema =
  SchemaFactory.createForClass(PhishingAttempt);
