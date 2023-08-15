import { Transform } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, Length, MinLength
} from "class-validator";


export class CreateProductDto {

  @IsString()
  @MinLength(1)
  @Transform(({ value }: { value: string }) => value.trim())
  title: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsInt()
  @IsPositive()
  stock: number;

  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @IsIn(['men','women','kid','unisex'])
  gender: string;

  @IsString({ each: true })
  @MinLength(1, { each: true })
  @IsArray()
  @IsOptional()
  tags?: string[]

  @IsString({ each: true })
  @MinLength(1, { each: true })
  @IsArray()
  @IsOptional()
  images?: string[]

}
