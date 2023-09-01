using System;
using System.Collections.Generic;

namespace ProiectLicentaFMI.Models;

public partial class OrderFood : IEntity
{
    public Guid OrderId { get; set; }

    public Guid FoodId { get; set; }

    public int Quantity { get; set; }

    public virtual Food Food { get; set; } = null!;

    public virtual Order Order { get; set; } = null!;
}
