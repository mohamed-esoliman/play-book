"use client";

const Footer = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-white text-xl font-bold">PlayBook</span>
            <p className="mt-2 text-gray-400 text-sm max-w-md">
              Track your favorite games, discover new ones, and connect with other gamers.
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Mohamed Soliman. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 