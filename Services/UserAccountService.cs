using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using ProiectLicentaFMI.Models;

namespace ProiectLicentaFMI.Services;

public class UserAccountService : BaseService
    {
        private readonly RestaurantContext _context;

        public UserAccountService(ServiceDependencies dependencies)
            : base(dependencies)
        {
            _context = new RestaurantContext();
        }
        
        public async Task<bool> CheckEmailAvailability(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(c => c.Email == email) == null;
        }
        

        public void RegisterNewUser(RegisterModel model)
        {
            ExecuteInTransaction(uow =>
            {
                var user = Mapper.Map<User>(model);
                user.UserId = Guid.NewGuid();
                user.Role = 1;
                uow.Users.Insert(user);
                uow.SaveChanges();
            });
        }

        public async Task<bool> CheckEmail(string email) => await _context.Users.AnyAsync(x => x.Email == email);

        public async Task<bool> CheckUserCredentials(string email, string password) => await _context.Users.AnyAsync(x => x.Email == email && x.Password == password);

        public async Task<bool> CheckValidity(string email)
        {
            return await _context.Users.AnyAsync(x => x.Email == email);
        }

        public async Task<CurrentUserDto> LoginAsync(string email, string password)
        {
            var user = await UnitOfWork.Users.Get().FirstOrDefaultAsync(u => u.Email == email && u.Password == password);

            if (user == null)
            {
                return new CurrentUserDto { IsAuthenticated = false };
            }
            var userDto = Mapper.Map<CurrentUserDto>(user);
            userDto.IsAuthenticated = true;
            return userDto;
        }
        
        public async Task<bool> CheckEmailAvailability(string email1, string email2) => email1 == email2 || !(await _context.Users.AnyAsync(x => x.Email == email1));
        
        public CurrentUserDto LoginWithFacebook(LoginWithFacebookModel loginModel)
        {
            var userByMail = _context.Users.FirstOrDefault(x => x.Email == loginModel.Email);
            if (userByMail == null)
            {
                var userByToken = _context.Users.FirstOrDefault(x => x.FacebookToken == loginModel.UserId);
                if (userByToken != null) return Mapper.Map<CurrentUserDto>(userByToken);
                var user = new User()
                {
                    FacebookToken = loginModel.UserId,
                    Password = BCrypt.Net.BCrypt.EnhancedHashPassword(loginModel.UserId + loginModel.Email, 13),
                    Email = loginModel.Email,
                    FirstName = loginModel.FirstName,
                    LastName = loginModel.LastName,
                    Role = 1,
                    UserId = Guid.NewGuid()
                };
                _context.Users.Add(user);
                _context.SaveChanges();
                return Mapper.Map<CurrentUserDto>(user);

            }
            userByMail.FacebookToken = loginModel.UserId;
            _context.Users.Update(userByMail);
            _context.SaveChanges();
            return Mapper.Map<CurrentUserDto>(userByMail);
        }

        public CurrentUserDto LoginWithGoogle(LoginWithGoogleModel loginModel)
        {
            var userByMail = _context.Users.FirstOrDefault(x => x.Email == loginModel.Email);
            if (userByMail == null)
            {
                var userByToken = _context.Users.FirstOrDefault(x => x.GoogleToken == loginModel.UserId);
                if (userByToken != null) return Mapper.Map<CurrentUserDto>(userByToken);
                var user = new User()
                {
                    GoogleToken = loginModel.UserId,
                    Password = BCrypt.Net.BCrypt.EnhancedHashPassword(loginModel.UserId + loginModel.Email, 13),
                    Email = loginModel.Email,
                    FirstName = loginModel.Name,
                    LastName = loginModel.Name,
                    Role = 1,
                    UserId = Guid.NewGuid()
                };
                _context.Users.Add(user);
                _context.SaveChanges();
                return Mapper.Map<CurrentUserDto>(user);

            }
            userByMail.GoogleToken = loginModel.UserId;
            _context.Users.Update(userByMail);
            _context.SaveChanges();
            return Mapper.Map<CurrentUserDto>(userByMail);
        }

        public void RegisterNewOwner(RegisterAsOwnerModel model)
        {
            ExecuteInTransaction(uow =>
            {
                var user = Mapper.Map<User>(model);
                user.UserId = Guid.NewGuid();
                user.Role = 2;
                var restaurant = Mapper.Map<Restaurant>(model);
                restaurant.RestaurantId = Guid.NewGuid();
                restaurant.RestaurantOwner = user.UserId;
                uow.Restaurants.Insert(restaurant);
                uow.Users.Insert(user);
                uow.SaveChanges();
            });
        }
    }