import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/apiClient'; // Import apiClient
import Layout from '../../components/common/Layout';
import { AuthContext } from '../../contexts/AuthContext';

const TeacherDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showClassForm, setShowClassForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    school: currentUser?.school || '',
    studentCount: '',
    classPicture: '',
    description: ''
  });

  // Fetch teacher's classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await apiClient.get('/api/classes'); // Use apiClient
        setClasses(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load classes');
        setLoading(false);
        console.error('Error fetching classes:', err);
      }
    };

    fetchClasses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/api/classes', formData); // Use apiClient
      setClasses([...classes, response.data.data]);
      setShowClassForm(false);
      setFormData({
        name: '',
        grade: '',
        school: currentUser?.school || '',
        studentCount: '',
        classPicture: '',
        description: ''
      });
    } catch (err) {
      setError('Failed to create class');
      console.error('Error creating class:', err);
    }
  };

  const isValidImageUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    } catch {
      return false;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-rrlc-brown">Teacher Dashboard</h1>
          <button
            onClick={() => setShowClassForm(!showClassForm)}
            className="bg-rrlc-green-medium text-white px-4 py-2 rounded-full hover:bg-rrlc-green-dark transition duration-200"
          >
            {showClassForm ? 'Cancel' : 'Add New Class'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {showClassForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-rrlc-brown mb-4">Create New Class</h2>
            <form onSubmit={handleCreateClass}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="name">
                    Class Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                    placeholder="e.g., Mrs. Smith's 4th Grade"
                    required
                  />
                </div>
                <div>
                  <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="grade">
                    Grade Level *
                  </label>
                  <input
                    id="grade"
                    name="grade"
                    type="text"
                    value={formData.grade}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                    placeholder="e.g., 4th Grade"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="school">
                    School *
                  </label>
                  <input
                    id="school"
                    name="school"
                    type="text"
                    value={formData.school}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                    placeholder="School Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="studentCount">
                    Number of Students *
                  </label>
                  <input
                    id="studentCount"
                    name="studentCount"
                    type="number"
                    min="1"
                    value={formData.studentCount}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                    placeholder="e.g., 25"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="classPicture">
                  Class Picture URL
                </label>
                <input
                  id="classPicture"
                  name="classPicture"
                  type="url"
                  value={formData.classPicture}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                  placeholder="https://example.com/class-photo.jpg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="description">
                  Class Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                  placeholder="Brief description of your class..."
                  rows="2"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-rrlc-green-medium text-white px-6 py-2 rounded-full hover:bg-rrlc-green-dark transition duration-200"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rrlc-green-medium"></div>
          </div>
        ) : classes.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold text-rrlc-brown mb-4">No Classes Yet</h2>
            <p className="text-rrlc-charcoal mb-6">
              You haven't created any classes yet. Click the "Add New Class" button to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <ClassCard key={classItem._id} classItem={classItem} isValidImageUrl={isValidImageUrl} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

// Enhanced Class Card Component with clickable dropdown
const ClassCard = ({ classItem, isValidImageUrl }) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [classDetails, setClassDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [expandedStation, setExpandedStation] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await apiClient.get(`/api/classes/${classItem._id}/progress`); // Use apiClient
        setProgress(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching class progress:', err);
        setLoading(false);
      }
    };

    fetchProgress();
  }, [classItem._id]);

  const handleCardClick = async () => {
    if (!isExpanded) {
      setDetailsLoading(true);
      try {
        console.log('Fetching details for class:', classItem._id);
        const response = await apiClient.get(`/api/classes/${classItem._id}/details`); // Use apiClient
        console.log('Class details response:', response.data);
        setClassDetails(response.data.data);
      } catch (err) {
        console.error('Error fetching class details:', err);
        console.error('Error response:', err.response?.data);
      } finally {
        setDetailsLoading(false);
      }
    }
    setIsExpanded(!isExpanded);
    setExpandedStation(null); // Close any expanded stations
  };

  const handleStationClick = (stationId, e) => {
    e.stopPropagation(); // Prevent card click
    setExpandedStation(expandedStation === stationId ? null : stationId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 ${isExpanded ? 'col-span-full' : ''}`}>
      {/* Class Picture Header */}
      <div 
        className={`relative cursor-pointer ${isExpanded ? 'hover:opacity-90' : 'hover:opacity-95'} transition-opacity`}
        onClick={handleCardClick}
      >
        {classItem.classPicture && isValidImageUrl(classItem.classPicture) ? (
          <div className="h-32 bg-cover bg-center relative" style={{ backgroundImage: `url(${classItem.classPicture})` }}>
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="text-lg font-semibold">{classItem.name}</h3>
              <p className="text-sm opacity-90">{classItem.grade} • {classItem.school}</p>
            </div>
            <div className="absolute top-2 right-2">
              <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-rrlc-green-medium p-4 text-white relative">
            <h3 className="text-lg font-semibold">{classItem.name}</h3>
            <p className="text-sm opacity-90">{classItem.grade} • {classItem.school}</p>
            <div className="absolute top-2 right-2">
              <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        {classItem.description && (
          <p className="text-sm text-gray-600 mb-3">{classItem.description}</p>
        )}

        <div className="flex justify-between items-center mb-2">
          <span className="text-rrlc-charcoal text-sm font-medium">Class Code:</span>
          <span className="bg-gray-100 px-3 py-1 rounded text-rrlc-brown font-mono text-sm">
            {classItem.classCode}
          </span>
        </div>
        
        <div className="mb-4">
          <span className="text-rrlc-charcoal text-sm font-medium">Students: </span>
          <span>{classItem.studentCount}</span>
        </div>
        
        {loading ? (
          <div className="h-16 flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-rrlc-green-medium"></div>
          </div>
        ) : progress ? (
          <>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-rrlc-charcoal">Progress:</span>
                <span className="font-medium text-rrlc-green-dark">
                  {progress.completedCount} of {progress.totalStations} stations
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-rrlc-green-medium h-2.5 rounded-full" 
                  style={{ width: `${progress.progressPercentage}%` }}
                ></div>
              </div>
            </div>
            
            {progress.isCompleted && (
              <div className="text-sm text-green-600 mb-2">
                <span className="font-medium">✓ Complete!</span> 
                {progress.completionTime && ` Finished in ${Math.round(progress.completionTime)} minutes`}
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-rrlc-charcoal mb-2">
            No stations scanned yet
          </div>
        )}
        
        {!isExpanded && (
          <div className="mt-4 flex justify-between">
            <Link 
              to={`/teacher/scan?classId=${classItem._id}`}
              onClick={(e) => e.stopPropagation()}
              className="bg-rrlc-green-medium text-white px-4 py-2 rounded-full text-sm hover:bg-rrlc-green-dark transition duration-200"
            >
              Scan QR
            </Link>
            
            <button 
              onClick={handleCardClick}
              className="border border-rrlc-green-medium text-rrlc-green-medium px-4 py-2 rounded-full text-sm hover:bg-rrlc-green-medium hover:text-white transition duration-200"
            >
              View Details
            </button>
          </div>
        )}

        {/* Expanded Content - Scanned Stations */}
        {isExpanded && (
          <div className="mt-4 border-t pt-4">
            {detailsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rrlc-green-medium"></div>
              </div>
            ) : classDetails && classDetails.scannedStations.length > 0 ? (
              <>
                <h4 className="text-lg font-semibold text-rrlc-brown mb-4">
                  Scanned Stations ({classDetails.scannedStations.length})
                </h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {classDetails.scannedStations.map((scanData, index) => (
                    <div key={scanData.scanId} className="border border-gray-200 rounded-lg">
                      <div
                        className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={(e) => handleStationClick(scanData.station._id, e)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-rrlc-green-medium text-white rounded-full flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <h5 className="font-medium text-rrlc-brown">{scanData.station.name}</h5>
                              <p className="text-xs text-gray-500">Scanned: {formatDate(scanData.scannedAt)}</p>
                            </div>
                          </div>
                          <div className={`transform transition-transform duration-200 ${expandedStation === scanData.station._id ? 'rotate-180' : ''}`}>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Station Details Dropdown */}
                      {expandedStation === scanData.station._id && (
                        <div className="border-t border-gray-200 p-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Station Image */}
                            {scanData.station.imageUrl && isValidImageUrl(scanData.station.imageUrl) && (
                              <div className="md:col-span-2">
                                <img
                                  src={scanData.station.imageUrl}
                                  alt={scanData.station.name}
                                  className="w-full h-48 object-cover rounded-lg"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}

                            {/* Station Info */}
                            <div className="space-y-3">
                              {scanData.station.description && (
                                <div>
                                  <h6 className="font-medium text-rrlc-brown text-sm">Description:</h6>
                                  <p className="text-sm text-gray-600">{scanData.station.description}</p>
                                </div>
                              )}

                              {scanData.station.educationalInfo && (
                                <div>
                                  <h6 className="font-medium text-rrlc-brown text-sm">Educational Info:</h6>
                                  <p className="text-sm text-gray-600">{scanData.station.educationalInfo}</p>
                                </div>
                              )}

                              {scanData.station.learningObjectives && scanData.station.learningObjectives.length > 0 && (
                                <div>
                                  <h6 className="font-medium text-rrlc-brown text-sm">Learning Objectives:</h6>
                                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    {scanData.station.learningObjectives.map((objective, idx) => (
                                      <li key={idx}>{objective}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            <div className="space-y-3">
                              {scanData.station.funFacts && scanData.station.funFacts.length > 0 && (
                                <div>
                                  <h6 className="font-medium text-rrlc-brown text-sm">🌲 Fun Facts:</h6>
                                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    {scanData.station.funFacts.map((fact, idx) => (
                                      <li key={idx}>{fact}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {scanData.station.safetyTips && scanData.station.safetyTips.length > 0 && (
                                <div>
                                  <h6 className="font-medium text-rrlc-brown text-sm">⚠️ Safety Tips:</h6>
                                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    {scanData.station.safetyTips.map((tip, idx) => (
                                      <li key={idx}>{tip}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Station Properties */}
                              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 pt-2 border-t">
                                {scanData.station.ageGroup && (
                                  <div>👥 {scanData.station.ageGroup}</div>
                                )}
                                {scanData.station.difficulty && (
                                  <div>📊 {scanData.station.difficulty}</div>
                                )}
                                {scanData.station.estimatedTime && (
                                  <div>⏱️ ~{scanData.station.estimatedTime} min</div>
                                )}
                                {scanData.station.activityType && (
                                  <div>🎯 {scanData.station.activityType}</div>
                                )}
                                {scanData.station.location && (
                                  <div className="col-span-2">📍 {scanData.station.location}</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t flex justify-between">
                  <Link 
                    to={`/teacher/scan?classId=${classItem._id}`}
                    className="bg-rrlc-green-medium text-white px-4 py-2 rounded-full text-sm hover:bg-rrlc-green-dark transition duration-200"
                  >
                    Continue Scanning
                  </Link>
                  
                  <button 
                    onClick={handleCardClick}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-100 transition duration-200"
                  >
                    Collapse
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-600 mb-2">No Stations Scanned Yet</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Start scanning QR codes at stations to see the class progress and details here.
                </p>
                <div className="flex justify-center space-x-3">
                  <Link 
                    to={`/teacher/scan?classId=${classItem._id}`}
                    className="bg-rrlc-green-medium text-white px-4 py-2 rounded-full text-sm hover:bg-rrlc-green-dark transition duration-200"
                  >
                    Start Scanning
                  </Link>
                  
                  <button 
                    onClick={handleCardClick}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-100 transition duration-200"
                  >
                    Collapse
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;