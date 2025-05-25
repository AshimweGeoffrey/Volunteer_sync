using AutoMapper;
using VolunteerSync.Application.DTOs.Auth;
using VolunteerSync.Application.DTOs.Notifications;
using VolunteerSync.Application.DTOs.Organizations;
using VolunteerSync.Application.DTOs.Registrations;
using VolunteerSync.Application.DTOs.Tasks;
using VolunteerSync.Application.DTOs.Users;
using VolunteerSync.Domain.Entities;

namespace VolunteerSync.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // User mappings
        CreateMap<User, UserDto>();
        CreateMap<CreateUserDto, User>();
        CreateMap<RegisterRequestDto, User>();

        // Organization mappings
        CreateMap<Organization, OrganizationDto>();
        CreateMap<CreateOrganizationDto, Organization>();

        // VolunteerTask mappings
        CreateMap<VolunteerTask, VolunteerTaskDto>();
        CreateMap<CreateVolunteerTaskDto, VolunteerTask>();

        // TaskRegistration mappings
        CreateMap<TaskRegistration, TaskRegistrationDto>()
            .ForMember(dest => dest.TaskId, opt => opt.MapFrom(src => src.VolunteerTaskId));
        CreateMap<CreateTaskRegistrationDto, TaskRegistration>()
            .ForMember(dest => dest.VolunteerTaskId, opt => opt.MapFrom(src => src.TaskId));

        // Notification mappings
        CreateMap<Notification, NotificationDto>();
        CreateMap<CreateNotificationDto, Notification>();
    }
}
