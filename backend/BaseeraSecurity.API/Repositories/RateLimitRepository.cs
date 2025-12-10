using BaseeraSecurity.API.Data;
using BaseeraSecurity.API.Entities;
using BaseeraSecurity.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BaseeraSecurity.API.Repositories;

/// <summary>
/// Rate Limit Repository Implementation - تطبيق مستودع تحديد المعدل
/// </summary>
public class RateLimitRepository : IRateLimitRepository
{
    private readonly AppDbContext _context;

    public RateLimitRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<RateLimit?> GetByIdentifierAsync(string identifier)
    {
        return await _context.RateLimits
            .FirstOrDefaultAsync(rl => rl.Identifier == identifier);
    }

    public async Task<RateLimit> CreateOrUpdateAsync(RateLimit rateLimit)
    {
        var existing = await GetByIdentifierAsync(rateLimit.Identifier);
        
        if (existing != null)
        {
            existing.ScanCount = rateLimit.ScanCount;
            existing.WindowStart = rateLimit.WindowStart;
            existing.WindowEnd = rateLimit.WindowEnd;
            _context.RateLimits.Update(existing);
        }
        else
        {
            _context.RateLimits.Add(rateLimit);
        }

        await _context.SaveChangesAsync();
        return existing ?? rateLimit;
    }

    public async Task DeleteExpiredAsync()
    {
        var expiredLimits = await _context.RateLimits
            .Where(rl => rl.WindowEnd < DateTime.UtcNow)
            .ToListAsync();

        _context.RateLimits.RemoveRange(expiredLimits);
        await _context.SaveChangesAsync();
    }
}
