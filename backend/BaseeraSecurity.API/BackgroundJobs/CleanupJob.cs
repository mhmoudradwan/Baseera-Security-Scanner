using BaseeraSecurity.API.Interfaces;

namespace BaseeraSecurity.API.BackgroundJobs;

/// <summary>
/// Cleanup Background Job - مهمة التنظيف في الخلفية
/// Cleans up expired scans and rate limits
/// ينظف الفحوصات وحدود المعدل المنتهية
/// </summary>
public class CleanupJob
{
    private readonly IScanRepository _scanRepository;
    private readonly IRateLimitRepository _rateLimitRepository;
    private readonly ILogger<CleanupJob> _logger;

    public CleanupJob(
        IScanRepository scanRepository,
        IRateLimitRepository rateLimitRepository,
        ILogger<CleanupJob> logger)
    {
        _scanRepository = scanRepository;
        _rateLimitRepository = rateLimitRepository;
        _logger = logger;
    }

    /// <summary>
    /// Clean expired scans - تنظيف الفحوصات المنتهية
    /// </summary>
    public async Task CleanExpiredScansAsync()
    {
        try
        {
            _logger.LogInformation("Starting cleanup of expired scans - بدء تنظيف الفحوصات المنتهية");
            await _scanRepository.DeleteExpiredScansAsync();
            _logger.LogInformation("Completed cleanup of expired scans - اكتمل تنظيف الفحوصات المنتهية");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cleaning expired scans - خطأ في تنظيف الفحوصات المنتهية");
        }
    }

    /// <summary>
    /// Clean expired rate limits - تنظيف حدود المعدل المنتهية
    /// </summary>
    public async Task CleanExpiredRateLimitsAsync()
    {
        try
        {
            _logger.LogInformation("Starting cleanup of expired rate limits - بدء تنظيف حدود المعدل المنتهية");
            await _rateLimitRepository.DeleteExpiredAsync();
            _logger.LogInformation("Completed cleanup of expired rate limits - اكتمل تنظيف حدود المعدل المنتهية");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cleaning expired rate limits - خطأ في تنظيف حدود المعدل المنتهية");
        }
    }
}
