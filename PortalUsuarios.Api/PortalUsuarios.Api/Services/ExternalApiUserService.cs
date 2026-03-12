using PortalUsuarios.Api.DTOs;
using System.Net.Http.Headers;
using System.Net.Http.Json;

public class ExternalApiUserService
{
    private readonly ExternalApiAuthService _authService;
    private readonly IHttpClientFactory _httpFactory;
    private readonly IConfiguration _config;

    public ExternalApiUserService(
        ExternalApiAuthService authService,
        IHttpClientFactory httpFactory,
        IConfiguration config)
    {
        _authService = authService;
        _httpFactory = httpFactory;
        _config = config;
    }

    public async Task<HttpResponseMessage> CreateUserAsync(CreateExternalUserDto dto)
    {
        var token = await _authService.GetTokenAsync();

        var client = _httpFactory.CreateClient();

        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var url = $"{_config["ExternalApi:BaseUrl"]}/user/";

        return await client.PostAsJsonAsync(url, dto);
    }
}