import { Test, TestingModule } from '@nestjs/testing';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        TodoService,
        {
          provide: TodoService,
          useFactory: () => ({
            create: jest.fn(() => {}),
            findAll: jest.fn(() => []),
            findOne: jest.fn(() => {}),
            update: jest.fn(() => {}),
            remove: jest.fn(() => String),
          }),
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create todo method', async () => {
    const dto = new CreateTodoDto();

    controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should findAll method', () => {
    controller.findAll();

    expect(service.findAll).toHaveBeenCalled();
  });

  it('should findOne method', () => {
    const id = 'fake_id';

    controller.findOne(id);

    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  it('should update method', () => {
    const dto = new UpdateTodoDto();
    const id = 'fake_id';
    controller.update(id, dto);

    expect(service.update).toHaveBeenCalledWith(id, dto);
  });

  it('should remove method', () => {
    const id = 'fake_id';
    controller.remove(id);
    expect(service.remove).toHaveBeenCalledWith(id);
  });
});
