using ProiectLicentaFMI.Models;

namespace ProiectLicentaFMI;

public class UnitOfWork
    {
        private readonly RestaurantContext _context;

        public UnitOfWork(RestaurantContext context)
        {
            _context = context;
        }

        private IRepository<User>? _users;
        public IRepository<User> Users => _users ??= new BaseRepository<User>(_context);
        
        private IRepository<Cart>? _carts;
        public IRepository<Cart> Carts => _carts ??= new BaseRepository<Cart>(_context);
        
        private IRepository<Food>? _foods;
        public IRepository<Food> Foods => _foods ??= new BaseRepository<Food>(_context);

        private IRepository<OrderFood>? _orderFoods;
        public IRepository<OrderFood> OrderFoods => _orderFoods ??= new BaseRepository<OrderFood>(_context);

        private IRepository<Order>? _pendingOrders;
        public IRepository<Order> PendingOrders => _pendingOrders ??= new BaseRepository<Order>(_context);
        
        private IRepository<Restaurant>? _restaurants;
        public IRepository<Restaurant> Restaurants => _restaurants ??= new BaseRepository<Restaurant>(_context);
        
        private IRepository<OrderType>? _orderTypes;
        public IRepository<OrderType> OrderTypes => _orderTypes ??= new BaseRepository<OrderType>(_context);
        private IRepository<UserRole>? _userRoles;
        public IRepository<UserRole> UserRoles => _userRoles ??= new BaseRepository<UserRole>(_context);
        
        public void SaveChanges()
        {
             _context.SaveChanges();
        }
    }