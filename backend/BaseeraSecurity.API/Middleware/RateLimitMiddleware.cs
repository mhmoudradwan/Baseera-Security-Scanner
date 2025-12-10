using System.Security.Claims;
using BaseeraSecurity.API.Entities;
using BaseeraSecurity.API.Interfaces;

namespace BaseeraSecurity.API.Middleware;

/// <summary>
/// Rate Limiting Middleware - وسيط تحديد المعدل
/// Controls API rate limits for guests (10/hour) and users (100/day)
/// يتحكم في حدود معدل API للضيوف (10/ساعة) والمستخدمين (100/يوم)
/// </summary>
public class RateLimitMiddleware
{
    private readonly RequestDelegate _next;
    private const int GuestHourlyLimit = 10;
    private const int UserDailyLimit = 100;

    public RateLimitMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, IRateLimitRepository rateLimitRepository)
    {
        // Only apply to scan endpoints - فقط على نقاط نهاية الفحص
        if (!context.Request.Path.StartsWithSegments("/api/scans") || 
            context.Request.Method != "POST")
        {
            await _next(context);
            return;
        }

        // Get identifier (user ID or IP) - الحصول على المعرف (معرف المستخدم أو IP)
        var identifier = GetIdentifier(context);
        var isGuest = !context.User.Identity?.IsAuthenticated ?? true;

        var rateLimit = await rateLimitRepository.GetByIdentifierAsync(identifier);
        var now = DateTime.UtcNow;

        if (rateLimit == null)
        {
            // Create new rate limit - إنشاء حد معدل جديد
            rateLimit = new RateLimit
            {
                Identifier = identifier,
                ScanCount = 1,
                WindowStart = now,
                WindowEnd = isGuest ? now.AddHours(1) : now.AddDays(1)
            };
            await rateLimitRepository.CreateOrUpdateAsync(rateLimit);
        }
        else
        {
            // Check if window expired - التحقق من انتهاء النافذة
            if (now > rateLimit.WindowEnd)
            {
                rateLimit.ScanCount = 1;
                rateLimit.WindowStart = now;
                rateLimit.WindowEnd = isGuest ? now.AddHours(1) : now.AddDays(1);
            }
            else
            {
                // Check limit - التحقق من الحد
                var limit = isGuest ? GuestHourlyLimit : UserDailyLimit;
                if (rateLimit.ScanCount >= limit)
                {
                    context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                    await context.Response.WriteAsJsonAsync(new
                    {
                        error = isGuest 
                            ? $"Guest rate limit exceeded. Maximum {GuestHourlyLimit} scans per hour - تم تجاوز حد الضيف. الحد الأقصى {GuestHourlyLimit} فحوصات في الساعة"
                            : $"User rate limit exceeded. Maximum {UserDailyLimit} scans per day - تم تجاوز حد المستخدم. الحد الأقصى {UserDailyLimit} فحوصات في اليوم"
                    });
                    return;
                }

                rateLimit.ScanCount++;
            }

            await rateLimitRepository.CreateOrUpdateAsync(rateLimit);
        }

        await _next(context);
    }

    private string GetIdentifier(HttpContext context)
    {
        // Get user ID if authenticated - الحصول على معرف المستخدم إذا كان مصدقاً
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!string.IsNullOrEmpty(userId))
        {
            return $"user_{userId}";
        }

        // Otherwise use IP address - وإلا استخدم عنوان IP
        var ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        return $"ip_{ipAddress}";
    }
}
