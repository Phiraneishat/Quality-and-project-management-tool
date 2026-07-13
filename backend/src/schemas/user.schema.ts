import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, enum: ['Admin', 'Project Manager', 'Team Lead', 'Developer', 'QA Tester', 'Client'], default: 'Developer' })
  role: string;

  @Prop()
  avatar?: string;

  @Prop()
  department?: string;

  @Prop()
  phone?: string;

  @Prop({ default: true })
  isVerified: boolean;

  @Prop({ default: false })
  is2FAEnabled: boolean;

  @Prop()
  resetOtp?: string;

  @Prop()
  resetOtpExpires?: Date;

  @Prop({ default: false })
  isFaceIdRegistered: boolean;

  @Prop({ default: 0 })
  faceLoginCount: number;

  @Prop()
  faceTemplate?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
