import {
  BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { validate as isUUID } from 'uuid';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';


@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  private readonly productQueryBuilder: SelectQueryBuilder<Product>;

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
    this.productQueryBuilder = productRepository.createQueryBuilder();
  }


  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);

      return product;

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;

    return await this.productRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne(termSearch: string) {

    let product: Product;

    if ( isUUID(termSearch) ) {
      product = await this.productRepository.findOneBy({ id: termSearch });
    } else {
      product = await this.productQueryBuilder
        .where('LOWER(title)=:title or slug=:slug', {
          title: termSearch.toLowerCase(),
          slug: termSearch.toLowerCase()
        })
        .getOne();
    }

    if (!product) throw new NotFoundException(`Product with term '${termSearch}' not found`);

    return product;
  }


  async update(id: string, updateProductDto: UpdateProductDto) {

    const product = await this.productRepository.preload({ id, ...updateProductDto });

    if (!product) throw new NotFoundException(`Product with id '${id}' not found`);

    try {
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
  

  async remove(id: string) {
    const { affected } = await this.productRepository.delete({ id });
    if ( affected === 0 ) {
      throw new NotFoundException(`Product with id '${id}' not found`);
    }
  }

  private handleDBExceptions( error: any ) {
    if ( error.code === '23505' ) {
      throw new BadRequestException(error.detail);
    }
    this.logger.error({ error, from: 'logger' });
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

}
