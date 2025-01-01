// update-streak.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateStreakDto } from './create-streak.dto';

export class UpdateStreakDto extends PartialType(CreateStreakDto) {
  status?: 'i have prayed' | 'i did not pray';
}