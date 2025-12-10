using AutoMapper;
using BaseeraSecurity.API.DTOs;
using BaseeraSecurity.API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BaseeraSecurity.API.Controllers;

/// <summary>
/// Vulnerabilities Controller - مراقب الثغرات
/// Handles vulnerability type operations
/// يدير عمليات أنواع الثغرات
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class VulnerabilitiesController : ControllerBase
{
    private readonly IVulnerabilityRepository _vulnerabilityRepository;
    private readonly IMapper _mapper;

    public VulnerabilitiesController(
        IVulnerabilityRepository vulnerabilityRepository,
        IMapper mapper)
    {
        _vulnerabilityRepository = vulnerabilityRepository;
        _mapper = mapper;
    }

    /// <summary>
    /// Get all vulnerability types - الحصول على جميع أنواع الثغرات
    /// </summary>
    [HttpGet("types")]
    public async Task<ActionResult<List<VulnerabilityTypeDto>>> GetTypes()
    {
        var types = await _vulnerabilityRepository.GetAllTypesAsync();
        return Ok(_mapper.Map<List<VulnerabilityTypeDto>>(types));
    }

    /// <summary>
    /// Get vulnerability type by ID - الحصول على نوع الثغرة بواسطة المعرف
    /// </summary>
    [HttpGet("types/{id}")]
    public async Task<ActionResult<VulnerabilityTypeDto>> GetTypeById(int id)
    {
        var type = await _vulnerabilityRepository.GetTypeByIdAsync(id);
        if (type == null)
        {
            return NotFound();
        }

        return Ok(_mapper.Map<VulnerabilityTypeDto>(type));
    }
}
