using System;
using System.Collections.Generic;

namespace ProiectLicentaFMI.Models;

public partial class Food :IEntity
{
    public Guid FoodId { get; set; }

    public string FoodName { get; set; } = null!;

    public string FoodPrice { get; set; } = null!;

    public string FoodPicture { get; set; } = null!;

    public Guid? RestaurantId { get; set; }

    public virtual ICollection<Cart> Carts { get; set; } = new List<Cart>();

    public virtual ICollection<OrderFood> OrderFoods { get; set; } = new List<OrderFood>();

    public virtual Restaurant? Restaurant { get; set; }
}
