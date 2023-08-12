import { BeforeInsert, BeforeUpdate, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
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

  // images

  @BeforeInsert()
  createSlug() {
    if ( !this.slug ) {
      this.slug = this.title;
    }

    this.sanitizeSlug();
  }

  @BeforeUpdate()
  sanitizeSlug() {
    this.slug = this.slug.toLowerCase()
    .replaceAll(' ', '_')
    .replaceAll("'", '_');
  }
}
