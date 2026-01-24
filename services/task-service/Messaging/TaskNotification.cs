namespace TaskService.Messaging;

public class TaskNotification
{
    public int TaskId { get; set; }
    public string TaskTitle { get; set; } = string.Empty;
    public int AssignedToUserId { get; set; }
    public int AssignedByUserId { get; set; }
    public DateTime DueDate { get; set; }
    public string NotificationType { get; set; } = "TASK_ASSIGNED";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
