namespace ProiectLicentaFMI.Models;

public class CartItemDTO
{
    public string FoodName { get; set; } = null!;

    public string FoodPrice { get; set; } = null!;
    public int Quantity { get; set; }
}