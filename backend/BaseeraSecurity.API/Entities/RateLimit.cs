using System.ComponentModel.DataAnnotations;

namespace BaseeraSecurity.API.Entities;

/// <summary>
/// Rate Limit entity - كيان تحديد المعدل
/// Tracks API rate limiting for users and guests
/// يتتبع تحديد معدل استخدام API للمستخدمين والضيوف
/// </summary>
public class RateLimit
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Identifier { get; set; } = string.Empty; // IP address or User ID

    public int ScanCount { get; set; }

    public DateTime WindowStart { get; set; }

    public DateTime WindowEnd { get; set; }
}
