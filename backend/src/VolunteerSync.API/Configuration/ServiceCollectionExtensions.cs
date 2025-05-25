using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using VolunteerSync.Application.Mappings;
using VolunteerSync.Application.Services.Interfaces;
using VolunteerSync.Application.Services.Implementations;
using VolunteerSync.Domain.Interfaces.Repositories;
using VolunteerSync.Domain.Interfaces.Services;
using VolunteerSync.Infrastructure.Data;
using VolunteerSync.Infrastructure.Repositories;
using VolunteerSync.Infrastructure.Services;
using FluentValidation;
using VolunteerSync.Application.Validators;
using VolunteerSync.API.Configuration;

namespace VolunteerSync.API.Configuration;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Database settings
        services.Configure<DatabaseSettings>(configuration.GetSection("DatabaseSettings"));
        
        // JWT settings
        services.Configure<JwtSettings>(configuration.GetSection("Jwt"));
        
        // MongoDB context
        services.AddSingleton<IMongoContext, MongoContext>();
        
        // Repositories
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IOrganizationRepository, OrganizationRepository>();
        services.AddScoped<IVolunteerTaskRepository, VolunteerTaskRepository>();
        services.AddScoped<ITaskRegistrationRepository, TaskRegistrationRepository>();
        services.AddScoped<INotificationRepository, NotificationRepository>();
        
        // Services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IOrganizationService, OrganizationService>();
        services.AddScoped<IVolunteerTaskService, VolunteerTaskService>();
        services.AddScoped<ITaskRegistrationService, TaskRegistrationService>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<IStatsService, StatsService>();
        
        // Infrastructure services
        services.AddScoped<PasswordHashingService>();
        services.AddScoped<TokenService>();
        
        // AutoMapper
        services.AddAutoMapper(typeof(MappingProfile));
        
        // FluentValidation
        services.AddValidatorsFromAssemblyContaining<CreateUserValidator>();
        
        return services;
    }

    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtSettings = configuration.GetSection("Jwt").Get<JwtSettings>();
        var key = Encoding.ASCII.GetBytes(jwtSettings?.Secret ?? throw new InvalidOperationException("JWT Secret not configured"));

        services.AddAuthentication(x =>
        {
            x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(x =>
        {
            x.RequireHttpsMetadata = false;
            x.SaveToken = true;
            x.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = jwtSettings.Issuer,
                ValidateAudience = true,
                ValidAudience = jwtSettings.Audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
        });

        return services;
    }

    public static IServiceCollection AddCorsPolicy(this IServiceCollection services, IConfiguration configuration)
    {
        var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();

        services.AddCors(options =>
        {
            options.AddPolicy("DefaultPolicy", builder =>
            {
                builder.WithOrigins(allowedOrigins)
                       .AllowAnyMethod()
                       .AllowAnyHeader()
                       .AllowCredentials();
            });
        });

        return services;
    }
}
