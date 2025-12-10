using BaseeraSecurity.API.DTOs;
using BaseeraSecurity.API.Entities;
using BaseeraSecurity.API.Interfaces;
using BCrypt.Net;

namespace BaseeraSecurity.API.Services;

/// <summary>
/// Authentication Service - خدمة المصادقة
/// Handles user authentication and registration
/// يدير مصادقة وتسجيل المستخدمين
/// </summary>
public class AuthService
{
    private readonly IUserRepository _userRepository;
    private readonly JwtService _jwtService;

    public AuthService(IUserRepository userRepository, JwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    /// <summary>
    /// Register new user - تسجيل مستخدم جديد
    /// </summary>
    public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
    {
        // Check if user exists - التحقق من وجود المستخدم
        if (await _userRepository.ExistsAsync(registerDto.Email, registerDto.Username))
        {
            throw new InvalidOperationException("User already exists - المستخدم موجود بالفعل");
        }

        // Hash password - تشفير كلمة المرور
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

        // Create user - إنشاء المستخدم
        var user = new User
        {
            Email = registerDto.Email,
            Username = registerDto.Username,
            PasswordHash = passwordHash,
            FullName = registerDto.FullName,
            Phone = registerDto.Phone,
            Country = registerDto.Country,
            Gender = registerDto.Gender,
            DateOfBirth = registerDto.DateOfBirth,
            Bio = registerDto.Bio,
            ProfilePictureUrl = registerDto.ProfilePictureUrl,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        user = await _userRepository.CreateAsync(user);

        // Generate tokens - إنشاء الرموز
        var token = _jwtService.GenerateAccessToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();

        return new AuthResponseDto
        {
            Token = token,
            RefreshToken = refreshToken,
            User = MapToUserDto(user)
        };
    }

    /// <summary>
    /// Login user - تسجيل دخول المستخدم
    /// </summary>
    public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
    {
        // Find user - البحث عن المستخدم
        var user = await _userRepository.GetByEmailAsync(loginDto.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid credentials - بيانات الاعتماد غير صحيحة");
        }

        // Update last login - تحديث آخر تسجيل دخول
        user.LastLoginAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        // Generate tokens - إنشاء الرموز
        var token = _jwtService.GenerateAccessToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();

        return new AuthResponseDto
        {
            Token = token,
            RefreshToken = refreshToken,
            User = MapToUserDto(user)
        };
    }

    /// <summary>
    /// Map User entity to UserDto - تحويل كيان المستخدم إلى DTO
    /// </summary>
    private UserDto MapToUserDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            Username = user.Username,
            FullName = user.FullName,
            Phone = user.Phone,
            Country = user.Country,
            Gender = user.Gender,
            DateOfBirth = user.DateOfBirth,
            Bio = user.Bio,
            ProfilePictureUrl = user.ProfilePictureUrl,
            CreatedAt = user.CreatedAt,
            LastLoginAt = user.LastLoginAt,
            IsActive = user.IsActive
        };
    }
}
