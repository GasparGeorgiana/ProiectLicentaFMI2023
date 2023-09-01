using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using ProiectLicentaFMI.Models;
using ProiectLicentaFMI.Services;

namespace ProiectLicentaFMI.Controllers;
[Authorize]
[Route("Order")]
[ApiController]
[EnableCors("ReactPolicy")]
public class OrderController : BaseController
{
    private readonly OrderService _service;
    public OrderController(ControllerDependencies dependencies, OrderService service) : base(dependencies)
    {
        _service = service;
    }

    [HttpGet]
    [Route("GetPendingOrders")]
    public List<PendingOrderDTO> GetUserPendingOrders(int page)
    {
        return _service.GetPendingOrders(CurrentUser.UserId,page);
    }
    [HttpGet]
    [Route("GetYourOrders")]
    public List<PendingOrderDTO> GetYourOrders(int page)
    {
        return _service.GetYourOrders(CurrentUser.UserId,page);
    }
    [HttpGet]
    [Route("GetConfirmedOrders")]
    public List<PendingOrderDTO> GetConfirmedOrders(int page)
    {
        return _service.GetConfirmedOrders(CurrentUser.UserId,page);
    }
    [HttpGet]
    [Route("GetPastOrders")]
    public List<PendingOrderDTO> GetPastOrders(int page)
    {
        return _service.GetPastOrders(CurrentUser.UserId,page);
    }
    [HttpGet]
    [Route("CancelOrder")]
    public bool CancelOrder(Guid orderId)
    {
        return _service.CancelOrder(orderId);
    }
    [HttpGet]
    [Route("ConfirmOrder")]
    public bool ConfirmOrder(Guid orderId)
    {
        return _service.ConfirmOrder(orderId);
    }
    [HttpGet]
    [Route("FinalizeOrder")]
    public bool FinalizeOrder(Guid orderId)
    {
        return _service.FinalizeOrder(orderId);
    }
    [HttpGet]
    [Route("RepeatOrder")]
    public bool RepeatOrder(Guid orderId)
    {
        return _service.RepeatOrder(orderId);
    }
}