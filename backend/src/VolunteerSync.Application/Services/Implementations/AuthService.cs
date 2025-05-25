using AutoMapper;
using VolunteerSync.Application.Common.Exceptions;
using VolunteerSync.Application.DTOs.Auth;
using VolunteerSync.Application.DTOs.Common;
using VolunteerSync.Application.DTOs.Users;
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

            var userDto = _mapper.Map<UserDto>(user);

            var tokenResponse = new TokenResponseDto
            {
                Token = accessToken,
                RefreshToken = refreshToken,
                User = userDto,
                ExpiresIn = 3600 * 24 // 24 hours in seconds
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

            var userDto = _mapper.Map<UserDto>(user);

            var tokenResponse = new TokenResponseDto
            {
                Token = accessToken,
                RefreshToken = refreshToken,
                User = userDto,
                ExpiresIn = 3600 * 24 // 24 hours in seconds
            };

            return ApiResponseDto<TokenResponseDto>.Success(tokenResponse, "Registration successful");
        }
        catch (Exception ex)
        {
            return ApiResponseDto<TokenResponseDto>.ErrorResponse("An error occurred during registration", new List<string> { ex.Message });
        }
    }

    public async Task<ApiResponseDto<RefreshTokenResponseDto>> RefreshTokenAsync(string refreshToken)
    {
        try
        {
            // For this simplified implementation, we'll treat the refresh token as a simple GUID
            // In a real implementation, you would store refresh tokens in database with expiration
            // and validate against that stored value
            
            if (string.IsNullOrEmpty(refreshToken) || refreshToken.Length < 10)
            {
                return ApiResponseDto<RefreshTokenResponseDto>.ErrorResponse("Invalid refresh token");
            }

            // In this simplified version, we need another way to identify the user
            // For now, we'll return an error indicating that refresh tokens need to be properly implemented
            // with user association stored in the database
            
            await Task.CompletedTask; // Remove async warning
            return ApiResponseDto<RefreshTokenResponseDto>.ErrorResponse("Refresh token functionality requires database storage of tokens with user association");
        }
        catch (Exception ex)
        {
            return ApiResponseDto<RefreshTokenResponseDto>.ErrorResponse("An error occurred during token refresh", new List<string> { ex.Message });
        }
    }

    public async Task<ApiResponseDto<bool>> LogoutAsync(string userId)
    {
        try
        {
            // In a real implementation, you would invalidate the refresh token
            // For now, we'll just return success
            await Task.CompletedTask; // Remove async warning
            return ApiResponseDto<bool>.Success(true, "Logout successful");
        }
        catch (Exception ex)
        {
            return ApiResponseDto<bool>.ErrorResponse("An error occurred during logout", new List<string> { ex.Message });
        }
    }
}
