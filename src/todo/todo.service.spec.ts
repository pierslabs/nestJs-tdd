import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { TodoService } from './todo.service';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateTodoDto } from './dto/update-todo.dto';

describe('TodoService', () => {
  let service: TodoService;
  let repository: Repository<Todo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    repository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should saveTodo with expected params', async () => {
    const todo = {
      id: 'fakeuuid',
      name: 'Some Todo',
      createdAt: new Date(),
      expire: true,
      completed: true,
    };

    const spyRepository = jest
      .spyOn(repository, 'create')
      .mockReturnValue(todo);

    jest.spyOn(repository, 'save').mockResolvedValue(todo);

    const result = await service.create(todo);

    expect(spyRepository).toHaveBeenCalledWith(todo);
    expect(result).toEqual(todo);
  });

  it('should findAll return todos array ', async () => {
    const todos: Todo[] = [
      { id: 'fake_uuid_1', name: 'fake todo 1', expire: true, completed: true },
      { id: 'fake_uuid_2', name: 'fake todo 2', expire: true, completed: true },
    ];

    jest.spyOn(repository, 'find').mockResolvedValue(todos);

    const res = await service.findAll();
    expect(res).toEqual(todos);
  });

  it('sholud findOne return 1 todo by Id ', async () => {
    const todo: Todo = {
      id: 'fake_id',
      name: 'fake todo',
      expire: true,
      completed: false,
    };

    jest.spyOn(repository, 'findOneBy').mockResolvedValue(todo);

    const res = await service.findOne('4');
    console.log(res);
    expect(res).toEqual(todo);
  });

  it('should findOne fail', async () => {
    const todoId = '1';
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

    await expect(service.findOne(todoId)).rejects.toThrowError(
      new NotFoundException(`Todo with: ${todoId} not found 😒`),
    );
  });

  it('should update todo ', async () => {
    const todo: Todo = {
      id: 'fake_id',
      name: 'Go to gym',
      completed: true,
      expire: true,
    };

    const updateTodo = {
      ...todo,
      name: 'update name',
    };

    jest.spyOn(service, 'findOne').mockResolvedValue(todo);
    jest
      .spyOn(repository, 'preload')
      .mockResolvedValue({ ...todo, name: 'update name' });

    jest.spyOn(repository, 'save').mockResolvedValue(updateTodo);

    const res = await service.update(todo.id, updateTodo);

    expect(res).toEqual({
      ...todo,
      name: 'update name',
    });
  });

  it('should remove todo ', async () => {
    const todo: Todo = {
      id: 'fake_id',
      name: 'Go to gym',
      completed: true,
      expire: true,
    };

    jest.spyOn(repository, 'remove').mockResolvedValue(undefined);

    jest.spyOn(service, 'findOne').mockResolvedValue(todo);

    const res = await service.remove(todo.id);

    expect(res).toEqual(`Todo with id: ${todo.id} deleted.`);
  });
});
