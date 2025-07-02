import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-lg text-gray-600 mb-6">Page not found</p>
            <Link to="/" className="text-blue-600 underline">
                Go back to Home
            </Link>
        </div>
    );
};

export default NotFound;
