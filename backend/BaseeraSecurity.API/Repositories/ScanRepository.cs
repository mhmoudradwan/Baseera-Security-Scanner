using BaseeraSecurity.API.Data;
using BaseeraSecurity.API.Entities;
using BaseeraSecurity.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BaseeraSecurity.API.Repositories;

/// <summary>
/// Scan Repository Implementation - تطبيق مستودع الفحص
/// </summary>
public class ScanRepository : IScanRepository
{
    private readonly AppDbContext _context;

    public ScanRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Scan?> GetByIdAsync(int id)
    {
        return await _context.Scans
            .Include(s => s.Vulnerabilities)
                .ThenInclude(v => v.Type)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<List<Scan>> GetByUserIdAsync(int userId)
    {
        return await _context.Scans
            .Include(s => s.Vulnerabilities)
                .ThenInclude(v => v.Type)
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.ScannedAt)
            .ToListAsync();
    }

    public async Task<List<Scan>> GetByGuestSessionIdAsync(string guestSessionId)
    {
        return await _context.Scans
            .Include(s => s.Vulnerabilities)
                .ThenInclude(v => v.Type)
            .Where(s => s.GuestSessionId == guestSessionId)
            .OrderByDescending(s => s.ScannedAt)
            .ToListAsync();
    }

    public async Task<Scan> CreateAsync(Scan scan)
    {
        _context.Scans.Add(scan);
        await _context.SaveChangesAsync();
        return scan;
    }

    public async Task DeleteAsync(int id)
    {
        var scan = await _context.Scans.FindAsync(id);
        if (scan != null)
        {
            _context.Scans.Remove(scan);
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteExpiredScansAsync()
    {
        var expiredScans = await _context.Scans
            .Where(s => s.ExpiresAt < DateTime.UtcNow)
            .ToListAsync();

        _context.Scans.RemoveRange(expiredScans);
        await _context.SaveChangesAsync();
    }

    public async Task LinkGuestScansToUserAsync(string guestSessionId, int userId)
    {
        var guestScans = await _context.Scans
            .Where(s => s.GuestSessionId == guestSessionId && s.IsGuest)
            .ToListAsync();

        foreach (var scan in guestScans)
        {
            scan.UserId = userId;
            scan.IsGuest = false;
            scan.GuestSessionId = null;
        }

        await _context.SaveChangesAsync();
    }
}
