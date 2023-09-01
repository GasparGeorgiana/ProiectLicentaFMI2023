namespace ProiectLicentaFMI.Models;

public class RegisterAsOwnerModel
{
    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;
    
    public string Password { get; set; } = null!;
    public Guid RestaurantId { get; set; }

    public string RestaurantName { get; set; } = null!;

    public string RestaurantPicture { get; set; } = null!;
}