using System.ComponentModel.DataAnnotations;

namespace TaskService.DTOs;

public class CreateCommentDto
{
    [Required(ErrorMessage = "Comment text is required")]
    [MaxLength(1000, ErrorMessage = "Comment cannot exceed 1000 characters")]
    public string Text { get; set; } = string.Empty;

    [Required(ErrorMessage = "CommentedByUserId is required")]
    [Range(1, int.MaxValue, ErrorMessage = "CommentedByUserId must be a positive number")]
    public int CommentedByUserId { get; set; }
}

public class UpdateCommentDto
{
    [Required(ErrorMessage = "Comment text is required")]
    [MaxLength(1000, ErrorMessage = "Comment cannot exceed 1000 characters")]
    public string Text { get; set; } = string.Empty;
}

public class CommentResponseDto
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public int CommentedByUserId { get; set; }
    public int TaskId { get; set; }
    public DateTime CreatedOn { get; set; }
}
