using System.ComponentModel.DataAnnotations;
using TaskService.Models;

namespace TaskService.DTOs;

public class CreateTaskDto
{
    [Required(ErrorMessage = "Title is required")]
    [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "Priority is required")]
    [EnumDataType(typeof(Priority), ErrorMessage = "Invalid priority value")]
    public Priority Priority { get; set; }

    [EnumDataType(typeof(Models.TaskStatus), ErrorMessage = "Invalid status value")]
    public Models.TaskStatus Status { get; set; } = Models.TaskStatus.New;

    [Required(ErrorMessage = "AssignedToUserId is required")]
    [Range(1, int.MaxValue, ErrorMessage = "AssignedToUserId must be a positive number")]
    public int AssignedToUserId { get; set; }

    [Required(ErrorMessage = "AssignedByUserId is required")]
    [Range(1, int.MaxValue, ErrorMessage = "AssignedByUserId must be a positive number")]
    public int AssignedByUserId { get; set; }

    [Required(ErrorMessage = "DueDate is required")]
    [DataType(DataType.DateTime)]
    public DateTime DueDate { get; set; }
}

public class UpdateTaskDto
{
    [Required(ErrorMessage = "Title is required")]
    [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "Priority is required")]
    [EnumDataType(typeof(Priority), ErrorMessage = "Invalid priority value")]
    public Priority Priority { get; set; }

    [EnumDataType(typeof(Models.TaskStatus), ErrorMessage = "Invalid status value")]
    public Models.TaskStatus Status { get; set; }

    [Required(ErrorMessage = "AssignedToUserId is required")]
    [Range(1, int.MaxValue, ErrorMessage = "AssignedToUserId must be a positive number")]
    public int AssignedToUserId { get; set; }

    [Required(ErrorMessage = "DueDate is required")]
    [DataType(DataType.DateTime)]
    public DateTime DueDate { get; set; }
}

public class TaskResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Priority Priority { get; set; }
    public Models.TaskStatus Status { get; set; }
    public int AssignedToUserId { get; set; }
    public int AssignedByUserId { get; set; }
    public DateTime DueDate { get; set; }
    public IEnumerable<CommentResponseDto> Comments { get; set; } = new List<CommentResponseDto>();
}
