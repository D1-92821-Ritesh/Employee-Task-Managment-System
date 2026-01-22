using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskService.Models;

[Table("Tasks")]
public class TaskItem
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? Description { get; set; }

    [Required]
    public Priority Priority { get; set; }

    [Required]
    public TaskStatus Status { get; set; } = TaskStatus.New;

    [Required]
    public int AssignedToUserId { get; set; }

    [Required]
    public int AssignedByUserId { get; set; }

    [Required]
    public DateTime DueDate { get; set; }

    [Required]
    public DateTime CreatedOn { get; set; }

    [Required]
    public DateTime UpdatedOn { get; set; }

    public bool IsDeleted { get; set; } = false;

    // Navigation property
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
