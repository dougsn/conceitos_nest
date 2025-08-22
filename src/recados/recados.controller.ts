import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('recados')
export class RecadosController {

  constructor(private readonly recadosService: RecadosService) { }

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.recadosService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log(id, typeof id)
    return this.recadosService.findOne(id);
  }

  @Post()
  create(@Body() data: CreateRecadoDto) {
    return this.recadosService.create(data);
  }

  @Patch(':id') // Atualiza parte do objeto
  patch(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateRecadoDto) {
    return this.recadosService.update(id, data)
  }

  @Put(':id') // Atualiza objeto inteiro
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateRecadoDto) {
    return this.recadosService.update(id, data)
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recadosService.remove(id)
  }
}
