import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import SplitText from '../components/SplitText';

const Home = () => {
  const { currentUser, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    // Fetch the list of sponsor logos from the manifest file
    const fetchSponsors = async () => {
      try {
        const response = await fetch('/sponsors/manifest.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSponsors(data.logos.map((filename, index) => ({
          id: index + 1,
          name: filename.split('.')[0],
          logoUrl: `/sponsors/${filename}`
        })));
      } catch (error) {
        console.error("Could not fetch sponsor logos:", error);
        setSponsors([]); 
      }
    };

    fetchSponsors();
  }, []);

  const handleTeacherAccess = () => {
    if (isAuthenticated && currentUser?.role === 'teacher') {
      navigate('/teacher/dashboard');
    } else {
      navigate('/auth/login', { state: { role: 'teacher' } });
    }
  };

  const handleAdminAccess = () => {
    if (isAuthenticated && currentUser?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/auth/login', { state: { role: 'admin' } });
    }
  };

  const handleAnimationComplete = () => {
    console.log('Title animation completed!');
  };

  return (
     <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/wood-background-1.jpeg')" }}
    >
      <header className="bg-rrlc-brown bg-opacity-80 p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-center">
          <img 
            src="/logo1.avif" 
            alt="RRLC Logo" 
            className="h-10 w-auto mr-3"
          />
          <h1 className="text-white text-2xl font-bold text-center">
            RRLC QR Scavenger Hunt
          </h1>
        </div>
      </header>
      
      <div className="bg-rrlc-gold bg-opacity-90 p-3 text-center text-rrlc-brown font-medium shadow">
        Welcome to the Redwood Region Logging Conference Scavenger Hunt!
      </div>
      
      {/* Container for content with wood-grain background */}
      <div className="bg-wood-bg bg-opacity-90 rounded-lg shadow-xl my-8 mx-auto max-w-6xl p-4 md:p-8">
        <main className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center my-8">
            <div className="flex justify-center mb-4">
              <img 
                src="/logo.gif" 
                alt="RRLC Event Logo" 
                className="h-20 w-auto"
              />
            </div>
            
            {/* SplitText animation for title */}
            <SplitText
              text="Explore the Logging Conference"
              className="text-2xl font-bold text-rrlc-brown mb-4"
              delay={80}
              duration={0.8}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 50, rotationX: -90 }}
              to={{ opacity: 1, y: 0, rotationX: 0 }}
              threshold={0.2}
              rootMargin="-50px"
              textAlign="center"
              onLetterAnimationComplete={handleAnimationComplete}
            />
            
            {/* Simple paragraph text (reverted from DecryptedText) */}
            <p className="text-rrlc-charcoal mb-4">
              Discover the rich history and exciting innovations in the logging industry through our interactive QR scavenger hunt. Find all the stations around the conference to learn interesting facts and enter your class in the prize drawing!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl mx-auto">
            <div className="bg-rrlc-green-medium bg-opacity-95 p-6 rounded-lg shadow-md text-white">
              <h2 className="text-xl font-semibold">Teacher Portal</h2>
              <p className="mt-2 mb-4">Register your class and track your progress in the scavenger hunt.</p>
              <button 
                onClick={handleTeacherAccess}
                className="w-full mt-4 bg-white text-rrlc-green-medium px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition duration-200"
              >
                {isAuthenticated && currentUser?.role === 'teacher' ? 'Go to Dashboard' : 'Teacher Login/Register'}
              </button>
            </div>
            
            <div className="bg-rrlc-green-dark bg-opacity-95 p-6 rounded-lg shadow-md text-white">
              <h2 className="text-xl font-semibold">Admin Dashboard</h2>
              <p className="mt-2 mb-4">Manage stations, view class progress, and conduct drawings.</p>
              <button 
                onClick={handleAdminAccess}
                className="w-full mt-4 bg-white text-rrlc-green-dark px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition duration-200"
              >
                {isAuthenticated && currentUser?.role === 'admin' ? 'Go to Dashboard' : 'Admin Login'}
              </button>
            </div>
          </div>

          {/* Sponsors Section */}
          <section className="my-12 py-8 bg-wood-bg bg-opacity-80 rounded-lg shadow-md">
            <div className="max-w-4xl mx-auto px-4">
              <h3 className="text-2xl font-semibold text-rrlc-green-dark text-center mb-6">Our Valued Sponsors</h3>
              {sponsors.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center">
                  {sponsors.map((sponsor) => (
                    <div key={sponsor.id} className="flex justify-center">
                      <img 
                        src={sponsor.logoUrl} 
                        alt={sponsor.name} 
                        className="max-h-20 md:max-h-24 object-contain transition-transform duration-300 hover:scale-105" 
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-rrlc-charcoal text-center">Sponsor logos coming soon or failed to load.</p>
              )}
              <div className="text-center mt-8">
                <Link 
                  to="/contact-sponsorship" 
                  className="bg-rrlc-green-medium text-white px-6 py-3 rounded-full font-semibold hover:bg-rrlc-green-dark transition duration-300"
                >
                  Become a Sponsor
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
      
      <footer className="bg-rrlc-charcoal bg-opacity-80 text-white p-4 mt-8 text-center shadow-lg">
        <p>© {new Date().getFullYear()} Redwood Region Logging Conference</p>
      </footer>
    </div>
  );
};

export default Home;