using FluentValidation;
using VolunteerSync.Application.DTOs.Registrations;

namespace VolunteerSync.Application.Validators;

public class CreateTaskRegistrationValidator : AbstractValidator<CreateTaskRegistrationDto>
{
    public CreateTaskRegistrationValidator()
    {
        RuleFor(x => x.TaskId)
            .NotEmpty()
            .WithMessage("Task ID is required");

        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("User ID is required");

        RuleFor(x => x.ApplicationMessage)
            .MaximumLength(1000)
            .WithMessage("Application message cannot exceed 1000 characters");
    }
}
