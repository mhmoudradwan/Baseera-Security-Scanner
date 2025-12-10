using AutoMapper;
using BaseeraSecurity.API.DTOs;
using BaseeraSecurity.API.Entities;

namespace BaseeraSecurity.API.Mappings;

/// <summary>
/// AutoMapper Profile - ملف تعريف AutoMapper
/// Maps entities to DTOs and vice versa
/// يربط الكيانات بـ DTOs والعكس
/// </summary>
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // User mappings - تعيينات المستخدم
        CreateMap<User, UserDto>();
        CreateMap<UpdateUserDto, User>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // Scan mappings - تعيينات الفحص
        CreateMap<Scan, ScanDto>();
        CreateMap<CreateScanDto, Scan>()
            .ForMember(dest => dest.Vulnerabilities, opt => opt.Ignore());

        // Vulnerability mappings - تعيينات الثغرة
        CreateMap<Vulnerability, VulnerabilityDto>();
        CreateMap<VulnerabilityDto, Vulnerability>()
            .ForMember(dest => dest.Type, opt => opt.Ignore())
            .ForMember(dest => dest.Scan, opt => opt.Ignore());

        // VulnerabilityType mappings - تعيينات نوع الثغرة
        CreateMap<VulnerabilityType, VulnerabilityTypeDto>();
    }
}
