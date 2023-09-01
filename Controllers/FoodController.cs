using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Google.Authenticator;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ProiectLicentaFMI.Models;
using ProiectLicentaFMI.Services;
namespace ProiectLicentaFMI.Controllers;

[Authorize]
[Route("Food")]
[ApiController]
[EnableCors("ReactPolicy")]
public class FoodController : BaseController
{
    private readonly FoodService _service;
    public IConfiguration Configuration { get; }
    public FoodController(ControllerDependencies dependencies, FoodService service, IConfiguration configuration)
        : base(dependencies)
    {
        _service = service;
        Configuration = configuration;
    }
    [Route("AddFood")]
    [HttpPost]
    public bool AddFood(FoodDTO foodDto)
    {
        foodDto.RestaurantId = _service.GetRestaurant(CurrentUser.UserId);
        return  _service.AddFood(foodDto);
    }
[Route("SearchFood")]
[HttpGet]
public List<FoodDTO> SearchFood(string search)
{
    return _service.SearchFood(search);
}
[Route("GetFoodsForRestaurant")]
[HttpGet]
public List<FoodDTO> GetFoodsForRestaurant(int page, int size)
{
    var restaurantId = _service.GetRestaurant(CurrentUser.UserId);
    return _service.GetFoodsForRestaurant(restaurantId,page,size);
}
[Route("GetFoodsForRestaurantLength")]
[HttpGet]
public int GetFoodsForRestaurantLength()
{
    var restaurantId = _service.GetRestaurant(CurrentUser.UserId);
    return _service.GetFoodsForRestaurant(restaurantId);
}

   
    [Route("GetFoods")]
    [HttpGet]
    public List<FoodDTO> GetFoods(int page, Guid restaurantId)
    {
         return _service.GetFoods(page,restaurantId);
    }
    [Route("EditFood")]
    [HttpPost]
    public FoodDTO EditFood(FoodDTO foodDto)
    {
        return _service.EditFood(foodDto);
    }

    [Route("DeleteFood")]
    [HttpDelete]
    public bool DeleteFood(Guid foodId)
    {
        return _service.DeleteFood(foodId);
    }
    [Route("GetFoodsWithSearch")]
    [HttpGet]
    public List<FoodDTO> GetFoods(int page, Guid restaurantId, string search)
    {
        return _service.GetFoods(page,restaurantId,search);
    }
    [Route("GetNumberOfFoods")]
    [HttpGet]
    public int GetFoodsCount(Guid restaurantId)
    {
        return  _service.GetFoodsCount(restaurantId).Count;
    }
    [Route("GetNumberOfFoodsWithSearch")]
    [HttpGet]
    public int GetFoodsCount(Guid restaurantId, string search)
    {
        return  _service.GetFoodsCount(restaurantId, search).Count;
    }
    [Route("SubmitOrder")]
    [HttpPost]
    public bool SubmitOrder(RequestOrderDTO requestOrderDto)
    {
        return _service.SubmitOrder(requestOrderDto);
    }
}