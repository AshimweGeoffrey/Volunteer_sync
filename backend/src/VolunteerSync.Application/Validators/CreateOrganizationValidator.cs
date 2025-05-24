using FluentValidation;
using VolunteerSync.Application.DTOs.Organizations;

namespace VolunteerSync.Application.Validators;

public class CreateOrganizationValidator : AbstractValidator<CreateOrganizationDto>
{
    public CreateOrganizationValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Organization name is required")
            .MaximumLength(100).WithMessage("Organization name must not exceed 100 characters");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required")
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters");

        RuleFor(x => x.ContactInfo.Email)
            .NotEmpty().WithMessage("Contact email is required")
            .EmailAddress().WithMessage("Contact email must be a valid email address");
    }
}
