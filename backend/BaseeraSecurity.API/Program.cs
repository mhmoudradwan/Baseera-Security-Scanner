using System.Text;
using BaseeraSecurity.API.BackgroundJobs;
using BaseeraSecurity.API.Data;
using BaseeraSecurity.API.Interfaces;
using BaseeraSecurity.API.Middleware;
using BaseeraSecurity.API.Repositories;
using BaseeraSecurity.API.Services;
using BaseeraSecurity.API.Validators;
using FluentValidation;
using FluentValidation.AspNetCore;
using Hangfire;
using Hangfire.SqlServer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container - إضافة الخدمات إلى الحاوية
builder.Services.AddControllers();

// Database - قاعدة البيانات
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlServerOptions => sqlServerOptions.EnableRetryOnFailure()
    ));

// AutoMapper - AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// FluentValidation - FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<RegisterDtoValidator>();

// JWT Authentication - مصادقة JWT
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

// CORS - CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "http://localhost:5173",
            "chrome-extension://*"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

// Hangfire - Hangfire
builder.Services.AddHangfire(config => config
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseSqlServerStorage(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHangfireServer();

// Repositories - المستودعات
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IScanRepository, ScanRepository>();
builder.Services.AddScoped<IVulnerabilityRepository, VulnerabilityRepository>();
builder.Services.AddScoped<IRateLimitRepository, RateLimitRepository>();

// Services - الخدمات
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<CleanupJob>();

// Swagger/OpenAPI - Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Baseera Security Scanner API",
        Version = "v1",
        Description = "API for web vulnerability scanning - واجهة برمجة تطبيقات فحص الثغرات الأمنية"
    });

    // Add JWT authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline - تكوين خط أنابيب طلب HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Apply migrations and seed database - تطبيق الترحيلات وبذر قاعدة البيانات
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

// Configure Hangfire recurring jobs - تكوين مهام Hangfire المتكررة
RecurringJob.AddOrUpdate<CleanupJob>(
    "cleanup-expired-scans",
    job => job.CleanExpiredScansAsync(),
    Cron.Daily);

RecurringJob.AddOrUpdate<CleanupJob>(
    "cleanup-expired-rate-limits",
    job => job.CleanExpiredRateLimitsAsync(),
    Cron.Hourly);

app.UseHttpsRedirection();

app.UseCors();

// Use rate limiting middleware - استخدام وسيط تحديد المعدل
app.UseMiddleware<RateLimitMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Hangfire Dashboard - لوحة تحكم Hangfire
app.MapHangfireDashboard("/hangfire");

app.Run();
