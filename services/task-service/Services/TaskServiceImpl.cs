using Microsoft.EntityFrameworkCore;
using TaskService.Data;
using TaskService.DTOs;
using TaskService.Messaging;
using TaskService.Models;

namespace TaskService.Services;

public class TaskServiceImpl : ITaskService
{
    private readonly TaskDbContext _context;
    private readonly IMessagePublisher _messagePublisher;

    public TaskServiceImpl(TaskDbContext context, IMessagePublisher messagePublisher)
    {
        _context = context;
        _messagePublisher = messagePublisher;
    }

    public async Task<IEnumerable<TaskResponseDto>> GetAllTasksAsync()
    {
        var tasks = await _context.Tasks
            .Include(t => t.Comments)
            .OrderByDescending(t => t.CreatedOn)
            .ToListAsync();
        return tasks.Select(MapToDto);
    }

    public async Task<TaskResponseDto> CreateTaskAsync(CreateTaskDto dto)
    {
        var task = new TaskItem
        {
            Title = dto.Title,
            Description = dto.Description,
            Priority = dto.Priority,
            Status = dto.Status,
            AssignedToUserId = dto.AssignedToUserId,
            AssignedByUserId = dto.AssignedByUserId,
            DueDate = dto.DueDate,
            CreatedOn = DateTime.UtcNow,
            UpdatedOn = DateTime.UtcNow
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        // Trigger notification
        var notification = new TaskNotification
        {
            TaskId = task.Id,
            TaskTitle = task.Title,
            AssignedToUserId = task.AssignedToUserId,
            AssignedByUserId = task.AssignedByUserId,
            DueDate = task.DueDate,
            NotificationType = "TASK_ASSIGNED"
        };
        await _messagePublisher.PublishTaskNotificationAsync(notification);

        return MapToDto(task);
    }

    public async Task<TaskResponseDto?> UpdateTaskAsync(int id, UpdateTaskDto dto)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return null;

        task.Title = dto.Title;
        task.Description = dto.Description;
        task.Priority = dto.Priority;
        task.Status = dto.Status;
        task.AssignedToUserId = dto.AssignedToUserId;
        task.DueDate = dto.DueDate;
        task.UpdatedOn = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return MapToDto(task);
    }



    private static TaskResponseDto MapToDto(TaskItem task)
    {
        return new TaskResponseDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Priority = task.Priority,
            Status = task.Status,
            AssignedToUserId = task.AssignedToUserId,
            AssignedByUserId = task.AssignedByUserId,
            DueDate = task.DueDate,
            Comments = task.Comments?.Select(c => new CommentResponseDto
            {
                Id = c.Id,
                Text = c.Text,
                CommentedByUserId = c.CommentedByUserId,
                TaskId = c.TaskId
            }) ?? Enumerable.Empty<CommentResponseDto>()
        };
    }
}
