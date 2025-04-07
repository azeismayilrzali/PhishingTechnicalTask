import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type PhishingAttemptDocument = PhishingAttempt & Document;

export enum PhishingAttemptStatus {
  PENDING = 'pending',
  SENT = 'sent',
  CLICKED = 'clicked',
  FAILED = 'failed',
}

@Schema({ timestamps: true })
export class PhishingAttempt {
  @Prop({ required: true })
  targetEmail: string;

  @Prop({ required: true })
  templateName: string;

  @Prop({
    type: String,
    enum: PhishingAttemptStatus,
    default: PhishingAttemptStatus.PENDING,
  })
  status: PhishingAttemptStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @Prop()
  sentAt: Date;

  @Prop()
  clickedAt: Date;

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const PhishingAttemptSchema =
  SchemaFactory.createForClass(PhishingAttempt);
