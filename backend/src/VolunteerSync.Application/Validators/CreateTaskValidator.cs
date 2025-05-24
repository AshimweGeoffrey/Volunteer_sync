using FluentValidation;
using VolunteerSync.Application.DTOs.Tasks;

namespace VolunteerSync.Application.Validators;

public class CreateTaskValidator : AbstractValidator<CreateVolunteerTaskDto>
{
    public CreateTaskValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Task title is required")
            .MaximumLength(100).WithMessage("Task title must not exceed 100 characters");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required")
            .MaximumLength(2000).WithMessage("Description must not exceed 2000 characters");

        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage("Start date is required")
            .GreaterThan(DateTime.UtcNow).WithMessage("Start date must be in the future");

        RuleFor(x => x.EndDate)
            .NotEmpty().WithMessage("End date is required")
            .GreaterThan(x => x.StartDate).WithMessage("End date must be after start date");

        RuleFor(x => x.MaxVolunteers)
            .GreaterThan(0).WithMessage("Maximum volunteers must be greater than 0");
    }
}
