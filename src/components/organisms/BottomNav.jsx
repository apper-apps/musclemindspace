import { NavLink } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const BottomNav = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'Home' },
    { name: 'Muscle Map', path: '/muscle-map', icon: 'Target' },
    { name: 'My Routine', path: '/routine', icon: 'Dumbbell' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-30 lg:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <ApperIcon 
                  name={item.icon} 
                  className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-600'}`} 
                />
                <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-gray-600'}`}>
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;