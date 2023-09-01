namespace ProiectLicentaFMI.Models;

public class OrderType : IEntity
{
    public int Id { get; set; }

    public string Type { get; set; } = null!;

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}