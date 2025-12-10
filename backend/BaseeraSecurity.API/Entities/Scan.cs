using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BaseeraSecurity.API.Entities;

/// <summary>
/// Scan entity - كيان الفحص
/// Represents a security scan of a website
/// يمثل فحص أمني لموقع ويب
/// </summary>
public class Scan
{
    [Key]
    public int Id { get; set; }

    [ForeignKey(nameof(User))]
    public int? UserId { get; set; }

    [StringLength(100)]
    public string? GuestSessionId { get; set; }

    [Required]
    [StringLength(2000)]
    public string Url { get; set; } = string.Empty;

    public DateTime ScannedAt { get; set; } = DateTime.UtcNow;

    public DateTime ExpiresAt { get; set; }

    public int TotalVulnerabilities { get; set; }

    public decimal RiskScore { get; set; }

    public bool IsGuest { get; set; }

    // Navigation properties - خصائص التنقل
    public virtual User? User { get; set; }
    public virtual ICollection<Vulnerability> Vulnerabilities { get; set; } = new List<Vulnerability>();
}
