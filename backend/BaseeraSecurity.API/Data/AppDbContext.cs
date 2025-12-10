using BaseeraSecurity.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace BaseeraSecurity.API.Data;

/// <summary>
/// Application Database Context - سياق قاعدة البيانات
/// Main database context for Entity Framework Core
/// سياق قاعدة البيانات الرئيسي لـ Entity Framework Core
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Scan> Scans { get; set; }
    public DbSet<Vulnerability> Vulnerabilities { get; set; }
    public DbSet<VulnerabilityType> VulnerabilityTypes { get; set; }
    public DbSet<RateLimit> RateLimits { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration - تكوين المستخدم
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.Username).IsUnique();
        });

        // Scan configuration - تكوين الفحص
        modelBuilder.Entity<Scan>(entity =>
        {
            entity.HasOne(s => s.User)
                .WithMany(u => u.Scans)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.GuestSessionId);
            
            entity.Property(s => s.RiskScore)
                .HasPrecision(5, 2);
        });

        // Vulnerability configuration - تكوين الثغرة
        modelBuilder.Entity<Vulnerability>(entity =>
        {
            entity.HasOne(v => v.Scan)
                .WithMany(s => s.Vulnerabilities)
                .HasForeignKey(v => v.ScanId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(v => v.Type)
                .WithMany(t => t.Vulnerabilities)
                .HasForeignKey(v => v.TypeId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // VulnerabilityType configuration - تكوين نوع الثغرة
        modelBuilder.Entity<VulnerabilityType>(entity =>
        {
            entity.HasIndex(e => e.Name).IsUnique();
        });

        // RateLimit configuration - تكوين تحديد المعدل
        modelBuilder.Entity<RateLimit>(entity =>
        {
            entity.HasIndex(e => e.Identifier);
        });

        // Seed VulnerabilityTypes - إضافة أنواع الثغرات الأولية
        SeedVulnerabilityTypes(modelBuilder);
    }

    /// <summary>
    /// Seed vulnerability types data - إضافة بيانات أنواع الثغرات
    /// </summary>
    private void SeedVulnerabilityTypes(ModelBuilder modelBuilder)
    {
        var vulnerabilityTypes = new List<VulnerabilityType>
        {
            // Critical - حرج
            new VulnerabilityType { Id = 1, Name = "xss", DisplayName = "Cross-Site Scripting (XSS)", Severity = "Critical", Category = "Injection", CWE_Id = "CWE-79", Description = "Allows attackers to inject malicious scripts" },
            new VulnerabilityType { Id = 2, Name = "sql_injection", DisplayName = "SQL Injection", Severity = "Critical", Category = "Injection", CWE_Id = "CWE-89", Description = "Database manipulation through malicious queries" },
            new VulnerabilityType { Id = 3, Name = "command_injection", DisplayName = "Command Injection", Severity = "Critical", Category = "Injection", CWE_Id = "CWE-78", Description = "Execution of arbitrary system commands" },
            new VulnerabilityType { Id = 4, Name = "api_keys", DisplayName = "Exposed API Keys", Severity = "Critical", Category = "Sensitive Data", CWE_Id = "CWE-798", Description = "API keys exposed in client-side code" },
            new VulnerabilityType { Id = 5, Name = "insecure_forms", DisplayName = "Insecure Forms", Severity = "Critical", Category = "Authentication", CWE_Id = "CWE-319", Description = "Forms submitting sensitive data over HTTP" },

            // High - عالي
            new VulnerabilityType { Id = 6, Name = "missing_csp", DisplayName = "Missing Content Security Policy", Severity = "High", Category = "Configuration", CWE_Id = "CWE-693", Description = "No CSP header to prevent XSS attacks" },
            new VulnerabilityType { Id = 7, Name = "weak_csp", DisplayName = "Weak Content Security Policy", Severity = "High", Category = "Configuration", CWE_Id = "CWE-693", Description = "CSP header with unsafe directives" },
            new VulnerabilityType { Id = 8, Name = "sensitive_files", DisplayName = "Sensitive Files Exposed", Severity = "High", Category = "Information Disclosure", CWE_Id = "CWE-548", Description = "Configuration or backup files accessible" },

            // Medium - متوسط
            new VulnerabilityType { Id = 9, Name = "mixed_content", DisplayName = "Mixed Content", Severity = "Medium", Category = "Transport Security", CWE_Id = "CWE-311", Description = "HTTPS page loading HTTP resources" },
            new VulnerabilityType { Id = 10, Name = "missing_hsts", DisplayName = "Missing HSTS Header", Severity = "Medium", Category = "Transport Security", CWE_Id = "CWE-523", Description = "No HTTP Strict Transport Security" },
            new VulnerabilityType { Id = 11, Name = "clickjacking", DisplayName = "Clickjacking Vulnerability", Severity = "Medium", Category = "UI Security", CWE_Id = "CWE-1021", Description = "Missing X-Frame-Options header" },
            new VulnerabilityType { Id = 12, Name = "insecure_cookies", DisplayName = "Insecure Cookies", Severity = "Medium", Category = "Session Management", CWE_Id = "CWE-614", Description = "Cookies without Secure or HttpOnly flags" },
            new VulnerabilityType { Id = 13, Name = "missing_sri", DisplayName = "Missing Subresource Integrity", Severity = "Medium", Category = "Supply Chain", CWE_Id = "CWE-353", Description = "External resources without SRI checks" },
            new VulnerabilityType { Id = 14, Name = "cors_misconfiguration", DisplayName = "CORS Misconfiguration", Severity = "Medium", Category = "Configuration", CWE_Id = "CWE-942", Description = "Overly permissive CORS policy" },
            new VulnerabilityType { Id = 15, Name = "debug_pages", DisplayName = "Debug Pages Exposed", Severity = "Medium", Category = "Information Disclosure", CWE_Id = "CWE-215", Description = "Development/debug endpoints accessible" },
            new VulnerabilityType { Id = 16, Name = "open_redirect", DisplayName = "Open Redirect", Severity = "Medium", Category = "Input Validation", CWE_Id = "CWE-601", Description = "Unvalidated redirect parameters" },
            new VulnerabilityType { Id = 17, Name = "csrf", DisplayName = "CSRF Vulnerability", Severity = "Medium", Category = "Session Management", CWE_Id = "CWE-352", Description = "Missing CSRF protection" },

            // Low - منخفض
            new VulnerabilityType { Id = 18, Name = "deprecated_html", DisplayName = "Deprecated HTML Elements", Severity = "Low", Category = "Code Quality", CWE_Id = "CWE-477", Description = "Use of deprecated HTML tags" },
            new VulnerabilityType { Id = 19, Name = "trackers", DisplayName = "Tracking Scripts", Severity = "Low", Category = "Privacy", CWE_Id = "CWE-359", Description = "Third-party tracking scripts detected" },
            
            // Additional type for unknown - نوع إضافي للثغرات غير المعروفة
            new VulnerabilityType { Id = 20, Name = "other", DisplayName = "Other Vulnerability", Severity = "Medium", Category = "Other", CWE_Id = "CWE-1008", Description = "Other security issues" }
        };

        modelBuilder.Entity<VulnerabilityType>().HasData(vulnerabilityTypes);
    }
}
