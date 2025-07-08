import { NavLink } from "react-router-dom";
import React from "react";
import ApperIcon from "@/components/ApperIcon";

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
          <NavItem key={item.path} to={item.path} icon={item.icon} label={item.name} />
        ))}
      </div>
    </nav>
  );
};

const NavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className="flex flex-col items-center justify-center flex-1 py-2"
    >
      {({ isActive }) => (
        <>
          <ApperIcon 
            name={icon} 
            className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-600'}`} 
          />
          <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-gray-600'}`}>
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
};

export default BottomNav;