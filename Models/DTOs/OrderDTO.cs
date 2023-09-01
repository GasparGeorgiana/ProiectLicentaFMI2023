namespace ProiectLicentaFMI.Models;

public class OrderDTO
{
    public Guid FoodId { get; set; }
    public string FoodName { get; set; }
    public string FoodPicture { get; set; }
    public Guid? RestaurantId { get; set; }
    public int FoodPrice { get; set; }
    public int Quantity { get; set; }
}