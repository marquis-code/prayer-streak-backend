// create-streak.dto.ts
export class CreateStreakDto {
  title: string;
  description: string;
  date: Date;
  time?: string;
  includeTime: boolean;
  userId: string;
}
