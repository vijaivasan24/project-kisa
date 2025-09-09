import { useLocation } from 'wouter';

export function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: '/', icon: 'fas fa-home', label: 'Home' },
    { path: '/scan', icon: 'fas fa-camera', label: 'Scan' },
    { path: '/market', icon: 'fas fa-chart-line', label: 'Market' },
    { path: '/schemes', icon: 'fas fa-landmark', label: 'Schemes' },
    { path: '/weather', icon: 'fas fa-cloud-sun', label: 'Weather' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center space-y-1 p-2 ${
                location === item.path ? 'text-farm-green' : 'text-gray-600'
              }`}
            >
              <i className={`${item.icon} text-xl`}></i>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
