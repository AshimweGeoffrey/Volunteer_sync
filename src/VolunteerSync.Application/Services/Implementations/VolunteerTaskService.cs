using AutoMapper;
using Microsoft.Extensions.Logging;
using VolunteerSync.Application.Common.Exceptions;
using VolunteerSync.Application.DTOs.Common;
using VolunteerSync.Application.DTOs.Tasks;
using VolunteerSync.Application.Services.Interfaces;
using VolunteerSync.Domain.Entities;
using VolunteerSync.Domain.Enums;
using VolunteerSync.Domain.Interfaces.Repositories;

namespace VolunteerSync.Application.Services.Implementations;

public class VolunteerTaskService : IVolunteerTaskService
{
    private readonly IVolunteerTaskRepository _taskRepository;
    private readonly ITaskRegistrationRepository _registrationRepository;
    private readonly IOrganizationRepository _organizationRepository;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<VolunteerTaskService> _logger;

    public VolunteerTaskService(
        IVolunteerTaskRepository taskRepository,
        ITaskRegistrationRepository registrationRepository,
        IOrganizationRepository organizationRepository,
        IUserRepository userRepository,
        IMapper mapper,
        ILogger<VolunteerTaskService> logger)
    {
        _taskRepository = taskRepository;
        _registrationRepository = registrationRepository;
        _organizationRepository = organizationRepository;
        _userRepository = userRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<ApiResponseDto<VolunteerTaskDto>> GetByIdAsync(string id)
    {
        try
        {
            var task = await _taskRepository.GetByIdAsync(id);
            if (task == null)
            {
                return ApiResponseDto<VolunteerTaskDto>.Failure("Task not found", 404);
            }

            var taskDto = _mapper.Map<VolunteerTaskDto>(task);
            return ApiResponseDto<VolunteerTaskDto>.Success(taskDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving task with id {Id}", id);
            return ApiResponseDto<VolunteerTaskDto>.Failure("Error retrieving task");
        }
    }

    public async Task<ApiResponseDto<PagedResultDto<VolunteerTaskDto>>> GetAllAsync(int page, int pageSize)
    {
        try
        {
            var tasks = await _taskRepository.GetAllAsync();
            var pagedTasks = tasks
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var taskDtos = _mapper.Map<List<VolunteerTaskDto>>(pagedTasks);
            
            var result = new PagedResultDto<VolunteerTaskDto>
            {
                Items = taskDtos,
                TotalCount = tasks.Count(),
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(tasks.Count() / (double)pageSize)
            };

            return ApiResponseDto<PagedResultDto<VolunteerTaskDto>>.Success(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving tasks");
            return ApiResponseDto<PagedResultDto<VolunteerTaskDto>>.Failure("Error retrieving tasks");
        }
    }

    public async Task<ApiResponseDto<VolunteerTaskDto>> CreateAsync(CreateVolunteerTaskDto createTaskDto, string userId)
    {
        try
        {
            // Verify user exists and get organization
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return ApiResponseDto<VolunteerTaskDto>.Failure("User not found", 404);
            }

            // Verify organization exists
            var organization = await _organizationRepository.GetByIdAsync(createTaskDto.OrganizationId);
            if (organization == null)
            {
                return ApiResponseDto<VolunteerTaskDto>.Failure("Organization not found", 404);
            }

            // Check if user can create tasks for this organization
            if (user.Role != UserRole.OrganizationAdmin && 
                user.Role != UserRole.OrganizationMember && 
                user.OrganizationId != createTaskDto.OrganizationId)
            {
                return ApiResponseDto<VolunteerTaskDto>.Failure("Not authorized to create tasks for this organization", 403);
            }

            var task = _mapper.Map<VolunteerTask>(createTaskDto);
            task.CreatedBy = userId;
            task.CreatedAt = DateTime.UtcNow;
            task.Status = TaskStatus.Active;

            var createdTask = await _taskRepository.CreateAsync(task);
            var taskDto = _mapper.Map<VolunteerTaskDto>(createdTask);

            _logger.LogInformation("Task created successfully: {TaskId}", createdTask.Id);
            return ApiResponseDto<VolunteerTaskDto>.Success(taskDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating task");
            return ApiResponseDto<VolunteerTaskDto>.Failure("Error creating task");
        }
    }

    public async Task<ApiResponseDto<VolunteerTaskDto>> UpdateAsync(string id, CreateVolunteerTaskDto updateTaskDto)
    {
        try
        {
            var existingTask = await _taskRepository.GetByIdAsync(id);
            if (existingTask == null)
            {
                return ApiResponseDto<VolunteerTaskDto>.Failure("Task not found", 404);
            }

            _mapper.Map(updateTaskDto, existingTask);
            existingTask.UpdatedAt = DateTime.UtcNow;

            var updatedTask = await _taskRepository.UpdateAsync(existingTask);
            var taskDto = _mapper.Map<VolunteerTaskDto>(updatedTask);

            _logger.LogInformation("Task updated successfully: {TaskId}", id);
            return ApiResponseDto<VolunteerTaskDto>.Success(taskDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating task with id {Id}", id);
            return ApiResponseDto<VolunteerTaskDto>.Failure("Error updating task");
        }
    }

    public async Task<ApiResponseDto<bool>> DeleteAsync(string id)
    {
        try
        {
            var task = await _taskRepository.GetByIdAsync(id);
            if (task == null)
            {
                return ApiResponseDto<bool>.Failure("Task not found", 404);
            }

            await _taskRepository.DeleteAsync(id);
            
            _logger.LogInformation("Task deleted successfully: {TaskId}", id);
            return ApiResponseDto<bool>.Success(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting task with id {Id}", id);
            return ApiResponseDto<bool>.Failure("Error deleting task");
        }
    }

    public async Task<ApiResponseDto<PagedResultDto<VolunteerTaskDto>>> SearchAsync(string searchTerm, int page, int pageSize)
    {
        try
        {
            var tasks = await _taskRepository.SearchByTermAsync(searchTerm);
            var pagedTasks = tasks
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var taskDtos = _mapper.Map<List<VolunteerTaskDto>>(pagedTasks);
            
            var result = new PagedResultDto<VolunteerTaskDto>
            {
                Items = taskDtos,
                TotalCount = tasks.Count(),
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(tasks.Count() / (double)pageSize)
            };

            return ApiResponseDto<PagedResultDto<VolunteerTaskDto>>.Success(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching tasks with term {SearchTerm}", searchTerm);
            return ApiResponseDto<PagedResultDto<VolunteerTaskDto>>.Failure("Error searching tasks");
        }
    }

    public async Task<ApiResponseDto<IEnumerable<VolunteerTaskDto>>> GetByOrganizationAsync(string organizationId)
    {
        try
        {
            var tasks = await _taskRepository.GetByOrganizationIdAsync(organizationId);
            var taskDtos = _mapper.Map<IEnumerable<VolunteerTaskDto>>(tasks);

            return ApiResponseDto<IEnumerable<VolunteerTaskDto>>.Success(taskDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving tasks for organization {OrganizationId}", organizationId);
            return ApiResponseDto<IEnumerable<VolunteerTaskDto>>.Failure("Error retrieving organization tasks");
        }
    }

    public async Task<ApiResponseDto<IEnumerable<VolunteerTaskDto>>> GetByCreatedByAsync(string userId)
    {
        try
        {
            var tasks = await _taskRepository.GetByCreatedByAsync(userId);
            var taskDtos = _mapper.Map<IEnumerable<VolunteerTaskDto>>(tasks);

            return ApiResponseDto<IEnumerable<VolunteerTaskDto>>.Success(taskDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving tasks created by user {UserId}", userId);
            return ApiResponseDto<IEnumerable<VolunteerTaskDto>>.Failure("Error retrieving user tasks");
        }
    }

    public async Task<ApiResponseDto<IEnumerable<VolunteerTaskDto>>> GetByCategoryAsync(TaskCategory category)
    {
        try
        {
            var tasks = await _taskRepository.GetByCategoryAsync(category);
            var taskDtos = _mapper.Map<IEnumerable<VolunteerTaskDto>>(tasks);

            return ApiResponseDto<IEnumerable<VolunteerTaskDto>>.Success(taskDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving tasks for category {Category}", category);
            return ApiResponseDto<IEnumerable<VolunteerTaskDto>>.Failure("Error retrieving category tasks");
        }
    }

    public async Task<ApiResponseDto<IEnumerable<VolunteerTaskDto>>> GetFeaturedAsync()
    {
        try
        {
            var tasks = await _taskRepository.GetFeaturedAsync();
            var taskDtos = _mapper.Map<IEnumerable<VolunteerTaskDto>>(tasks);

            return ApiResponseDto<IEnumerable<VolunteerTaskDto>>.Success(taskDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving featured tasks");
            return ApiResponseDto<IEnumerable<VolunteerTaskDto>>.Failure("Error retrieving featured tasks");
        }
    }

    public async Task<ApiResponseDto<bool>> RegisterForTaskAsync(string taskId, string userId, string applicationMessage)
    {
        try
        {
            // Check if task exists
            var task = await _taskRepository.GetByIdAsync(taskId);
            if (task == null)
            {
                return ApiResponseDto<bool>.Failure("Task not found", 404);
            }

            // Check if user exists
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return ApiResponseDto<bool>.Failure("User not found", 404);
            }

            // Check if already registered
            var existingRegistration = await _registrationRepository.GetByTaskAndUserAsync(taskId, userId);
            if (existingRegistration != null)
            {
                return ApiResponseDto<bool>.Failure("Already registered for this task", 400);
            }

            // Check if task is still accepting registrations
            if (task.Status != TaskStatus.Active)
            {
                return ApiResponseDto<bool>.Failure("Task is not accepting registrations", 400);
            }

            if (task.EndDate < DateTime.UtcNow)
            {
                return ApiResponseDto<bool>.Failure("Task registration deadline has passed", 400);
            }

            // Create registration
            var registration = new TaskRegistration
            {
                TaskId = taskId,
                UserId = userId,
                ApplicationMessage = applicationMessage,
                RegistrationDate = DateTime.UtcNow,
                Status = RegistrationStatus.Pending
            };

            await _registrationRepository.CreateAsync(registration);

            _logger.LogInformation("User {UserId} registered for task {TaskId}", userId, taskId);
            return ApiResponseDto<bool>.Success(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error registering user {UserId} for task {TaskId}", userId, taskId);
            return ApiResponseDto<bool>.Failure("Error registering for task");
        }
    }

    public async Task<ApiResponseDto<bool>> UnregisterFromTaskAsync(string taskId, string userId)
    {
        try
        {
            var registration = await _registrationRepository.GetByTaskAndUserAsync(taskId, userId);
            if (registration == null)
            {
                return ApiResponseDto<bool>.Failure("Registration not found", 404);
            }

            if (registration.Status == RegistrationStatus.Confirmed)
            {
                return ApiResponseDto<bool>.Failure("Cannot unregister from confirmed task", 400);
            }

            await _registrationRepository.DeleteAsync(registration.Id);

            _logger.LogInformation("User {UserId} unregistered from task {TaskId}", userId, taskId);
            return ApiResponseDto<bool>.Success(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error unregistering user {UserId} from task {TaskId}", userId, taskId);
            return ApiResponseDto<bool>.Failure("Error unregistering from task");
        }
    }
}
