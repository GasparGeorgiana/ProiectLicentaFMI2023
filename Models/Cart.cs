namespace ProiectLicentaFMI.Models;

public class Cart : IEntity
{
    public Guid UserId { get; set; }

    public Guid FoodId { get; set; }

    public int Quantity { get; set; }

    public virtual Food Food { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}