using AutoMapper;
using VolunteerSync.Application.Common.Exceptions;
using VolunteerSync.Application.DTOs.Common;
using VolunteerSync.Application.DTOs.Organizations;
using VolunteerSync.Application.Services.Interfaces;
using VolunteerSync.Domain.Entities;
using VolunteerSync.Domain.Interfaces.Repositories;

namespace VolunteerSync.Application.Services.Implementations;

public class OrganizationService : IOrganizationService
{
    private readonly IOrganizationRepository _organizationRepository;
    private readonly IMapper _mapper;

    public OrganizationService(IOrganizationRepository organizationRepository, IMapper mapper)
    {
        _organizationRepository = organizationRepository;
        _mapper = mapper;
    }

    public async Task<ApiResponseDto<OrganizationDto>> GetByIdAsync(string id)
    {
        try
        {
            var organization = await _organizationRepository.GetByIdAsync(id);
            if (organization == null)
            {
                throw new NotFoundException("Organization", id);
            }

            var organizationDto = _mapper.Map<OrganizationDto>(organization);
            return ApiResponseDto<OrganizationDto>.Success(organizationDto);
        }
        catch (Exception ex)
        {
            return ApiResponseDto<OrganizationDto>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponseDto<PagedResultDto<OrganizationDto>>> GetAllAsync(int page, int pageSize)
    {
        try
        {
            var organizations = await _organizationRepository.GetAllAsync();
            var totalCount = organizations.Count();
            var pagedOrganizations = organizations.Skip((page - 1) * pageSize).Take(pageSize);
            
            var organizationDtos = _mapper.Map<IEnumerable<OrganizationDto>>(pagedOrganizations);
            
            var pagedResult = new PagedResultDto<OrganizationDto>
            {
                Items = organizationDtos,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };

            return ApiResponseDto<PagedResultDto<OrganizationDto>>.Success(pagedResult);
        }
        catch (Exception ex)
        {
            return ApiResponseDto<PagedResultDto<OrganizationDto>>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponseDto<OrganizationDto>> CreateAsync(CreateOrganizationDto createOrganizationDto)
    {
        try
        {
            var organization = _mapper.Map<Organization>(createOrganizationDto);
            organization.IsActive = true;
            organization.IsVerified = false;
            organization.MemberCount = 0;
            organization.TaskCount = 0;

            await _organizationRepository.CreateAsync(organization);

            var organizationDto = _mapper.Map<OrganizationDto>(organization);
            return ApiResponseDto<OrganizationDto>.Success(organizationDto, "Organization created successfully");
        }
        catch (Exception ex)
        {
            return ApiResponseDto<OrganizationDto>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponseDto<OrganizationDto>> UpdateAsync(string id, CreateOrganizationDto updateOrganizationDto)
    {
        try
        {
            var existingOrganization = await _organizationRepository.GetByIdAsync(id);
            if (existingOrganization == null)
            {
                throw new NotFoundException("Organization", id);
            }

            _mapper.Map(updateOrganizationDto, existingOrganization);
            await _organizationRepository.UpdateAsync(existingOrganization);

            var organizationDto = _mapper.Map<OrganizationDto>(existingOrganization);
            return ApiResponseDto<OrganizationDto>.Success(organizationDto, "Organization updated successfully");
        }
        catch (Exception ex)
        {
            return ApiResponseDto<OrganizationDto>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponseDto<bool>> DeleteAsync(string id)
    {
        try
        {
            var organization = await _organizationRepository.GetByIdAsync(id);
            if (organization == null)
            {
                throw new NotFoundException("Organization", id);
            }

            await _organizationRepository.DeleteAsync(id);
            return ApiResponseDto<bool>.Success(true, "Organization deleted successfully");
        }
        catch (Exception ex)
        {
            return ApiResponseDto<bool>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponseDto<PagedResultDto<OrganizationDto>>> SearchAsync(string searchTerm, int page, int pageSize)
    {
        try
        {
            var organizations = await _organizationRepository.SearchOrganizationsAsync(searchTerm, page, pageSize);
            var organizationDtos = _mapper.Map<IEnumerable<OrganizationDto>>(organizations);
            
            var pagedResult = new PagedResultDto<OrganizationDto>
            {
                Items = organizationDtos,
                TotalCount = organizations.Count(),
                Page = page,
                PageSize = pageSize
            };

            return ApiResponseDto<PagedResultDto<OrganizationDto>>.Success(pagedResult);
        }
        catch (Exception ex)
        {
            return ApiResponseDto<PagedResultDto<OrganizationDto>>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponseDto<IEnumerable<OrganizationDto>>> GetVerifiedAsync()
    {
        try
        {
            var organizations = await _organizationRepository.GetVerifiedOrganizationsAsync();
            var organizationDtos = _mapper.Map<IEnumerable<OrganizationDto>>(organizations);
            return ApiResponseDto<IEnumerable<OrganizationDto>>.Success(organizationDtos);
        }
        catch (Exception ex)
        {
            return ApiResponseDto<IEnumerable<OrganizationDto>>.ErrorResponse(ex.Message);
        }
    }

    public async Task<ApiResponseDto<bool>> VerifyAsync(string id)
    {
        try
        {
            var organization = await _organizationRepository.GetByIdAsync(id);
            if (organization == null)
            {
                throw new NotFoundException("Organization", id);
            }

            organization.IsVerified = true;
            await _organizationRepository.UpdateAsync(organization);

            return ApiResponseDto<bool>.Success(true, "Organization verified successfully");
        }
        catch (Exception ex)
        {
            return ApiResponseDto<bool>.ErrorResponse(ex.Message);
        }
    }
}
