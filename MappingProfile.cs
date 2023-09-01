using AutoMapper;
using ProiectLicentaFMI.Models;

namespace ProiectLicentaFMI;

 public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<RegisterModel, User>();
            CreateMap<RegisterAsOwnerModel, Restaurant>();
            CreateMap<RegisterAsOwnerModel, User>()
                .ForMember(a => a.Email, a => a.MapFrom(s => s.FirstName.ToLower()+"."+s.LastName.ToLower()+"@"+s.RestaurantName.ToLower().Replace(" ","")+".com"));
            CreateMap<LoginModel, User>();
            CreateMap<User, CurrentUserDto>();
            CreateMap<CurrentUserDto, User>();
            CreateMap<FoodDTO, Food>()
                .ForMember(a => a.FoodName, a => a.MapFrom(s => s.FoodName))
                .ForMember(a => a.FoodId, a => a.MapFrom(s => s.FoodId))
                .ForMember(a => a.RestaurantId, a => a.MapFrom(s => s.RestaurantId))
                .ForMember(a => a.FoodPrice, a => a.MapFrom(s => s.FoodPrice))
                .ForMember(a => a.FoodPicture, a => a.MapFrom(s =>s.FoodPicture));
            CreateMap<RestaurantDTO, Restaurant>()
                .ForMember(a => a.RestaurantName, a => a.MapFrom(s => s.RestaurantName))
                .ForMember(a => a.RestaurantId, a => a.MapFrom(s => s.RestaurantId))
                .ForMember(a => a.RestaurantPicture, a => a.MapFrom(s =>s.RestaurantPicture));
        }
    }