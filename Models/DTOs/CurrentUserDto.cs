namespace ProiectLicentaFMI.Models;

public class CurrentUserDto
{
    
    public Guid UserId { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string UserName { get; set; }
    public string LastName { get; set; }
    public int? Role { get; set; }
    public bool IsAuthenticated { get; set; }
    public string Image { get; set; }
}