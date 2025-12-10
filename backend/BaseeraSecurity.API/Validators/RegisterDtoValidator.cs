using BaseeraSecurity.API.DTOs;
using FluentValidation;

namespace BaseeraSecurity.API.Validators;

/// <summary>
/// Register DTO Validator - مدقق طلب التسجيل
/// </summary>
public class RegisterDtoValidator : AbstractValidator<RegisterDto>
{
    public RegisterDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required - البريد الإلكتروني مطلوب")
            .EmailAddress().WithMessage("Invalid email format - صيغة البريد الإلكتروني غير صحيحة")
            .MaximumLength(256);

        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Username is required - اسم المستخدم مطلوب")
            .MinimumLength(3).WithMessage("Username must be at least 3 characters - اسم المستخدم يجب أن يكون 3 أحرف على الأقل")
            .MaximumLength(100);

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required - كلمة المرور مطلوبة")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters - كلمة المرور يجب أن تكون 6 أحرف على الأقل")
            .MaximumLength(100);

        RuleFor(x => x.FullName)
            .MaximumLength(200)
            .When(x => !string.IsNullOrEmpty(x.FullName));

        RuleFor(x => x.Phone)
            .MaximumLength(20)
            .When(x => !string.IsNullOrEmpty(x.Phone));

        RuleFor(x => x.Country)
            .MaximumLength(100)
            .When(x => !string.IsNullOrEmpty(x.Country));

        RuleFor(x => x.Bio)
            .MaximumLength(1000)
            .When(x => !string.IsNullOrEmpty(x.Bio));
    }
}
