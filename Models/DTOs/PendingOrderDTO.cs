namespace ProiectLicentaFMI.Models;

public class PendingOrderDTO
{
    public List<FoodDTO> Foods { get; set; }
    public Guid OrderId { get; set; }
    public string RestaurantName { get; set; } = null!;
    public string RestaurantPicture { get; set; } = null!;
}