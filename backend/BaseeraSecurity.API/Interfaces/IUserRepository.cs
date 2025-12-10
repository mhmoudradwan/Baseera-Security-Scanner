using BaseeraSecurity.API.Entities;

namespace BaseeraSecurity.API.Interfaces;

/// <summary>
/// User Repository Interface - واجهة مستودع المستخدم
/// </summary>
public interface IUserRepository
{
    Task<User?> GetByIdAsync(int id);
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByUsernameAsync(string username);
    Task<User> CreateAsync(User user);
    Task<User> UpdateAsync(User user);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(string email, string username);
}
