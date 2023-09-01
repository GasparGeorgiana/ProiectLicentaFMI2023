using Microsoft.EntityFrameworkCore;
using ProiectLicentaFMI.Models;

namespace ProiectLicentaFMI.Services;

public class OrderService : BaseService
{
    private readonly RestaurantContext _context;
    public OrderService(ServiceDependencies serviceDependencies) : base(serviceDependencies)
    {
        _context = new RestaurantContext();
    }

    public List<PendingOrderDTO> GetPendingOrders(Guid currentUserUserId, int page)
    {
        return _context.Orders
           .Include(x => x.OrderFoods)
           .ThenInclude(x => x.Food)
           .Include(x => x.Restaurant)
           .Where(x => x.Type==1 && x.OrderUser==currentUserUserId)
           .Skip((page - 1) * 4)
           .Take(4)
           .Select(x=> new PendingOrderDTO()
           {
               OrderId = x.OrderId,
               Foods = x.OrderFoods.Select(y => new FoodDTO()
               {
                   FoodId = y.FoodId,
                   FoodName = y.Food.FoodName,
                   FoodPrice = int.Parse(y.Food.FoodPrice),
                   Quantity = y.Quantity,
                   FoodPicture = y.Food.FoodPicture,
                   RestaurantId = x.RestaurantId
               }).ToList(),
               RestaurantName = x.Restaurant.RestaurantName,
               RestaurantPicture = x.Restaurant.RestaurantPicture
           })
           .ToList();
    }

    public bool CancelOrder(Guid orderId)
    {
        ExecuteInTransaction(uow =>
        {
            var order = uow.PendingOrders.Get().First(x => x.OrderId == orderId);
            var orderFood = uow.OrderFoods.Get().Where(x => x.OrderId == orderId);
            foreach (var food in orderFood)
            {
                uow.OrderFoods.Delete(food);
            }
            uow.PendingOrders.Delete(order);
           uow.SaveChanges();
           return true;
        });
        return true;
    }

    public bool ConfirmOrder(Guid orderId)
    {
        ExecuteInTransaction(uow =>
        {
            var order = uow.PendingOrders.Get().First(x => x.OrderId == orderId);
            order.Type = 2;
            uow.PendingOrders.Update(order);
            uow.SaveChanges();
            return true;
        });
        return true;
    }

    public bool FinalizeOrder(Guid orderId)
    {
        ExecuteInTransaction(uow =>
        {
            var order = uow.PendingOrders.Get().First(x => x.OrderId == orderId);
            order.Type = 3;
            uow.PendingOrders.Update(order);
            uow.SaveChanges();
            return true;
        });
        return true;
    }

    public bool RepeatOrder(Guid orderId)
    {
        ExecuteInTransaction(uow =>
        {
            var order = uow.PendingOrders.Get().Include(x => x.OrderFoods).First(x => x.OrderId == orderId);
            var newOrderId = Guid.NewGuid();
            var newOrderFoods = order.OrderFoods.Select(x => new OrderFood()
            {
                FoodId = x.FoodId,
                OrderId = newOrderId,
                Quantity = x.Quantity
            }).ToList();
            var newOrder = new Order()
            {
                RestaurantId = order.RestaurantId,
                Type = 1,
                OrderId = newOrderId,
                OrderPrice = order.OrderPrice,
                OrderUser = CurrentUser.UserId,
                UserId = CurrentUser.UserId,
                OrderFoods = newOrderFoods
            };
            foreach (var newOrderFood in newOrderFoods)
            {
                uow.OrderFoods.Insert(newOrderFood);
            }
            uow.PendingOrders.Insert(newOrder);
            uow.SaveChanges();
            return true;
        });
        return true;
    }

    public List<PendingOrderDTO> GetConfirmedOrders(Guid currentUserUserId, int page)
    {
        return _context.Orders
            .Include(x => x.OrderFoods)
            .ThenInclude(x => x.Food)
            .Include(x => x.Restaurant)
            .Where(x => x.Type==2 && x.OrderUser==currentUserUserId)
            .Skip((page - 1) * 4)
            .Take(4)
            .Select(x=> new PendingOrderDTO()
            {
                OrderId = x.OrderId,
                Foods = x.OrderFoods.Select(y => new FoodDTO()
                {
                    FoodId = y.FoodId,
                    FoodName = y.Food.FoodName,
                    FoodPrice = int.Parse(y.Food.FoodPrice),
                    Quantity = y.Quantity,
                    FoodPicture = y.Food.FoodPicture,
                    RestaurantId = x.RestaurantId
                }).ToList(),
                RestaurantName = x.Restaurant.RestaurantName,
                RestaurantPicture = x.Restaurant.RestaurantPicture
            })
            .ToList();
    }

    public List<PendingOrderDTO> GetPastOrders(Guid currentUserUserId, int page)
    {
        return _context.Orders
            .Include(x => x.OrderFoods)
            .ThenInclude(x => x.Food)
            .Include(x => x.Restaurant)
            .Where(x => x.Type==3 
                        && x.OrderUser==currentUserUserId)
            .Skip((page - 1) * 4)
            .Take(4)
            .Select(x=> new PendingOrderDTO()
            {
                OrderId = x.OrderId,
                Foods = x.OrderFoods.Select(y => new FoodDTO()
                {
                    FoodId = y.FoodId,
                    FoodName = y.Food.FoodName,
                    FoodPrice = int.Parse(y.Food.FoodPrice),
                    Quantity = y.Quantity,
                    FoodPicture = y.Food.FoodPicture,
                    RestaurantId = x.RestaurantId
                }).ToList(),
                RestaurantName = x.Restaurant.RestaurantName,
                RestaurantPicture = x.Restaurant.RestaurantPicture
            })
            .ToList();
    }

    internal List<PendingOrderDTO> GetYourOrders(Guid userId, int page)
    {
        return _context.Orders
          .Include(x => x.OrderFoods)
          .ThenInclude(x => x.Food)
          .Include(x => x.Restaurant)
          .Where(x => x.Type == 1 && x.Restaurant.RestaurantOwner == CurrentUser.UserId)
          .Skip((page - 1) * 4)
          .Take(4)
          .Select(x => new PendingOrderDTO()
          {
              OrderId = x.OrderId,
              Foods = x.OrderFoods.Select(y => new FoodDTO()
              {
                  FoodId = y.FoodId,
                  FoodName = y.Food.FoodName,
                  FoodPrice = int.Parse(y.Food.FoodPrice),
                  Quantity = y.Quantity,
                  FoodPicture = y.Food.FoodPicture,
                  RestaurantId = x.RestaurantId
              }).ToList(),
              RestaurantName = x.Restaurant.RestaurantName,
              RestaurantPicture = x.Restaurant.RestaurantPicture
          })
          .ToList();
    }
}