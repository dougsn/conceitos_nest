import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PessoasService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>
  ) { }

  async create(createPessoaDto: CreatePessoaDto) {
    const validation = await this.pessoaRepository.findOne({
      where: { email: createPessoaDto.email }
    })
    if (validation) throw new ConflictException("E-mail já está cadastrado.")

    const data = {
      nome: createPessoaDto.nome,
      passwordHash: createPessoaDto.password,
      email: createPessoaDto.email
    }

    const novaPessoa = await this.pessoaRepository.create(data);
    await this.pessoaRepository.save(novaPessoa);

    return novaPessoa;
  }

  async findAll() {
    const pessoas = this.pessoaRepository.find({
      order: {
        id: 'ASC'
      }
    });
    return pessoas;
  }

  async findOne(id: number) {
    const pessoa = await this.pessoaRepository.findOneBy({ id })
    if (!pessoa) throw new NotFoundException(`Pessoa de id: ${id} não foi encontrada.`)
    return pessoa;
  }

  async update(id: number, updatePessoaDto: UpdatePessoaDto) {
    const newPessoa = {
      nome: updatePessoaDto.nome,
      passwordHash: updatePessoaDto.password
    }

    const pessoa = await this.pessoaRepository.preload({
      id,
      ...newPessoa
    });
    if (!pessoa) throw new NotFoundException(`Pessoa de id: ${id} não encontrada.`)

    return this.pessoaRepository.save(pessoa);
  }

  async remove(id: number) {
    const pessoa = await this.pessoaRepository.findOneBy({ id });
    if (!pessoa) throw new NotFoundException(`Pessoa de id: ${id} não encontrada.`)

    return this.pessoaRepository.remove(pessoa);
  }
}
