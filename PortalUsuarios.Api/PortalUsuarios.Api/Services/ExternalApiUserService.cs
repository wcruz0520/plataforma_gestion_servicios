using PortalUsuarios.Api.DTOs;
using PortalUsuarios.Api.Models;
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

    public async Task<HttpResponseMessage> CreateUserAsync(CreateExternalUserDto dto, PortalUser? portalUser)
    {
        var client = await CreateAuthenticatedClientAsync(portalUser);
        var url = BuildUrl("/user/");

        return await client.PostAsJsonAsync(url, dto);
    }

    public async Task<HttpResponseMessage> GetUsersAsync(PortalUser? portalUser)
    {
        var client = await CreateAuthenticatedClientAsync(portalUser);
        var url = BuildUrl("/user/");

        return await client.GetAsync(url);
    }

    public async Task<HttpResponseMessage> UpdateUserAsync(int id, UpdateExternalUserDto dto, PortalUser? portalUser)
    {
        var client = await CreateAuthenticatedClientAsync(portalUser);
        var url = BuildUrl($"/user/{id}");

        return await client.PutAsJsonAsync(url, dto);
    }

    public async Task<HttpResponseMessage> UpdateBillingDataAsync(int id, UpdateExternalUserBillingDto dto, PortalUser? portalUser)
    {
        var client = await CreateAuthenticatedClientAsync(portalUser);
        var url = BuildUrl($"/user/{id}/data_factura");

        return await client.PutAsJsonAsync(url, dto);
    }

    private async Task<HttpClient> CreateAuthenticatedClientAsync(PortalUser? portalUser)
    {
        var token = await _authService.GetTokenAsync(portalUser);
        var client = _httpFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        return client;
    }

    private string BuildUrl(string path) => $"{_config["ExternalApi:BaseUrl"]}{path}";
}
