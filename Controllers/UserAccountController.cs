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

    [Route("useraccount")]
    [ApiController]
    [EnableCors("ReactPolicy")]
    public class UserAccountController : BaseController
    {
        private readonly UserAccountService _service;
        public IConfiguration Configuration { get; }
        public UserAccountController(ControllerDependencies dependencies, UserAccountService service, IConfiguration configuration)
           : base(dependencies)
        {
            _service = service;
            Configuration = configuration;
        }

        [Route("emailAvailability")]
        public async Task<bool> CheckEmailAvailability(string email) => await _service.CheckEmailAvailability(email);

        [Route("Register")]
        [HttpPost]
        public async Task<bool> Register( RegisterModel model)
        {
            var emailAvailable = await _service.CheckEmailAvailability(model.Email);

            if (!emailAvailable)
            {
                return false;
            }

            _service.RegisterNewUser(model);
            return true;
        }
        [Route("RegisterAsOwner")]
        [HttpPost]
        public async Task<bool> RegisterAsOwner( RegisterAsOwnerModel model)
        {
            var emailAvailable = await _service.CheckEmailAvailability(model.FirstName.ToLower() + "." + model.LastName.ToLower() + "@" +
                                                                       model.RestaurantName.ToLower() + ".com");
            if (!emailAvailable)
            {
                return false;
            }

            _service.RegisterNewOwner(model);
            return true;
        }
        public IActionResult Preview(string act, string ctl, string obj)
        {
            TempData["Data"] = obj;
            return RedirectToAction(act, ctl);
        }
        [HttpPost]
        [Route("Login")]
        public async Task<bool> Login(LoginModel model)
        {
            var checkEmail = await _service.CheckEmail(model.Email);
            var checkCredentials = await _service.CheckUserCredentials(model.Email, model.Password);

            return checkEmail && checkCredentials && model.Password != string.Empty;
        }
        [HttpGet]
        [Route("GetImage")]
        public Image2FactorModel GetImageFor2Factor(string email)
        {
      
            var twoFactorAuthenticator = new TwoFactorAuthenticator();
            var twoFactorSecretCode = Configuration["CommonSettings:SecretCode"];
            var accountSecretKey = $"{twoFactorSecretCode}-{email}";
            var setupCode = twoFactorAuthenticator.GenerateSetupCode("Restaurant", "My Restaurant",
                Encoding.ASCII.GetBytes(accountSecretKey));
            Image2FactorModel image2FactorModel = new()
            {
                Key = accountSecretKey,
                BarcodeImageUrl = setupCode.QrCodeSetupImageUrl,
                SetupCode = setupCode.ManualEntryKey
            };
          
            return image2FactorModel;
        }

        [HttpPost]
        [Route("Login2FactorPost")]
        public async Task<ActionResult<CurrentUserDto>> LoginWith2Factor(LoginWith2FactorModel loginModel)
        {
            var twoFactorAuthenticator = new TwoFactorAuthenticator();
            var checkValidity = twoFactorAuthenticator.ValidateTwoFactorPIN(loginModel.Key, loginModel.InputCode);
            if (!checkValidity)
            {
                return new CurrentUserDto();
            }
            var user =  await _service.LoginAsync(loginModel.Email, loginModel.Password);

            if (!user.IsAuthenticated)
            {
                return new CurrentUserDto();
            }

            var token = CreateToken(user);

            return Ok(token);
        }

        [HttpPost]
        [Route("LoginWithFacebook")]
        public ActionResult<CurrentUserDto> LoginWithFacebook(LoginWithFacebookModel loginModel)
        {
            var user = _service.LoginWithFacebook(loginModel);
            var token = CreateToken(user);
            return Ok(token);
        }
        [HttpPost]
        [Route("LoginWithGoogle")]
        public ActionResult<CurrentUserDto> LoginWithGoogle(LoginWithGoogleModel loginModel)
        {
            var user = _service.LoginWithGoogle(loginModel);
            var token = CreateToken(user);
            return Ok(token);
        }
        [HttpGet]
        [Route("currentUser")]
        public CurrentUserDto GetCurrentUser()
        {
            return CurrentUser;
        }
        [HttpGet]
        [Route("Logout")]
        public async Task<CurrentUserDto> Logout()
        {
            await LogOut();

            return new CurrentUserDto();
        }

        private static string CreateToken(CurrentUserDto user)
        {
            var claims = new List<Claim>
            {
                new("Id", user.UserId.ToString()),
                new(ClaimTypes.Role, $"{user.Role}"),
                new(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new(ClaimTypes.Email, user.Email),
            };

            var key = new SymmetricSecurityKey("proiect licenta ase"u8.ToArray());

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        private async Task LogOut() => await HttpContext.SignOutAsync(scheme: "SocializRCookies");
    }