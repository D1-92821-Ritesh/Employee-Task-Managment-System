using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskService.Models;

[Table("Comments")]
public class Comment
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [MaxLength(1000)]
    public string Text { get; set; } = string.Empty;

    [Required]
    public int CommentedByUserId { get; set; }

    [Required]
    public DateTime CreatedOn { get; set; }

    public bool IsDeleted { get; set; } = false;

    // Foreign key
    [Required]
    [ForeignKey("Task")]
    public int TaskId { get; set; }

    // Navigation property
    public TaskItem Task { get; set; } = null!;
}
