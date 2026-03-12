using Microsoft.Extensions.Caching.Memory;
using PortalUsuarios.Api.Models;
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

    public async Task<string> GetTokenAsync(PortalUser? portalUser)
    {
        var externalUser = portalUser?.ExternalApiUsername;
        var externalPassword = portalUser?.ExternalApiPassword;

        if (string.IsNullOrWhiteSpace(externalUser) || string.IsNullOrWhiteSpace(externalPassword))
        {
            externalUser = _config["ExternalApi:User"];
            externalPassword = _config["ExternalApi:Password"];
        }

        if (string.IsNullOrWhiteSpace(externalUser) || string.IsNullOrWhiteSpace(externalPassword))
            throw new InvalidOperationException("No hay credenciales configuradas para el API externo.");

        var cacheKey = $"EXTERNAL_API_TOKEN_{externalUser}";

        if (_cache.TryGetValue(cacheKey, out string? token) && !string.IsNullOrWhiteSpace(token))
        {
            return token;
        }

        var client = _httpFactory.CreateClient();

        var loginRequest = new
        {
            usuario = externalUser,
            password = externalPassword
        };

        var url = $"{_config["ExternalApi:BaseUrl"]}/auth/login";

        var response = await client.PostAsJsonAsync(url, loginRequest);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<LoginResponse>();
        if (result == null || string.IsNullOrWhiteSpace(result.token))
            throw new InvalidOperationException("No fue posible obtener token del API externo.");

        token = result.token;

        _cache.Set(cacheKey, token, TimeSpan.FromMinutes(13));

        return token;
    }
}

public class LoginResponse
{
    public string token { get; set; } = string.Empty;
}
