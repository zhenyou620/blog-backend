import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  @Length(1)
  @MaxLength(40)
  title: string;

  @IsString()
  @Length(1)
  content: string;

  @IsBoolean()
  published: boolean;
}
