using ProiectLicentaFMI.Models;

namespace ProiectLicentaFMI.Services;

public class FoodService : BaseService
{
    private readonly RestaurantContext _context;

    public FoodService(ServiceDependencies dependencies)
        : base(dependencies)
    {
        _context = new RestaurantContext();
    }

    public  bool AddFood(FoodDTO foodDto)
    {
        ExecuteInTransaction(uow =>
        {
            var food = Mapper.Map<Food>(foodDto);
            food.FoodId = Guid.NewGuid();
            uow.Foods.Insert(food);
            uow.SaveChanges();
            return true;
        });
        return true;
    }

    public List<FoodDTO> GetFoods(int page,Guid restaurantId)
    {
        return _context.Foods
            .Where(x => x.RestaurantId==restaurantId)
            .Skip((page - 1) * 4)
            .Take(4)
            .Select(x => new FoodDTO()
        {
            FoodName = x.FoodName,
            FoodId = x.FoodId,
            FoodPicture = x.FoodPicture,
            FoodPrice = int.Parse(x.FoodPrice)
        }).ToList();
    }
    public List<FoodDTO> GetFoods(int page,Guid restaurantId, string search)
    {
        return _context.Foods
            .Where(x => x.RestaurantId==restaurantId && x.FoodName.ToLower().StartsWith(search.ToLower()))
            .Skip((page - 1) * 4)
            .Take(4)
            .Select(x => new FoodDTO()
            {
                FoodName = x.FoodName,
                FoodId = x.FoodId,
                FoodPicture = x.FoodPicture,
                FoodPrice = int.Parse(x.FoodPrice)
            }).ToList();
    }
    public List<FoodDTO> GetFoodsCount(Guid restaurantId)
    {
        return _context.Foods
            .Where(x => x.RestaurantId==restaurantId)
            .Select(x => new FoodDTO()
        {
            FoodName = x.FoodName,
            FoodId = x.FoodId,
            FoodPicture = x.FoodPicture,
            FoodPrice = int.Parse(x.FoodPrice)
        }).ToList();
    }
    public List<FoodDTO> GetFoodsCount(Guid restaurantId, string search)
    {
        return _context.Foods
            .Where(x => x.RestaurantId==restaurantId && x.FoodName.ToLower().StartsWith(search.ToLower()))
            .Select(x => new FoodDTO()
            {
                FoodName = x.FoodName,
                FoodId = x.FoodId,
                FoodPicture = x.FoodPicture,
                FoodPrice = int.Parse(x.FoodPrice)
            }).ToList();
    }
    public List<FoodDTO> SearchFood(string search)
    {
        return _context.Foods
            .Where(x => x.FoodName.ToLower().StartsWith(search.ToLower()))
            .Select(x => new FoodDTO()
        {
            FoodName = x.FoodName,
            FoodId = x.FoodId,
            FoodPicture = x.FoodPicture,
            FoodPrice = int.Parse(x.FoodPrice)
        }).ToList();
    }

    public bool SubmitOrder(RequestOrderDTO orders)
    {
        ExecuteInTransaction(uow =>
        {
            var ordersGroupedByRestaurantId = orders.Orders
                .GroupBy(x => x.RestaurantId)
                .Select(x => new
            {
                x.Key,
                Items = x.ToList()
            })
                .ToList();
            foreach (var orderByRestaurantId in ordersGroupedByRestaurantId)
            {
                var currentOrder = new Order
                {
                    OrderId = Guid.NewGuid(),
                    OrderUser = CurrentUser.UserId,
                    RestaurantId = orderByRestaurantId.Key ?? Guid.Empty,
                    Type = 1
                };
                foreach (var order in orderByRestaurantId.Items)
                {
                    currentOrder.OrderPrice += order.FoodPrice * order.Quantity;
                    currentOrder.OrderFoods.Add(new OrderFood()
                    {
                        FoodId = order.FoodId,
                        OrderId = currentOrder.OrderId,
                        Quantity = order.Quantity
                    });
                }

                uow.PendingOrders.Insert(currentOrder);
            }

            var ordersFromCart = uow.Carts.Get().Where(x => x.UserId == CurrentUser.UserId).ToList();
            foreach (var orderFromCart in ordersFromCart)
            {
                uow.Carts.Delete(orderFromCart);
            }
            uow.SaveChanges();
        });
        return true;
    }

    public Guid GetRestaurant(Guid currentUserUserId)
    {
        return _context.Restaurants.First(x => x.RestaurantOwner.Equals(currentUserUserId)).RestaurantId;
    }

    public List<FoodDTO> GetFoodsForRestaurant(Guid restaurantId,int page, int size)
    {
        return _context.Foods
            .Where(x => x.RestaurantId==restaurantId)
            .Skip((page - 1) * size)
            .Take(size)
            .Select(x => new FoodDTO()
            {
                FoodName = x.FoodName,
                FoodId = x.FoodId,
                RestaurantId = restaurantId,
                FoodPicture = x.FoodPicture,
                FoodPrice = int.Parse(x.FoodPrice)
            }).ToList();
    }

    public int GetFoodsForRestaurant(Guid restaurantId)
    {
        return _context.Foods
            .Count(x => x.RestaurantId == restaurantId);
    }

    public FoodDTO EditFood(FoodDTO foodDto)
    {
        ExecuteInTransaction(uow =>
        {
            var food = Mapper.Map<Food>(foodDto);
            uow.Foods.Update(food);
            uow.SaveChanges();
            return foodDto;
        });
        return foodDto;
    }

    public bool DeleteFood(Guid id)
    {
        ExecuteInTransaction(uow =>
        {
            var food = uow.Foods.Get().First(x => x.FoodId==id);
            uow.Foods.Delete(food);
            uow.SaveChanges();
            return true;
        });
        return true;
    }
}