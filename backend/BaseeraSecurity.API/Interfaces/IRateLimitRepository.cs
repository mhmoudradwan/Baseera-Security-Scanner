using BaseeraSecurity.API.Entities;

namespace BaseeraSecurity.API.Interfaces;

/// <summary>
/// Rate Limit Repository Interface - واجهة مستودع تحديد المعدل
/// </summary>
public interface IRateLimitRepository
{
    Task<RateLimit?> GetByIdentifierAsync(string identifier);
    Task<RateLimit> CreateOrUpdateAsync(RateLimit rateLimit);
    Task DeleteExpiredAsync();
}
