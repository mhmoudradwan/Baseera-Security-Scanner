using System.Security.Claims;
using AutoMapper;
using BaseeraSecurity.API.DTOs;
using BaseeraSecurity.API.Interfaces;
using BaseeraSecurity.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BaseeraSecurity.API.Controllers;

/// <summary>
/// Authentication Controller - مراقب المصادقة
/// Handles user authentication and registration
/// يدير مصادقة وتسجيل المستخدمين
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly IUserRepository _userRepository;
    private readonly IScanRepository _scanRepository;
    private readonly IMapper _mapper;

    public AuthController(
        AuthService authService,
        IUserRepository userRepository,
        IScanRepository scanRepository,
        IMapper mapper)
    {
        _authService = authService;
        _userRepository = userRepository;
        _scanRepository = scanRepository;
        _mapper = mapper;
    }

    /// <summary>
    /// Register new user - تسجيل مستخدم جديد
    /// </summary>
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto registerDto)
    {
        try
        {
            var response = await _authService.RegisterAsync(registerDto);
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Login user - تسجيل دخول المستخدم
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            var response = await _authService.LoginAsync(loginDto);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Get current user - الحصول على المستخدم الحالي
    /// </summary>
    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> GetMe()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return NotFound();
        }

        return Ok(_mapper.Map<UserDto>(user));
    }

    /// <summary>
    /// Link guest scans to user account - ربط فحوصات الضيف بحساب المستخدم
    /// </summary>
    [Authorize]
    [HttpPost("link-guest-scans")]
    public async Task<IActionResult> LinkGuestScans([FromBody] LinkGuestScansDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        await _scanRepository.LinkGuestScansToUserAsync(dto.GuestSessionId, userId);
        return Ok(new { message = "Guest scans linked successfully - تم ربط فحوصات الضيف بنجاح" });
    }

    /// <summary>
    /// Refresh access token - تحديث رمز الوصول
    /// </summary>
    [HttpPost("refresh-token")]
    public async Task<ActionResult<AuthResponseDto>> RefreshToken([FromBody] RefreshTokenDto dto)
    {
        // In a production app, you would validate the refresh token against a database
        // For simplicity, we're returning an error here
        return BadRequest(new { error = "Refresh token functionality not implemented - وظيفة تحديث الرمز غير مطبقة" });
    }
}
