import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Recado } from './models/recado.model';
import { Repository } from 'typeorm';
import { PessoasService } from 'src/pessoas/pessoas.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class RecadosService {

    // Injetando o repositório para poder manipular os dados do banco de dados.
    constructor(
        @InjectRepository(Recado)
        private readonly recadoRepository: Repository<Recado>,
        private readonly pessoaService: PessoasService,
    ) { }

    async findAll(pagination?: PaginationDto) {
        const limit = pagination?.limit ?? 10;
        const offset = pagination?.offset ?? 0;

        const recados = await this.recadoRepository.find({
            take: limit,
            skip: offset,
            // relations: ["de", "para"],
            order: {
                id: "desc"
            },
            select: {
                de: {
                    id: true,
                    nome: true
                },
                para: {
                    id: true,
                    nome: true
                }
            }
        });
        return recados;
    }

    async findOne(id: number) {
        const recado = await this.recadoRepository.findOne({
            where: {
                id
            },
            relations: ["de", "para"],
            select: {
                de: {
                    id: true,
                    nome: true
                },
                para: {
                    id: true,
                    nome: true
                }
            }
        });
        if (!recado) throw new NotFoundException(`Recado de id: ${id} não encontrado.`)
        return recado;
    }

    async create(data: CreateRecadoDto) {
        const de = await this.pessoaService.findOne(data.deId)
        const para = await this.pessoaService.findOne(data.paraId)


        const novoRecado = {
            texto: data.texto,
            de,
            para
        }

        const recado = await this.recadoRepository.create(novoRecado);
        this.recadoRepository.save(recado);

        return {
            ...recado,
            de: {
                id: recado.de.id
            },
            para: {
                id: recado.para.id
            }
        }
    }

    async update(id: number, data: UpdateRecadoDto) {
        // O .preload() atualiza apenas o que foi enviado na DTO
        // const recado = await this.recadoRepository.preload({ id, ...data })
        const recado = await this.findOne(id);

        recado.texto = data?.texto ?? recado.texto;
        recado.lido = data?.lido ?? recado.lido;

        await this.recadoRepository.save(recado);
        return recado;
    }

    async remove(id: number) {
        const recado = await this.recadoRepository.findOneBy({ id });

        if (!recado) throw new NotFoundException(`Recado de id: ${id} não encontrado.`)
        return this.recadoRepository.remove(recado);
    }

}
