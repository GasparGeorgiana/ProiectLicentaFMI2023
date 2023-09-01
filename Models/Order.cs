namespace ProiectLicentaFMI.Models;

public partial class Order : IEntity
{
    public Guid OrderId { get; set; }

    public int OrderPrice { get; set; }

    public Guid OrderUser { get; set; }

    public Guid RestaurantId { get; set; }

    public int Type { get; set; }

    public Guid? UserId { get; set; }

    public virtual ICollection<OrderFood> OrderFoods { get; set; } = new List<OrderFood>();

    public virtual Restaurant Restaurant { get; set; } = null!;

    public virtual OrderType TypeNavigation { get; set; } = null!;

    public virtual User? User { get; set; }
}
