import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class EmailTemplate extends Document {
  @Prop()
  subject: string;

  @Prop()
  html: string;
}

export const EmailTemplatesSchema = SchemaFactory.createForClass(EmailTemplate);
