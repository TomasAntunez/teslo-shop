import { IsString, MaxLength, MinLength } from "class-validator";

export class MessageDto {

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  message: string;

}
