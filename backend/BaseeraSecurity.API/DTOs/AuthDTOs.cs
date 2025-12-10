namespace BaseeraSecurity.API.DTOs;

/// <summary>
/// Register request DTO - طلب التسجيل
/// </summary>
public class RegisterDto
{
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? FullName { get; set; }
    public string? Phone { get; set; }
    public string? Country { get; set; }
    public string? Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Bio { get; set; }
    public string? ProfilePictureUrl { get; set; }
}

/// <summary>
/// Login request DTO - طلب تسجيل الدخول
/// </summary>
public class LoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

/// <summary>
/// Auth response DTO - استجابة المصادقة
/// </summary>
public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public UserDto User { get; set; } = null!;
}

/// <summary>
/// Refresh token request DTO - طلب تحديث الرمز
/// </summary>
public class RefreshTokenDto
{
    public string RefreshToken { get; set; } = string.Empty;
}

/// <summary>
/// Link guest scans request DTO - طلب ربط فحوصات الضيف
/// </summary>
public class LinkGuestScansDto
{
    public string GuestSessionId { get; set; } = string.Empty;
}
