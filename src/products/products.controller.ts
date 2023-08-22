import {
  Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';

import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './entities';


@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth( ValidRoles.ADMIN )
  @ApiResponse({ status: 201, description: 'Product was created', type: Product })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  findAll( @Query() paginationDto: PaginationDto ) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':termSearch')
  findOne(@Param('termSearch') termSearch: string) {
    return this.productsService.findOnePlain(termSearch);
  }

  @Patch(':id')
  @Auth( ValidRoles.ADMIN )
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Auth( ValidRoles.ADMIN )
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
