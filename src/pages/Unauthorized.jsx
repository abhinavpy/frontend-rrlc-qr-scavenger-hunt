import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-wood-bg flex flex-col">
      <div className="bg-rrlc-brown p-4">
        <Link to="/" className="text-white text-lg font-semibold">
          ← Back to Home
        </Link>
      </div>
      
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">403</div>
          <h2 className="text-2xl font-bold text-rrlc-brown mb-4">Access Denied</h2>
          <p className="text-rrlc-charcoal mb-6">
            You don't have permission to access this page.
          </p>
          <Link 
            to="/"
            className="inline-block bg-rrlc-green-medium text-white py-2 px-6 rounded-full font-medium hover:bg-rrlc-green-dark transition duration-200"
          >
            Return to Home
          </Link>
        </div>
      </div>
      
      <footer className="bg-rrlc-charcoal text-white p-4 text-center">
        <p>© 2025 Redwood Region Logging Conference</p>
      </footer>
    </div>
  );
};

export default Unauthorized;