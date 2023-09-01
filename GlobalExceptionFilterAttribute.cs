using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ProiectLicentaFMI;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
public sealed class GlobalExceptionFilterAttribute : ExceptionFilterAttribute
{
    public override void OnException(ExceptionContext context)
    {
        context.ExceptionHandled = true;

        context.Result = context.Exception switch
        {
            NotFoundErrorException => new ViewResult { ViewName = "Views/Shared/Error_NotFound.html" },
            UnauthorizedAccessException => new ViewResult
            {
                ViewName = "Views/Shared/Error_Unauthorized.html"
            },
            _ => new ViewResult { ViewName = "Views/Shared/Error_InternalServerError.html" }
        };
    }
}