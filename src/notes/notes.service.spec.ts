import { Test } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { PrismaService } from '../prisma/prisma.service';
import { Note } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { create } from 'domain';
import { title } from 'process';

const mockPrismaService = {
  note: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('NotesServiceTest', () => {
  let notesService: NotesService;
  let prismaService: PrismaService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        NotesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    notesService = module.get<NotesService>(NotesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('findAll', () => {
    it('正常系', async () => {
      jest.mocked(prismaService.note.findMany).mockResolvedValue([]);
      const expected = [];
      const result = await notesService.findAll();
      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('正常系', async () => {
      const note: Note = {
        id: 'test-id1',
        title: 'test-title1',
        content: 'test-content1',
        published: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      jest.mocked(prismaService.note.findUnique).mockResolvedValue(note);
      const result = await notesService.findById('test-id1');
      expect(result).toEqual(note);
      expect(prismaService.note.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-id1' },
      });
    });

    it('異常系：商品が存在しない', async () => {
      jest.mocked(prismaService.note.findUnique).mockResolvedValue(null);
      await expect(notesService.findById('test-id1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('正常系', async () => {
      const createNoteDto: CreateNoteDto = {
        title: 'test-title1',
        content: 'test-content1',
        published: false,
      };

      const expected: Note = {
        id: 'test-id1',
        title: 'test-title1',
        content: 'test-content1',
        published: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      jest.mocked(prismaService.note.create).mockResolvedValue(expected);
      const result = await notesService.create(createNoteDto);
      expect(result).toEqual(expected);

      expect(prismaService.note.create).toHaveBeenCalledWith({
        data: {
          title: createNoteDto.title,
          content: createNoteDto.content,
          published: createNoteDto.published,
        },
      });
    });
  });
});
