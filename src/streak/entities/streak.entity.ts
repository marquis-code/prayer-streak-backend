// streak.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Streak extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop()
  time?: string;

  @Prop({ default: false })
  includeTime: boolean;

  @Prop({ enum: ['i have prayed', 'i did not pray'], default: 'i did not pray' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const StreakSchema = SchemaFactory.createForClass(Streak);
