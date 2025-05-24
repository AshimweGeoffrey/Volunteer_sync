using AutoMapper;
using VolunteerSync.Application.Common.Exceptions;
using VolunteerSync.Application.DTOs.Common;
using VolunteerSync.Application.DTOs.Users;
using VolunteerSync.Application.Services.Interfaces;
using VolunteerSync.Domain.Entities;
using VolunteerSync.Domain.Interfaces.Repositories;
using VolunteerSync.Infrastructure.Services;

namespace VolunteerSync.Application.Services.Implementations;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly PasswordHashingService _passwordHashingService;
    private readonly IMapper _mapper;

    public UserService(
        IUserRepository userRepository,
        PasswordHashingService passwordHashingService,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _passwordHashingService = passwordHashingService;
        _mapper = mapper;
    }

    public async Task<ApiResponseDto<UserDto>> GetByIdAsync(string id)
    {
        try
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                throw new NotFoundException("User", id);
            }

            var userDto = _mapper.Map<UserDto>(user);
            return ApiResponseDto<UserDto>.SuccessResponse(userDto);
        }
        catch (Exception ex)
        {
            return ApiResponseDto<UserDto>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponseDto<UserDto>> GetByEmailAsync(string email)
    {
        try
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
            {
                throw new NotFoundException("User with email", email);
            }

            var userDto = _mapper.Map<UserDto>(user);
            return ApiResponseDto<UserDto>.SuccessResponse(userDto);
        }
        catch (Exception ex)
        {
            return ApiResponseDto<UserDto>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponseDto<PagedResultDto<UserDto>>> GetAllAsync(int page, int pageSize)
    {
        try
        {
            var users = await _userRepository.GetAllAsync();
            var totalCount = users.Count();
            var pagedUsers = users.Skip((page - 1) * pageSize).Take(pageSize);
            
            var userDtos = _mapper.Map<IEnumerable<UserDto>>(pagedUsers);
            
            var pagedResult = new PagedResultDto<UserDto>
            {
                Items = userDtos,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };

            return ApiResponseDto<PagedResultDto<UserDto>>.SuccessResponse(pagedResult);
        }
        catch (Exception ex)
        {
            return ApiResponseDto<PagedResultDto<UserDto>>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponseDto<UserDto>> CreateAsync(CreateUserDto createUserDto)
    {
        try
        {
            // Check if email already exists
            if (await _userRepository.EmailExistsAsync(createUserDto.Email))
            {
                return ApiResponseDto<UserDto>.ErrorResponse("Email already exists");
            }

            var user = _mapper.Map<User>(createUserDto);
            user.PasswordHash = _passwordHashingService.HashPassword(createUserDto.Password);
            user.DateJoined = DateTime.UtcNow;
            user.IsActive = true;

            await _userRepository.CreateAsync(user);

            var userDto = _mapper.Map<UserDto>(user);
            return ApiResponseDto<UserDto>.SuccessResponse(userDto, "User created successfully");
        }
        catch (Exception ex)
        {
            return ApiResponseDto<UserDto>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponseDto<UserDto>> UpdateAsync(string id, CreateUserDto updateUserDto)
    {
        try
        {
            var existingUser = await _userRepository.GetByIdAsync(id);
            if (existingUser == null)
            {
                throw new NotFoundException("User", id);
            }

            // Check if email is being changed and if it already exists
            if (existingUser.Email != updateUserDto.Email && await _userRepository.EmailExistsAsync(updateUserDto.Email))
            {
                return ApiResponseDto<UserDto>.ErrorResponse("Email already exists");
            }

            _mapper.Map(updateUserDto, existingUser);
            
            // Don't update password hash if password is not provided
            if (!string.IsNullOrEmpty(updateUserDto.Password))
            {
                existingUser.PasswordHash = _passwordHashingService.HashPassword(updateUserDto.Password);
            }

            await _userRepository.UpdateAsync(existingUser);

            var userDto = _mapper.Map<UserDto>(existingUser);
            return ApiResponseDto<UserDto>.SuccessResponse(userDto, "User updated successfully");
        }
        catch (Exception ex)
        {
            return ApiResponseDto<UserDto>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponseDto<bool>> DeleteAsync(string id)
    {
        try
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                throw new NotFoundException("User", id);
            }

            await _userRepository.DeleteAsync(id);
            return ApiResponseDto<bool>.SuccessResponse(true, "User deleted successfully");
        }
        catch (Exception ex)
        {
            return ApiResponseDto<bool>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponseDto<PagedResultDto<UserDto>>> SearchAsync(string searchTerm, int page, int pageSize)
    {
        try
        {
            var users = await _userRepository.SearchUsersAsync(searchTerm, page, pageSize);
            var userDtos = _mapper.Map<IEnumerable<UserDto>>(users);
            
            // For simplicity, we'll use the count of returned items as total count
            // In a real implementation, you'd want a separate count query
            var pagedResult = new PagedResultDto<UserDto>
            {
                Items = userDtos,
                TotalCount = users.Count(),
                Page = page,
                PageSize = pageSize
            };

            return ApiResponseDto<PagedResultDto<UserDto>>.SuccessResponse(pagedResult);
        }
        catch (Exception ex)
        {
            return ApiResponseDto<PagedResultDto<UserDto>>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponseDto<IEnumerable<UserDto>>> GetByOrganizationAsync(string organizationId)
    {
        try
        {
            var users = await _userRepository.GetByOrganizationIdAsync(organizationId);
            var userDtos = _mapper.Map<IEnumerable<UserDto>>(users);
            return ApiResponseDto<IEnumerable<UserDto>>.SuccessResponse(userDtos);
        }
        catch (Exception ex)
        {
            return ApiResponseDto<IEnumerable<UserDto>>.ErrorResponse(ex.Message);
        }
    }
}
