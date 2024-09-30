import { Injectable, NotFoundException } from '@nestjs/common';
import { Note } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NotesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<Note[]> {
    return await this.prismaService.note.findMany();
  }

  async findById(id: string): Promise<Note> {
    const found = await this.prismaService.note.findUnique({
      where: {
        id,
      },
    });

    if (!found) {
      throw new NotFoundException();
    }

    return found;
  }

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const { title, content, published } = createNoteDto;
    return await this.prismaService.note.create({
      data: {
        title,
        content,
        published,
      },
    });
  }

  async update(id: string, updateDto: Partial<CreateNoteDto>): Promise<Note> {
    const { title, content, published } = updateDto;
    const data: Partial<CreateNoteDto> = {};

    if (title) {
      data.title = title;
    }

    if (content) {
      data.content = content;
    }

    if (published) {
      data.published = published;
    }

    return await this.prismaService.note.update({
      data,
      where: { id },
    });
  }

  async delete(id: string) {
    await this.prismaService.note.delete({
      where: { id },
    });
  }
}
