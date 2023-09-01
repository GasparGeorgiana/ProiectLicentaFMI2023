using AutoMapper;
using ProiectLicentaFMI.Models;

namespace ProiectLicentaFMI;

public class ServiceDependencies
{
    public IMapper Mapper { get; set; }
    public UnitOfWork UnitOfWork { get; set; }
    public CurrentUserDto CurrentUser { get; set; }

    public ServiceDependencies(IMapper mapper, UnitOfWork unitOfWork, CurrentUserDto currentUser)
    {
        Mapper = mapper;
        UnitOfWork = unitOfWork;
        CurrentUser = currentUser;
    }
}