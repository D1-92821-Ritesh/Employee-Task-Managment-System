using System.Text.Json;

namespace TaskService.Services;

public class UserServiceClient : IUserServiceClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<UserServiceClient> _logger;

    public UserServiceClient(HttpClient httpClient, ILogger<UserServiceClient> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<Dictionary<int, string>> GetUserNamesAsync(IEnumerable<int> userIds)
    {
        var result = new Dictionary<int, string>();
        
        if (!userIds.Any())
            return result;

        try
        {
            // Fetch all users from user-service
            var response = await _httpClient.GetAsync("/api/users");
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var users = JsonSerializer.Deserialize<List<UserDto>>(content, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (users != null)
                {
                    var userIdSet = userIds.ToHashSet();
                    foreach (var user in users.Where(u => userIdSet.Contains((int)u.Id)))
                    {
                        result[(int)user.Id] = user.FirstName ?? $"User {user.Id}";
                    }
                }
            }
            else
            {
                _logger.LogWarning("Failed to fetch users from user-service. Status: {StatusCode}", response.StatusCode);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching users from user-service");
        }

        return result;
    }

    // DTO to deserialize user-service response
    private class UserDto
    {
        public long Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
    }
}
