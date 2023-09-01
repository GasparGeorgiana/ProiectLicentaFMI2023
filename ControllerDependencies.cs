using ProiectLicentaFMI.Models;

namespace ProiectLicentaFMI;

public class ControllerDependencies
{
    public CurrentUserDto CurrentUser { get; set; }

    public ControllerDependencies(CurrentUserDto currentUser)
    {
        this.CurrentUser = currentUser;
    }
}