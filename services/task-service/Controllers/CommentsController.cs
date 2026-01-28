using Microsoft.AspNetCore.Mvc;
using TaskService.DTOs;
using TaskService.Services;

namespace TaskService.Controllers;

[ApiController]
[Route("api/tasks/{taskId:int}/comments")]
[Produces("application/json")]
public class CommentsController : ControllerBase
{
    private readonly ICommentService _commentService;

    public CommentsController(ICommentService commentService)
    {
        _commentService = commentService;
    }

    /// <summary>
    /// Add a comment to a task
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(CommentResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CommentResponseDto>> Create([FromRoute] int taskId, [FromBody] CreateCommentDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var comment = await _commentService.CreateCommentAsync(taskId, dto);
            // Get endpoints removed, returning 201 with body
            return StatusCode(StatusCodes.Status201Created, comment);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update a comment
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(CommentResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CommentResponseDto>> Update([FromRoute] int taskId, [FromRoute] int id, [FromBody] UpdateCommentDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var comment = await _commentService.UpdateCommentAsync(taskId, id, dto);
        if (comment == null)
            return NotFound(new { message = $"Comment with ID {id} not found for Task {taskId}" });
        return Ok(comment);
    }
}
