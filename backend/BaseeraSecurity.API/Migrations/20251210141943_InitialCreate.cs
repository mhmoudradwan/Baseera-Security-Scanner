using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BaseeraSecurity.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RateLimits",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Identifier = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ScanCount = table.Column<int>(type: "int", nullable: false),
                    WindowStart = table.Column<DateTime>(type: "datetime2", nullable: false),
                    WindowEnd = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RateLimits", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    Username = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Country = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Bio = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    ProfilePictureUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastLoginAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VulnerabilityTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Severity = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CWE_Id = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Category = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VulnerabilityTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Scans",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    GuestSessionId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Url = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    ScannedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TotalVulnerabilities = table.Column<int>(type: "int", nullable: false),
                    RiskScore = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsGuest = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Scans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Scans_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Vulnerabilities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ScanId = table.Column<int>(type: "int", nullable: false),
                    TypeId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    Location = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Evidence = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    Recommendation = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    DetectedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vulnerabilities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Vulnerabilities_Scans_ScanId",
                        column: x => x.ScanId,
                        principalTable: "Scans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Vulnerabilities_VulnerabilityTypes_TypeId",
                        column: x => x.TypeId,
                        principalTable: "VulnerabilityTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "VulnerabilityTypes",
                columns: new[] { "Id", "CWE_Id", "Category", "Description", "DisplayName", "Name", "Severity" },
                values: new object[,]
                {
                    { 1, "CWE-79", "Injection", "Allows attackers to inject malicious scripts", "Cross-Site Scripting (XSS)", "xss", "Critical" },
                    { 2, "CWE-89", "Injection", "Database manipulation through malicious queries", "SQL Injection", "sql_injection", "Critical" },
                    { 3, "CWE-78", "Injection", "Execution of arbitrary system commands", "Command Injection", "command_injection", "Critical" },
                    { 4, "CWE-798", "Sensitive Data", "API keys exposed in client-side code", "Exposed API Keys", "api_keys", "Critical" },
                    { 5, "CWE-319", "Authentication", "Forms submitting sensitive data over HTTP", "Insecure Forms", "insecure_forms", "Critical" },
                    { 6, "CWE-693", "Configuration", "No CSP header to prevent XSS attacks", "Missing Content Security Policy", "missing_csp", "High" },
                    { 7, "CWE-693", "Configuration", "CSP header with unsafe directives", "Weak Content Security Policy", "weak_csp", "High" },
                    { 8, "CWE-548", "Information Disclosure", "Configuration or backup files accessible", "Sensitive Files Exposed", "sensitive_files", "High" },
                    { 9, "CWE-311", "Transport Security", "HTTPS page loading HTTP resources", "Mixed Content", "mixed_content", "Medium" },
                    { 10, "CWE-523", "Transport Security", "No HTTP Strict Transport Security", "Missing HSTS Header", "missing_hsts", "Medium" },
                    { 11, "CWE-1021", "UI Security", "Missing X-Frame-Options header", "Clickjacking Vulnerability", "clickjacking", "Medium" },
                    { 12, "CWE-614", "Session Management", "Cookies without Secure or HttpOnly flags", "Insecure Cookies", "insecure_cookies", "Medium" },
                    { 13, "CWE-353", "Supply Chain", "External resources without SRI checks", "Missing Subresource Integrity", "missing_sri", "Medium" },
                    { 14, "CWE-942", "Configuration", "Overly permissive CORS policy", "CORS Misconfiguration", "cors_misconfiguration", "Medium" },
                    { 15, "CWE-215", "Information Disclosure", "Development/debug endpoints accessible", "Debug Pages Exposed", "debug_pages", "Medium" },
                    { 16, "CWE-601", "Input Validation", "Unvalidated redirect parameters", "Open Redirect", "open_redirect", "Medium" },
                    { 17, "CWE-352", "Session Management", "Missing CSRF protection", "CSRF Vulnerability", "csrf", "Medium" },
                    { 18, "CWE-477", "Code Quality", "Use of deprecated HTML tags", "Deprecated HTML Elements", "deprecated_html", "Low" },
                    { 19, "CWE-359", "Privacy", "Third-party tracking scripts detected", "Tracking Scripts", "trackers", "Low" },
                    { 20, "CWE-1008", "Other", "Other security issues", "Other Vulnerability", "other", "Medium" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_RateLimits_Identifier",
                table: "RateLimits",
                column: "Identifier");

            migrationBuilder.CreateIndex(
                name: "IX_Scans_GuestSessionId",
                table: "Scans",
                column: "GuestSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_Scans_UserId",
                table: "Scans",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Vulnerabilities_ScanId",
                table: "Vulnerabilities",
                column: "ScanId");

            migrationBuilder.CreateIndex(
                name: "IX_Vulnerabilities_TypeId",
                table: "Vulnerabilities",
                column: "TypeId");

            migrationBuilder.CreateIndex(
                name: "IX_VulnerabilityTypes_Name",
                table: "VulnerabilityTypes",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RateLimits");

            migrationBuilder.DropTable(
                name: "Vulnerabilities");

            migrationBuilder.DropTable(
                name: "Scans");

            migrationBuilder.DropTable(
                name: "VulnerabilityTypes");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
