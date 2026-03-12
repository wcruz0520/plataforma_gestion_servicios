using Microsoft.Extensions.Caching.Memory;
using System.Net.Http.Json;

public class ExternalApiAuthService
{
    private readonly IMemoryCache _cache;
    private readonly IHttpClientFactory _httpFactory;
    private readonly IConfiguration _config;

    public ExternalApiAuthService(
        IMemoryCache cache,
        IHttpClientFactory httpFactory,
        IConfiguration config)
    {
        _cache = cache;
        _httpFactory = httpFactory;
        _config = config;
    }

    public async Task<string> GetTokenAsync()
    {
        if (_cache.TryGetValue("EXTERNAL_API_TOKEN", out string token))
        {
            return token;
        }

        var client = _httpFactory.CreateClient();

        var loginRequest = new
        {
            usuario = _config["ExternalApi:User"],
            password = _config["ExternalApi:Password"]
        };

        var url = $"{_config["ExternalApi:BaseUrl"]}/auth/login";

        var response = await client.PostAsJsonAsync(url, loginRequest);

        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<LoginResponse>();

        token = result.token;

        _cache.Set("EXTERNAL_API_TOKEN", token,
            TimeSpan.FromMinutes(13));

        return token;
    }
}

public class LoginResponse
{
    public string token { get; set; }
}