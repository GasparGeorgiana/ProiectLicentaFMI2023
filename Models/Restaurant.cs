namespace ProiectLicentaFMI.Models;

public class Restaurant : IEntity
{
    public Guid RestaurantId { get; set; }

    public string RestaurantName { get; set; } = null!;

    public string RestaurantPicture { get; set; } = null!;

    public Guid? RestaurantOwner { get; set; }

    public virtual ICollection<Food> Foods { get; set; } = new List<Food>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual User? RestaurantOwnerNavigation { get; set; }
}