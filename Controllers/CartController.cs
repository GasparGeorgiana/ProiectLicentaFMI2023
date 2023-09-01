using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using ProiectLicentaFMI.Models;
using ProiectLicentaFMI.Services;

namespace ProiectLicentaFMI.Controllers;
[Authorize]
[Route("Cart")]
[ApiController]
[EnableCors("ReactPolicy")]
public class CartController : BaseController
{
    private readonly CartService _service;
    public CartController(ControllerDependencies dependencies, CartService service) : base(dependencies)
    {
        _service = service;
    }

    [HttpGet]
    [Route("GetCartItems")]
    public async Task<RequestOrderDTO> GetCartItems()
    {
        return await _service.GetCartItems(CurrentUser.UserId);
    }

    [HttpPost]
    [Route("AddToCart")]
    public bool AddToCart(RequestOrderDTO Items)
    {
        return _service.AddToCart(Items);
    }
}
