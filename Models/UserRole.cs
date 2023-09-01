namespace ProiectLicentaFMI.Models;

public partial class UserRole : IEntity
{
    public int Id { get; set; }

    public string Role { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}