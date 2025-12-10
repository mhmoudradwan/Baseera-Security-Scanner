using BaseeraSecurity.API.DTOs;
using FluentValidation;

namespace BaseeraSecurity.API.Validators;

/// <summary>
/// Create Scan DTO Validator - مدقق طلب إنشاء الفحص
/// </summary>
public class CreateScanDtoValidator : AbstractValidator<CreateScanDto>
{
    public CreateScanDtoValidator()
    {
        RuleFor(x => x.Url)
            .NotEmpty().WithMessage("URL is required - الرابط مطلوب")
            .Must(BeAValidUrl).WithMessage("Invalid URL format - صيغة الرابط غير صحيحة")
            .MaximumLength(2000);
    }

    private bool BeAValidUrl(string url)
    {
        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult) 
            && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }
}
