using Microsoft.EntityFrameworkCore;
using ProiectLicentaFMI.Models;

namespace ProiectLicentaFMI.Services;

public class CartService : BaseService
{
    private readonly RestaurantContext _context;
    
    public CartService(ServiceDependencies serviceDependencies) : base(serviceDependencies)
    {
        _context = new RestaurantContext();
    }

    public async Task<RequestOrderDTO> GetCartItems(Guid currentUserUserId)
    {
        var requestOrder = new RequestOrderDTO()
        {
            Orders = new List<OrderDTO>()
        };
        await _context.Carts
            .Include(x => x.Food)
            .ThenInclude(x => x.Restaurant)
            .Where(x => x.UserId == currentUserUserId)
            .ForEachAsync(x => requestOrder.Orders.Add(new OrderDTO()
            {
                FoodId = x.Food.FoodId,
                FoodName = x.Food.FoodName,
                Quantity = x.Quantity,
                FoodPicture = x.Food.FoodPicture,
                RestaurantId = x.Food.RestaurantId,
                FoodPrice = int.Parse(x.Food.FoodPrice)
            }));
        return requestOrder;
    }

    public bool AddToCart(RequestOrderDTO dto)
    {
        ExecuteInTransaction(uow =>
        {
            var listOfCurrentUserCarts = uow.Carts
                .Get()
                .Where(x => x.UserId == CurrentUser.UserId)
                .ToList();
            
            var groupedCart= dto.Orders
                .GroupBy(x => x.FoodId)
                .Where(x => x.Count() > 1  )
                .SelectMany(x => x)
                .ToList();
            
            dto.Orders=dto.Orders
                .GroupBy(x => x.FoodId)
                .Select(x => x.First()).ToList();
            
            foreach (var cartItem in listOfCurrentUserCarts)
            {
                uow.Carts.Delete(cartItem);
            }
            foreach (var cartItem in dto.Orders.Select(order => new Cart()
                     {
                         FoodId = order.FoodId,
                         UserId = CurrentUser.UserId,
                         Quantity = order.Quantity,
                     }))
            {
                if (groupedCart.Exists(x => x.FoodId == cartItem.FoodId))
                {
                    var newCartItem = new Cart()
                    {
                        FoodId = cartItem.FoodId,
                        UserId = CurrentUser.UserId,
                        Quantity = groupedCart.Where(x => x.FoodId == cartItem.FoodId).Select(x => x.Quantity).ToList()
                            .Sum()
                    };
                    uow.Carts.Insert(newCartItem);
                }
                else
                    uow.Carts.Insert(cartItem);
            }

            uow.SaveChanges();
        });
        return true;
    }
}