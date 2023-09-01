namespace ProiectLicentaFMI.Models;

public class RestaurantDTO
{
    public Guid RestaurantId { get; set; }

    public string RestaurantName { get; set; } = null!;

    public string RestaurantPicture { get; set; } = null!;
}