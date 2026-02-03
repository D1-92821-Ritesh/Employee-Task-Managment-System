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
    private readonly IUserServiceClient _userServiceClient;

    public TaskServiceImpl(TaskDbContext context, IMessagePublisher messagePublisher, IUserServiceClient userServiceClient)
    {
        _context = context;
        _messagePublisher = messagePublisher;
        _userServiceClient = userServiceClient;
    }

    public async Task<IEnumerable<TaskResponseDto>> GetAllTasksAsync()
    {
        var tasks = await _context.Tasks
            .Include(t => t.Comments)
            .OrderByDescending(t => t.CreatedOn)
            .ToListAsync();

        // Get all unique user IDs from tasks
        var userIds = tasks
            .SelectMany(t => new[] { t.AssignedToUserId, t.AssignedByUserId })
            .Distinct()
            .ToList();

        // Fetch user names from user-service
        var userNames = await _userServiceClient.GetUserNamesAsync(userIds);

        // Map tasks to DTOs with user names
        return tasks.Select(t => MapToDto(t, userNames));
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

        // Fetch user names for the response
        var userIds = new[] { task.AssignedToUserId, task.AssignedByUserId };
        var userNames = await _userServiceClient.GetUserNamesAsync(userIds);

        return MapToDto(task, userNames);
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

        // Fetch user names for the response
        var userIds = new[] { task.AssignedToUserId, task.AssignedByUserId };
        var userNames = await _userServiceClient.GetUserNamesAsync(userIds);

        return MapToDto(task, userNames);
    }

    private static TaskResponseDto MapToDto(TaskItem task, Dictionary<int, string>? userNames = null)
    {
        return new TaskResponseDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Priority = task.Priority,
            Status = task.Status,
            AssignedToUserId = task.AssignedToUserId,
            AssignedToUserName = userNames?.GetValueOrDefault(task.AssignedToUserId),
            AssignedByUserId = task.AssignedByUserId,
            AssignedByUserName = userNames?.GetValueOrDefault(task.AssignedByUserId),
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
