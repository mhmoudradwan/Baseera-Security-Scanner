using System.Security.Claims;
using AutoMapper;
using BaseeraSecurity.API.DTOs;
using BaseeraSecurity.API.Entities;
using BaseeraSecurity.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BaseeraSecurity.API.Controllers;

/// <summary>
/// Scans Controller - مراقب الفحوصات
/// Handles security scans CRUD operations
/// يدير عمليات CRUD للفحوصات الأمنية
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ScansController : ControllerBase
{
    private readonly IScanRepository _scanRepository;
    private readonly IVulnerabilityRepository _vulnerabilityRepository;
    private readonly IMapper _mapper;

    public ScansController(
        IScanRepository scanRepository,
        IVulnerabilityRepository vulnerabilityRepository,
        IMapper mapper)
    {
        _scanRepository = scanRepository;
        _vulnerabilityRepository = vulnerabilityRepository;
        _mapper = mapper;
    }

    /// <summary>
    /// Create guest scan - إنشاء فحص ضيف
    /// Rate limit: 10 scans per hour
    /// </summary>
    [HttpPost("guest")]
    public async Task<ActionResult<ScanDto>> CreateGuestScan([FromBody] CreateScanDto dto, [FromQuery] string? sessionId = null)
    {
        var scan = await CreateScanInternal(dto, null, sessionId ?? Guid.NewGuid().ToString(), true);
        return CreatedAtAction(nameof(GetById), new { id = scan.Id }, _mapper.Map<ScanDto>(scan));
    }

    /// <summary>
    /// Create authenticated user scan - إنشاء فحص لمستخدم مصدق
    /// Rate limit: 100 scans per day
    /// </summary>
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ScanDto>> CreateScan([FromBody] CreateScanDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var scan = await CreateScanInternal(dto, userId, null, false);
        return CreatedAtAction(nameof(GetById), new { id = scan.Id }, _mapper.Map<ScanDto>(scan));
    }

    /// <summary>
    /// Get all scans for current user - الحصول على جميع الفحوصات للمستخدم الحالي
    /// </summary>
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<ScanDto>>> GetAll()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var scans = await _scanRepository.GetByUserIdAsync(userId);
        return Ok(_mapper.Map<List<ScanDto>>(scans));
    }

    /// <summary>
    /// Get scan by ID - الحصول على فحص بواسطة المعرف
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ScanDto>> GetById(int id)
    {
        var scan = await _scanRepository.GetByIdAsync(id);
        if (scan == null)
        {
            return NotFound();
        }

        // Check authorization - التحقق من الصلاحية
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (scan.UserId.HasValue && (string.IsNullOrEmpty(userIdClaim) || 
            !int.TryParse(userIdClaim, out var userId) || userId != scan.UserId.Value))
        {
            return Forbid();
        }

        return Ok(_mapper.Map<ScanDto>(scan));
    }

    /// <summary>
    /// Delete scan - حذف فحص
    /// </summary>
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var scan = await _scanRepository.GetByIdAsync(id);
        if (scan == null)
        {
            return NotFound();
        }

        // Check authorization - التحقق من الصلاحية
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId) || 
            !scan.UserId.HasValue || userId != scan.UserId.Value)
        {
            return Forbid();
        }

        await _scanRepository.DeleteAsync(id);
        return NoContent();
    }

    /// <summary>
    /// Get scan statistics - الحصول على إحصائيات الفحص
    /// </summary>
    [Authorize]
    [HttpGet("statistics")]
    public async Task<ActionResult<ScanStatisticsDto>> GetStatistics()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var scans = await _scanRepository.GetByUserIdAsync(userId);
        
        var statistics = new ScanStatisticsDto
        {
            TotalScans = scans.Count,
            TotalVulnerabilities = scans.Sum(s => s.TotalVulnerabilities),
            CriticalCount = scans.SelectMany(s => s.Vulnerabilities).Count(v => v.Type.Severity == "Critical"),
            HighCount = scans.SelectMany(s => s.Vulnerabilities).Count(v => v.Type.Severity == "High"),
            MediumCount = scans.SelectMany(s => s.Vulnerabilities).Count(v => v.Type.Severity == "Medium"),
            LowCount = scans.SelectMany(s => s.Vulnerabilities).Count(v => v.Type.Severity == "Low"),
            AverageRiskScore = scans.Any() ? scans.Average(s => s.RiskScore) : 0,
            TopVulnerabilities = scans
                .SelectMany(s => s.Vulnerabilities)
                .GroupBy(v => v.Type.Name)
                .Select(g => new TopVulnerabilityDto { Name = g.Key, Count = g.Count() })
                .OrderByDescending(v => v.Count)
                .Take(5)
                .ToList()
        };

        return Ok(statistics);
    }

    /// <summary>
    /// Export scan results - تصدير نتائج الفحص
    /// </summary>
    [Authorize]
    [HttpGet("{id}/export")]
    public async Task<IActionResult> Export(int id)
    {
        var scan = await _scanRepository.GetByIdAsync(id);
        if (scan == null)
        {
            return NotFound();
        }

        // Check authorization - التحقق من الصلاحية
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId) || 
            !scan.UserId.HasValue || userId != scan.UserId.Value)
        {
            return Forbid();
        }

        // Return JSON for now - إرجاع JSON في الوقت الحالي
        var scanDto = _mapper.Map<ScanDto>(scan);
        return Ok(scanDto);
    }

    /// <summary>
    /// Internal method to create scan - طريقة داخلية لإنشاء الفحص
    /// </summary>
    private async Task<Scan> CreateScanInternal(CreateScanDto dto, int? userId, string? guestSessionId, bool isGuest)
    {
        var scan = new Scan
        {
            UserId = userId,
            GuestSessionId = guestSessionId,
            Url = dto.Url,
            ScannedAt = DateTime.UtcNow,
            ExpiresAt = isGuest ? DateTime.UtcNow.AddHours(24) : DateTime.UtcNow.AddDays(90),
            IsGuest = isGuest,
            TotalVulnerabilities = dto.Vulnerabilities?.Count ?? 0,
            RiskScore = CalculateRiskScore(dto.Vulnerabilities ?? new List<VulnerabilityDto>())
        };

        scan = await _scanRepository.CreateAsync(scan);

        // Add vulnerabilities - إضافة الثغرات
        if (dto.Vulnerabilities != null && dto.Vulnerabilities.Any())
        {
            foreach (var vulnDto in dto.Vulnerabilities)
            {
                var vuln = new Vulnerability
                {
                    ScanId = scan.Id,
                    TypeId = vulnDto.TypeId,
                    Title = vulnDto.Title,
                    Description = vulnDto.Description,
                    Location = vulnDto.Location,
                    Evidence = vulnDto.Evidence,
                    Recommendation = vulnDto.Recommendation,
                    DetectedAt = DateTime.UtcNow
                };
                scan.Vulnerabilities.Add(vuln);
            }

            // Reload scan with vulnerabilities - إعادة تحميل الفحص مع الثغرات
            scan = await _scanRepository.GetByIdAsync(scan.Id) ?? scan;
        }

        return scan;
    }

    /// <summary>
    /// Calculate risk score based on vulnerabilities - حساب درجة المخاطر بناءً على الثغرات
    /// </summary>
    private decimal CalculateRiskScore(List<VulnerabilityDto> vulnerabilities)
    {
        if (!vulnerabilities.Any()) return 0;

        var scores = new Dictionary<int, int>();
        foreach (var vuln in vulnerabilities)
        {
            scores.TryGetValue(vuln.TypeId, out var count);
            scores[vuln.TypeId] = count + 1;
        }

        // Weight by severity: Critical=10, High=7, Medium=4, Low=1
        // This is a simplified calculation
        return vulnerabilities.Count * 10;
    }
}
