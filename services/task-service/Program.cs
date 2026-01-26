using Microsoft.EntityFrameworkCore;
using TaskService.Data;
using TaskService.Messaging;
using TaskService.Services;
using Steeltoe.Discovery.Client;

namespace TaskService;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add DbContext with SQL Server
        builder.Services.AddDbContext<TaskDbContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

        // Register RabbitMQ settings
        builder.Services.Configure<RabbitMQSettings>(builder.Configuration.GetSection("RabbitMQ"));

        // Register Discovery Client
        builder.Services.AddDiscoveryClient(builder.Configuration);

        // Register Services
        builder.Services.AddScoped<ITaskService, TaskServiceImpl>();
        builder.Services.AddScoped<ICommentService, CommentServiceImpl>();

        // Register RabbitMQ Publisher
        builder.Services.AddSingleton<IMessagePublisher, RabbitMQPublisher>();

        // Add Controllers with Enum String Conversion
        // Enforce lowercase URLs
        builder.Services.AddRouting(options => options.LowercaseUrls = true);

        builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
            });



        var app = builder.Build();

        // Configure the HTTP request pipeline
        if (app.Environment.IsDevelopment())
        {

        }

        app.UseHttpsRedirection();
        app.UseAuthorization();
        app.MapControllers();

        // Apply migrations on startup
        using (var scope = app.Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<TaskDbContext>();
            try
            {
                dbContext.Database.Migrate();
            }
            catch
            {
                // Silently ignore migration errors
            }
        }

        app.Run();
    }
}
