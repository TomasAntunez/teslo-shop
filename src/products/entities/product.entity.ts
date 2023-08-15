import {
  BeforeInsert, BeforeUpdate, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn
} from "typeorm";
import { ProductImage } from "./product-image.entity";


@Entity({ name: 'products' })
export class Product {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true
  })
  title: string;

  @Column('float', {
    default: 0
  })
  price: number;

  @Column({
    type: 'text',
    nullable: true
  })
  description: string;

  @Column('text' ,{
    unique: true
  })
  @Index()
  slug: string;

  @Column('int')
  stock: number;

  @Column('text', {
    array: true
  })
  sizes: string[];

  @Column('text')
  gender: string;

  @Column('text', {
    array: true,
    default: []
  })
  tags: string[];

  @OneToMany(
    () => ProductImage,
    productImage => productImage.product,
    { cascade: true, eager: true }
  )
  images?: ProductImage[]

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
