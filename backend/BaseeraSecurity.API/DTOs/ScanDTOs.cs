namespace BaseeraSecurity.API.DTOs;

/// <summary>
/// Create scan request DTO - طلب إنشاء فحص
/// </summary>
public class CreateScanDto
{
    public string Url { get; set; } = string.Empty;
    public List<VulnerabilityDto>? Vulnerabilities { get; set; }
}

/// <summary>
/// Scan response DTO - استجابة الفحص
/// </summary>
public class ScanDto
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public string? GuestSessionId { get; set; }
    public string Url { get; set; } = string.Empty;
    public DateTime ScannedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public int TotalVulnerabilities { get; set; }
    public decimal RiskScore { get; set; }
    public bool IsGuest { get; set; }
    public List<VulnerabilityDto> Vulnerabilities { get; set; } = new();
}

/// <summary>
/// Scan statistics DTO - إحصائيات الفحص
/// </summary>
public class ScanStatisticsDto
{
    public int TotalScans { get; set; }
    public int TotalVulnerabilities { get; set; }
    public int CriticalCount { get; set; }
    public int HighCount { get; set; }
    public int MediumCount { get; set; }
    public int LowCount { get; set; }
    public decimal AverageRiskScore { get; set; }
    public List<TopVulnerabilityDto> TopVulnerabilities { get; set; } = new();
}

/// <summary>
/// Top vulnerability DTO - الثغرات الأكثر شيوعاً
/// </summary>
public class TopVulnerabilityDto
{
    public string Name { get; set; } = string.Empty;
    public int Count { get; set; }
}
