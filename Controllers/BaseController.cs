using Microsoft.AspNetCore.Mvc;
using ProiectLicentaFMI.Models;

namespace ProiectLicentaFMI.Controllers;

public class BaseController : Controller
{
    protected readonly CurrentUserDto CurrentUser;

    public BaseController(ControllerDependencies dependencies)
        : base()
    {
        CurrentUser = dependencies.CurrentUser;
    }
}