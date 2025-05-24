using AutoMapper;
using Microsoft.Extensions.Logging;
using VolunteerSync.Application.Common.Exceptions;
using VolunteerSync.Application.DTOs.Common;
using VolunteerSync.Application.DTOs.Registrations;
using VolunteerSync.Application.Services.Interfaces;
using VolunteerSync.Domain.Entities;
using VolunteerSync.Domain.Enums;
using VolunteerSync.Domain.Interfaces.Repositories;
using TaskStatus = VolunteerSync.Domain.Enums.TaskStatus;

namespace VolunteerSync.Application.Services.Implementations;

public class TaskRegistrationService : ITaskRegistrationService
{
    private readonly ITaskRegistrationRepository _registrationRepository;
    private readonly IVolunteerTaskRepository _taskRepository;
    private readonly IUserRepository _userRepository;
    private readonly IOrganizationRepository _organizationRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<TaskRegistrationService> _logger;

    public TaskRegistrationService(
        ITaskRegistrationRepository registrationRepository,
        IVolunteerTaskRepository taskRepository,
        IUserRepository userRepository,
        IOrganizationRepository organizationRepository,
        IMapper mapper,
        ILogger<TaskRegistrationService> logger)
    {
        _registrationRepository = registrationRepository;
        _taskRepository = taskRepository;
        _userRepository = userRepository;
        _organizationRepository = organizationRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<ApiResponseDto<TaskRegistrationDto>> GetByIdAsync(string id)
    {
        try
        {
            var registration = await _registrationRepository.GetByIdAsync(id);
            if (registration == null)
            {
                return ApiResponseDto<TaskRegistrationDto>.Failure("Registration not found", 404);
            }

            var registrationDto = _mapper.Map<TaskRegistrationDto>(registration);
            return ApiResponseDto<TaskRegistrationDto>.Success(registrationDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving registration with id {Id}", id);
            return ApiResponseDto<TaskRegistrationDto>.Failure("Error retrieving registration");
        }
    }

    public async Task<ApiResponseDto<PagedResultDto<TaskRegistrationDto>>> GetAllAsync(int page, int pageSize)
    {
        try
        {
            var registrations = await _registrationRepository.GetAllAsync();
            var pagedRegistrations = registrations
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var registrationDtos = _mapper.Map<List<TaskRegistrationDto>>(pagedRegistrations);
            
            var result = new PagedResultDto<TaskRegistrationDto>
            {
                Items = registrationDtos,
                TotalCount = registrations.Count(),
                Page = page,
                PageSize = pageSize
            };

            return ApiResponseDto<PagedResultDto<TaskRegistrationDto>>.Success(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving registrations");
            return ApiResponseDto<PagedResultDto<TaskRegistrationDto>>.Failure("Error retrieving registrations");
        }
    }

    public async Task<ApiResponseDto<IEnumerable<TaskRegistrationDto>>> GetByTaskIdAsync(string taskId)
    {
        try
        {
            var registrations = await _registrationRepository.GetByTaskIdAsync(taskId);
            var registrationDtos = _mapper.Map<IEnumerable<TaskRegistrationDto>>(registrations);

            return ApiResponseDto<IEnumerable<TaskRegistrationDto>>.Success(registrationDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving registrations for task {TaskId}", taskId);
            return ApiResponseDto<IEnumerable<TaskRegistrationDto>>.Failure("Error retrieving task registrations");
        }
    }

    public async Task<ApiResponseDto<IEnumerable<TaskRegistrationDto>>> GetByUserIdAsync(string userId)
    {
        try
        {
            var registrations = await _registrationRepository.GetByUserIdAsync(userId);
            var registrationDtos = _mapper.Map<IEnumerable<TaskRegistrationDto>>(registrations);

            return ApiResponseDto<IEnumerable<TaskRegistrationDto>>.Success(registrationDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving registrations for user {UserId}", userId);
            return ApiResponseDto<IEnumerable<TaskRegistrationDto>>.Failure("Error retrieving user registrations");
        }
    }

    public async Task<ApiResponseDto<TaskRegistrationDto>> CreateAsync(CreateTaskRegistrationDto createDto)
    {
        try
        {
            // Verify task exists
            var task = await _taskRepository.GetByIdAsync(createDto.TaskId);
            if (task == null)
            {
                return ApiResponseDto<TaskRegistrationDto>.Failure("Task not found", 404);
            }

            // Verify user exists
            var user = await _userRepository.GetByIdAsync(createDto.UserId);
            if (user == null)
            {
                return ApiResponseDto<TaskRegistrationDto>.Failure("User not found", 404);
            }

            // Check if already registered
            var existingRegistration = await _registrationRepository.GetByUserAndTaskAsync(createDto.UserId, createDto.TaskId);
            if (existingRegistration != null)
            {
                return ApiResponseDto<TaskRegistrationDto>.Failure("User already registered for this task", 400);
            }

            // Check if task is accepting registrations
            if (task.Status != TaskStatus.Active)
            {
                return ApiResponseDto<TaskRegistrationDto>.Failure("Task is not accepting registrations", 400);
            }

            if (task.EndDate < DateTime.UtcNow)
            {
                return ApiResponseDto<TaskRegistrationDto>.Failure("Task registration deadline has passed", 400);
            }

            var registration = _mapper.Map<TaskRegistration>(createDto);
            registration.RegistrationDate = DateTime.UtcNow;
            registration.Status = RegistrationStatus.Pending;

            var createdRegistration = await _registrationRepository.CreateAsync(registration);
            var registrationDto = _mapper.Map<TaskRegistrationDto>(createdRegistration);

            _logger.LogInformation("Registration created successfully: {RegistrationId}", createdRegistration.Id);
            return ApiResponseDto<TaskRegistrationDto>.Success(registrationDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating registration");
            return ApiResponseDto<TaskRegistrationDto>.Failure("Error creating registration");
        }
    }

    public async Task<ApiResponseDto<TaskRegistrationDto>> UpdateStatusAsync(string id, RegistrationStatus status)
    {
        try
        {
            var registration = await _registrationRepository.GetByIdAsync(id);
            if (registration == null)
            {
                return ApiResponseDto<TaskRegistrationDto>.Failure("Registration not found", 404);
            }

            registration.Status = status;
            await _registrationRepository.UpdateAsync(registration);
            var registrationDto = _mapper.Map<TaskRegistrationDto>(registration);

            _logger.LogInformation("Registration status updated: {RegistrationId} -> {Status}", id, status);
            return ApiResponseDto<TaskRegistrationDto>.Success(registrationDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating registration status for id {Id}", id);
            return ApiResponseDto<TaskRegistrationDto>.Failure("Error updating registration status");
        }
    }

    public async Task<ApiResponseDto<bool>> DeleteAsync(string id)
    {
        try
        {
            var registration = await _registrationRepository.GetByIdAsync(id);
            if (registration == null)
            {
                return ApiResponseDto<bool>.Failure("Registration not found", 404);
            }

            // Don't allow deletion of approved registrations
            if (registration.Status == RegistrationStatus.Approved)
            {
                return ApiResponseDto<bool>.Failure("Cannot delete approved registration", 400);
            }

            await _registrationRepository.DeleteAsync(id);
            
            _logger.LogInformation("Registration deleted successfully: {RegistrationId}", id);
            return ApiResponseDto<bool>.Success(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting registration with id {Id}", id);
            return ApiResponseDto<bool>.Failure("Error deleting registration");
        }
    }

    public async Task<ApiResponseDto<bool>> ApproveRegistrationAsync(string id)
    {
        try
        {
            var registration = await _registrationRepository.GetByIdAsync(id);
            if (registration == null)
            {
                return ApiResponseDto<bool>.Failure("Registration not found", 404);
            }

            if (registration.Status != RegistrationStatus.Pending)
            {
                return ApiResponseDto<bool>.Failure("Only pending registrations can be approved", 400);
            }

            registration.Status = RegistrationStatus.Approved;
            await _registrationRepository.UpdateAsync(registration);

            _logger.LogInformation("Registration approved: {RegistrationId}", id);
            return ApiResponseDto<bool>.Success(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error approving registration with id {Id}", id);
            return ApiResponseDto<bool>.Failure("Error approving registration");
        }
    }

    public async Task<ApiResponseDto<bool>> RejectRegistrationAsync(string id, string reason)
    {
        try
        {
            var registration = await _registrationRepository.GetByIdAsync(id);
            if (registration == null)
            {
                return ApiResponseDto<bool>.Failure("Registration not found", 404);
            }

            if (registration.Status != RegistrationStatus.Pending)
            {
                return ApiResponseDto<bool>.Failure("Only pending registrations can be rejected", 400);
            }

            registration.Status = RegistrationStatus.Rejected;
            // Note: You might want to add a RejectionReason field to TaskRegistration entity
            await _registrationRepository.UpdateAsync(registration);

            _logger.LogInformation("Registration rejected: {RegistrationId}, Reason: {Reason}", id, reason);
            return ApiResponseDto<bool>.Success(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error rejecting registration with id {Id}", id);
            return ApiResponseDto<bool>.Failure("Error rejecting registration");
        }
    }

    public async Task<ApiResponseDto<IEnumerable<TaskRegistrationDto>>> GetPendingRegistrationsAsync(string organizationId)
    {
        try
        {
            // Get all tasks for the organization
            var tasks = await _taskRepository.GetByOrganizationIdAsync(organizationId);
            var taskIds = tasks.Select(t => t.Id).ToList();

            // Get all pending registrations for these tasks
            var allRegistrations = await _registrationRepository.GetAllAsync();
            var pendingRegistrations = allRegistrations
                .Where(r => taskIds.Contains(r.VolunteerTaskId) && r.Status == RegistrationStatus.Pending)
                .ToList();

            var registrationDtos = _mapper.Map<IEnumerable<TaskRegistrationDto>>(pendingRegistrations);

            return ApiResponseDto<IEnumerable<TaskRegistrationDto>>.Success(registrationDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving pending registrations for organization {OrganizationId}", organizationId);
            return ApiResponseDto<IEnumerable<TaskRegistrationDto>>.Failure("Error retrieving pending registrations");
        }
    }
}
