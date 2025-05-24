using AutoMapper;
using VolunteerSync.Application.Common.Exceptions;
using VolunteerSync.Application.DTOs.Auth;
using VolunteerSync.Application.DTOs.Common;
using VolunteerSync.Application.Services.Interfaces;
using VolunteerSync.Domain.Entities;
using VolunteerSync.Domain.Interfaces.Repositories;
using VolunteerSync.Infrastructure.Services;

namespace VolunteerSync.Application.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly PasswordHashingService _passwordHashingService;
    private readonly TokenService _tokenService;
    private readonly IMapper _mapper;

    public AuthService(
        IUserRepository userRepository,
        PasswordHashingService passwordHashingService,
        TokenService tokenService,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _passwordHashingService = passwordHashingService;
        _tokenService = tokenService;
        _mapper = mapper;
    }

    public async Task<ApiResponseDto<TokenResponseDto>> LoginAsync(LoginRequestDto loginRequest)
    {
        try
        {
            var user = await _userRepository.GetByEmailAsync(loginRequest.Email);
            if (user == null)
            {
                return ApiResponseDto<TokenResponseDto>.ErrorResponse("Invalid email or password");
            }

            if (!_passwordHashingService.VerifyPassword(loginRequest.Password, user.PasswordHash))
            {
                return ApiResponseDto<TokenResponseDto>.ErrorResponse("Invalid email or password");
            }

            if (!user.IsActive)
            {
                return ApiResponseDto<TokenResponseDto>.ErrorResponse("Account is deactivated");
            }

            var accessToken = _tokenService.GenerateAccessToken(user.Id, user.Email, user.Role.ToString());
            var refreshToken = _tokenService.GenerateRefreshToken();

            // Update last login
            user.LastLoginAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);

            var tokenResponse = new TokenResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddHours(24),
                UserId = user.Id,
                Email = user.Email,
                Role = user.Role.ToString()
            };

            return ApiResponseDto<TokenResponseDto>.Success(tokenResponse, "Login successful");
        }
        catch (Exception ex)
        {
            return ApiResponseDto<TokenResponseDto>.ErrorResponse("An error occurred during login", new List<string> { ex.Message });
        }
    }

    public async Task<ApiResponseDto<TokenResponseDto>> RegisterAsync(RegisterRequestDto registerRequest)
    {
        try
        {
            // Check if email already exists
            if (await _userRepository.EmailExistsAsync(registerRequest.Email))
            {
                return ApiResponseDto<TokenResponseDto>.ErrorResponse("Email already exists");
            }

            // Create new user
            var user = _mapper.Map<User>(registerRequest);
            user.PasswordHash = _passwordHashingService.HashPassword(registerRequest.Password);
            user.DateJoined = DateTime.UtcNow;
            user.IsActive = true;

            await _userRepository.CreateAsync(user);

            var accessToken = _tokenService.GenerateAccessToken(user.Id, user.Email, user.Role.ToString());
            var refreshToken = _tokenService.GenerateRefreshToken();

            var tokenResponse = new TokenResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddHours(24),
                UserId = user.Id,
                Email = user.Email,
                Role = user.Role.ToString()
            };

            return ApiResponseDto<TokenResponseDto>.Success(tokenResponse, "Registration successful");
        }
        catch (Exception ex)
        {
            return ApiResponseDto<TokenResponseDto>.ErrorResponse("An error occurred during registration", new List<string> { ex.Message });
        }
    }

    public async Task<ApiResponseDto<TokenResponseDto>> RefreshTokenAsync(string refreshToken)
    {
        try
        {
            // In a real implementation, you would validate the refresh token against a stored value
            // For now, we'll just return an error
            return ApiResponseDto<TokenResponseDto>.ErrorResponse("Refresh token functionality not fully implemented");
        }
        catch (Exception ex)
        {
            return ApiResponseDto<TokenResponseDto>.ErrorResponse("An error occurred during token refresh", new List<string> { ex.Message });
        }
    }

    public async Task<ApiResponseDto<bool>> LogoutAsync(string userId)
    {
        try
        {
            // In a real implementation, you would invalidate the refresh token
            // For now, we'll just return success
            return ApiResponseDto<bool>.Success(true, "Logout successful");
        }
        catch (Exception ex)
        {
            return ApiResponseDto<bool>.ErrorResponse("An error occurred during logout", new List<string> { ex.Message });
        }
    }
}
