namespace ProiectLicentaFMI.Models;

public class FoodDTO
{
    public Guid FoodId { get; set; }
    public string FoodName { get; set; }
    public string FoodPicture { get; set; }
    public int FoodPrice { get; set; }
    public int Quantity { get; set; }
    public Guid RestaurantId { get; set; }
}