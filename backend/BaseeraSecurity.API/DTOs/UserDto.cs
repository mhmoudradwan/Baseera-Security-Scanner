namespace BaseeraSecurity.API.DTOs;

/// <summary>
/// User DTO - بيانات المستخدم
/// </summary>
public class UserDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string? FullName { get; set; }
    public string? Phone { get; set; }
    public string? Country { get; set; }
    public string? Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Bio { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public bool IsActive { get; set; }
}

/// <summary>
/// Update user DTO - تحديث بيانات المستخدم
/// </summary>
public class UpdateUserDto
{
    public string? FullName { get; set; }
    public string? Phone { get; set; }
    public string? Country { get; set; }
    public string? Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Bio { get; set; }
    public string? ProfilePictureUrl { get; set; }
}
