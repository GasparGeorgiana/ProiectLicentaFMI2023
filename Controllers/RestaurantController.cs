using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using ProiectLicentaFMI.Models;
using ProiectLicentaFMI.Services;

namespace ProiectLicentaFMI.Controllers;
[Authorize]
[Route("Restaurant")]
[ApiController]
[EnableCors("ReactPolicy")]
public class RestaurantController : BaseController
{
    private readonly RestaurantService _service;
    public IConfiguration Configuration { get; }
    public RestaurantController(ControllerDependencies dependencies, RestaurantService service, IConfiguration configuration)
        : base(dependencies)
    {
        _service = service;
        Configuration = configuration;
    }
    
    [Route("AddRestaurant")]
    [HttpPost]
    public bool AddRestaurant(RestaurantDTO restaurant)
    {
        return _service.AddRestaurant(restaurant);
    }
    [Route("SearchRestaurant")]
    [HttpGet]
    public List<RestaurantDTO> SearchRestaurant(string search)
    {
        return _service.SearchRestaurant(search);
    }
    [Route("GetRestaurantsForShow")]
    [HttpGet]
    public List<RestaurantDTO> SearchRestaurantsForShow()
    {
        return _service.SearchRestaurantForShow();
    }
    [Route("GetRestaurants")]
    [HttpGet]
    public List<RestaurantDTO> GetRestaurants(int page)
    {
        return _service.GetRestaurants(page);
    }
    [Route("GetNumberOfRestaurants")]
    [HttpGet]
    public int GetRestaurantsCount()
    {
        return _service.GetRestaurantsCount().Count;
    }
}