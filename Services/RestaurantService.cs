using ProiectLicentaFMI.Models;

namespace ProiectLicentaFMI.Services;

public class RestaurantService : BaseService
{
    private readonly RestaurantContext _context;

    public RestaurantService(ServiceDependencies dependencies)
        : base(dependencies)
    {
        _context = new RestaurantContext();
    }

    public bool AddRestaurant(RestaurantDTO restaurantDto)
    {
        ExecuteInTransaction(uow =>
        {
            var restaurant = Mapper.Map<Restaurant>(restaurantDto);
            restaurant.RestaurantId = Guid.NewGuid();
            restaurant.RestaurantOwner = CurrentUser.UserId;
            uow.Restaurants.Insert(restaurant);
            uow.SaveChanges();
            return true;
        });
        return true;
    }

    public List<RestaurantDTO> SearchRestaurant(string search)
    {
        return _context.Restaurants
            .Where(x => x.RestaurantOwner == CurrentUser.UserId && x.RestaurantName.ToLower().StartsWith(search.ToLower())).Select(x => new RestaurantDTO
            {
                RestaurantId = x.RestaurantId,
                RestaurantName = x.RestaurantName,
                RestaurantPicture = x.RestaurantPicture
            }).ToList();
    }

    public List<RestaurantDTO> SearchRestaurantForShow()
    {
        return _context.Restaurants
            .Where(x => x.RestaurantOwner != CurrentUser.UserId)
            .OrderBy(x => Guid.NewGuid())
            .Take(8)
            .Select(x => new RestaurantDTO()
        {
            RestaurantName = x.RestaurantName,
            RestaurantId = x.RestaurantId,
            RestaurantPicture = x.RestaurantPicture
        }).ToList();
    }

    public List<RestaurantDTO> GetRestaurants(int page)
    {
        return _context.Restaurants
            .Where(x => x.RestaurantOwner != CurrentUser.UserId)
            .Skip((page - 1) * 4)
            .Take(4)
            .Select(x => new RestaurantDTO()
        {
            RestaurantName = x.RestaurantName,
            RestaurantId = x.RestaurantId,
            RestaurantPicture = x.RestaurantPicture
        }).ToList();
    }

    public List<RestaurantDTO>  GetRestaurantsCount()
    {
        return _context.Restaurants
            .Where(x => x.RestaurantOwner != CurrentUser.UserId)
            .Select(x => new RestaurantDTO()
        {
            RestaurantName = x.RestaurantName,
            RestaurantId = x.RestaurantId,
            RestaurantPicture = x.RestaurantPicture
        }).ToList();
    }
}