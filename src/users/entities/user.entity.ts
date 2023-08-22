import {
  BeforeInsert, BeforeUpdate, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn
} from "typeorm";

import { Product } from "src/products/entities";


@Entity('users')
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true
  })
  @Index()
  email: string;

  @Column('text', {
    select: false
  })
  password: string;

  @Column('text')
  fullName: string;

  @Column('bool', {
    default: true
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: ['user']
  })
  roles: string[];

  @OneToMany(
    () => Product,
    product => product.user
  )
  products: Product[]


  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.formatEmail()
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.formatEmail()
  }

  private formatEmail() {
    this.email = this.email.toLowerCase().trim();
  }

}
