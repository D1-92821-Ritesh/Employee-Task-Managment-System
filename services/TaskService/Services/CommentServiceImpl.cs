using Microsoft.EntityFrameworkCore;
using TaskService.Data;
using TaskService.DTOs;
using TaskService.Models;

namespace TaskService.Services;

public class CommentServiceImpl : ICommentService
{
    private readonly TaskDbContext _context;

    public CommentServiceImpl(TaskDbContext context)
    {
        _context = context;
    }



    public async Task<CommentResponseDto> CreateCommentAsync(int taskId, CreateCommentDto dto)
    {
        var taskExists = await _context.Tasks.AnyAsync(t => t.Id == taskId);
        if (!taskExists)
            throw new ArgumentException($"Task with ID {taskId} not found");

        var comment = new Comment
        {
            Text = dto.Text,
            CommentedByUserId = dto.CommentedByUserId,
            TaskId = taskId,
            CreatedOn = DateTime.UtcNow
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();
        return MapToDto(comment);
    }

    public async Task<CommentResponseDto?> UpdateCommentAsync(int taskId, int commentId, UpdateCommentDto dto)
    {
        var comment = await _context.Comments.FindAsync(commentId);
        if (comment == null || comment.TaskId != taskId) return null;

        comment.Text = dto.Text;
        await _context.SaveChangesAsync();
        return MapToDto(comment);
    }



    private static CommentResponseDto MapToDto(Comment comment)
    {
        return new CommentResponseDto
        {
            Id = comment.Id,
            Text = comment.Text,
            CommentedByUserId = comment.CommentedByUserId,
            TaskId = comment.TaskId
        };
    }
}
