using BaseeraSecurity.API.Entities;

namespace BaseeraSecurity.API.Interfaces;

/// <summary>
/// Scan Repository Interface - واجهة مستودع الفحص
/// </summary>
public interface IScanRepository
{
    Task<Scan?> GetByIdAsync(int id);
    Task<List<Scan>> GetByUserIdAsync(int userId);
    Task<List<Scan>> GetByGuestSessionIdAsync(string guestSessionId);
    Task<Scan> CreateAsync(Scan scan);
    Task DeleteAsync(int id);
    Task DeleteExpiredScansAsync();
    Task LinkGuestScansToUserAsync(string guestSessionId, int userId);
}
