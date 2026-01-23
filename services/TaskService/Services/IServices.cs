using TaskService.DTOs;

namespace TaskService.Services;

public interface ITaskService
{
    Task<IEnumerable<TaskResponseDto>> GetAllTasksAsync();
    Task<TaskResponseDto> CreateTaskAsync(CreateTaskDto dto);
    Task<TaskResponseDto?> UpdateTaskAsync(int id, UpdateTaskDto dto);
}

public interface ICommentService
{
    Task<CommentResponseDto> CreateCommentAsync(int taskId, CreateCommentDto dto);
    Task<CommentResponseDto?> UpdateCommentAsync(int taskId, int commentId, UpdateCommentDto dto);
}
