using System.Security.Claims;
using ProiectLicentaFMI.Models;
using ProiectLicentaFMI.Services;

namespace ProiectLicentaFMI;

public static class ServiceCollectionExtensionMethods
{
    public static IServiceCollection AddPresentation(this IServiceCollection services)
    {
        services.AddScoped<ControllerDependencies>();

        return services;
    }

    public static IServiceCollection AddSocializRBusinessLogic(this IServiceCollection services)
    {
        services.AddScoped<ServiceDependencies>();
        services.AddScoped<UserAccountService>();
        services.AddScoped<FoodService>();
        services.AddScoped<RestaurantService>();
        services.AddScoped<CartService>();
        services.AddScoped<OrderService>();
        return services;
    }

    public static IServiceCollection AddSocializRCurrentUser(this IServiceCollection services)
    {
        services.AddScoped(s =>
        {
            var accessor = s.GetService<IHttpContextAccessor>();
            var httpContext = accessor.HttpContext;
            var claims = httpContext.User.Claims;
            var userIdClaim = claims?.FirstOrDefault(c => c.Type == "Id")?.Value;
            var isGood = Guid.TryParse(userIdClaim, out var id);
            var role = claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value==null ? "1" : claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value ;
            return new CurrentUserDto
            {
                UserId = id,
                IsAuthenticated = httpContext.User.Identity.IsAuthenticated,
                Email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value,
                FirstName = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value,
                Role = int.Parse( role )
            };
        });

        return services;
    }
}