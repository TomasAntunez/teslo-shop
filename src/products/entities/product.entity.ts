import { ApiProperty } from "@nestjs/swagger";
import {
  BeforeInsert, BeforeUpdate, Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn
} from "typeorm";

import { User } from "src/users/entities/user.entity";

import { ProductImage } from "./product-image.entity";


@Entity({ name: 'products' })
export class Product {

  @ApiProperty({
    example: '08b2fe3f-b5ae-4d1d-a78d-2eadeacd4bd2',
    description: 'Product ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'T-shirt Teslo',
    description: 'Product Title',
    uniqueItems: true
  })
  @Column('text', {
    unique: true
  })
  title: string;

  @ApiProperty({
    example: 0,
    description: 'Product Price'
  })
  @Column('float', {
    default: 0
  })
  price: number;

  @ApiProperty({
    example: 'It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.',
    description: 'Product Description',
    default: null
  })
  @Column({
    type: 'text',
    nullable: true
  })
  description: string;

  @ApiProperty({
    example: 't_shirt_teslo',
    description: 'Product Slug',
    uniqueItems: true
  })
  @Column('text' ,{
    unique: true
  })
  @Index()
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product Stock',
    default: 0
  })
  @Column('int')
  stock: number;

  @ApiProperty({
    example: ['M','XL','XXL'],
    description: 'Product Sizes'
  })
  @Column('text', {
    array: true
  })
  sizes: string[];

  @ApiProperty({
    example: 'women',
    description: 'Product Gender'
  })
  @Column('text')
  gender: string;

  @ApiProperty()
  @Column('text', {
    array: true,
    default: []
  })
  tags: string[];

  @ApiProperty()
  @OneToMany(
    () => ProductImage,
    productImage => productImage.product,
    { cascade: true, eager: true }
  )
  images?: ProductImage[]

  @ManyToOne(
    () => User,
    user => user.products,
    { eager: true }
  )
  user: User


  @BeforeInsert()
  createSlug() {
    if ( !this.slug ) {
      this.slug = this.title;
    }

    this.formatSlug();
  }

  @BeforeUpdate()
  formatSlug() {
    this.slug = this.slug.toLowerCase()
    .replaceAll(" ", "_")
    .replaceAll("'", "");
  }
}
