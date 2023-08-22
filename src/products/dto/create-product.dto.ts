import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength
} from "class-validator";


export class CreateProductDto {

  @ApiProperty({
    description: 'Product title (unique)',
    nullable: false,
    minLength: 1
  })
  @IsString()
  @MinLength(1)
  @Transform(({ value }: { value: string }) => value.trim())
  title: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  stock: number;

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty()
  @IsIn(['men','women','kid','unisex'])
  gender: string;

  @ApiProperty()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @IsArray()
  @IsOptional()
  tags?: string[]

  @ApiProperty()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @IsArray()
  @IsOptional()
  images?: string[]

}
