import { useState, useEffect, useCallback } from 'react'; // Added useCallback
import apiClient from '../../services/apiClient'; // Import apiClient
import Layout from '../../components/common/Layout';

// Define ArrayInputComponent outside StationManagement for stable component identity
const ArrayInputComponent = ({
  arrayName,
  label,
  placeholder,
  values,
  onInputChange,
  onAddItem,
  onRemoveItem,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-rrlc-charcoal text-sm font-medium mb-2">
        {label}
      </label>
      {values.map((value, index) => (
        <div key={`${arrayName}-${index}`} className="flex items-center mb-2"> {/* Stable key for the div */}
          <input
            type="text"
            value={value}
            onChange={(e) => onInputChange(arrayName, index, e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
            placeholder={placeholder}
            autoComplete="off"
          />
          {values.length > 1 && (
            <button
              type="button"
              onClick={() => onRemoveItem(arrayName, index)}
              className="ml-2 text-red-600 hover:text-red-800 p-1 min-w-[24px] h-[24px] flex items-center justify-center"
              tabIndex={-1} // Keep focus away from this button during typing
            >
              ✕
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onAddItem(arrayName)}
        className="text-rrlc-green-medium hover:text-rrlc-green-dark text-sm font-medium"
        tabIndex={-1} // Keep focus away from this button during typing
      >
        + Add {label.slice(0, -1)}
      </button>
    </div>
  );
};

const StationManagement = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [qrCodeImage, setQrCodeImage] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    educationalInfo: '',
    imageUrl: '',
    funFacts: [''],
    safetyTips: [''],
    ageGroup: 'All Ages',
    difficulty: 'Easy',
    estimatedTime: 15,
    learningObjectives: [''],
    equipment: [''],
    activityType: 'Information Display',
    staffRequired: 1,
    maxParticipants: 30,
    weatherDependent: false,
    location: '',
    isActive: true
  });

  // Fetch stations
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await apiClient.get('/api/stations'); // Use apiClient
        setStations(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load stations');
        setLoading(false);
        console.error('Error, Failed to load stations:', err);
      }
    };
    fetchStations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevFormData => ({ // Use functional update
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Memoize array handlers using useCallback and functional updates for setFormData
  const handleArrayInputChange = useCallback((arrayName, index, value) => {
    setFormData(prevFormData => {
      const newArray = [...prevFormData[arrayName]];
      newArray[index] = value;
      return {
        ...prevFormData,
        [arrayName]: newArray,
      };
    });
  }, []); // Empty dependency array as setFormData is stable

  const addArrayItem = useCallback((arrayName) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [arrayName]: [...prevFormData[arrayName], ''],
    }));
  }, []);

  const removeArrayItem = useCallback((arrayName, index) => {
    setFormData(prevFormData => {
      const newArray = prevFormData[arrayName].filter((_, i) => i !== index);
      return {
        ...prevFormData,
        [arrayName]: newArray.length > 0 ? newArray : [''],
      };
    });
  }, []);

  const handleAddStation = async (e) => {
    e.preventDefault();
    try {
      const cleanedData = {
        ...formData,
        funFacts: formData.funFacts.filter(fact => fact.trim() !== ''),
        safetyTips: formData.safetyTips.filter(tip => tip.trim() !== ''),
        learningObjectives: formData.learningObjectives.filter(obj => obj.trim() !== ''),
        equipment: formData.equipment.filter(eq => eq.trim() !== '')
      };
      const response = await apiClient.post('/api/stations', cleanedData); // Use apiClient
      setStations(prevStations => [...prevStations, response.data.data]); // Use functional update
      resetForm();
    } catch (err) {
      setError('Failed to create station');
      console.error('Error, Failed to create station:', err);
    }
  };

  const handleUpdateStation = async (e) => {
    e.preventDefault();
    try {
      const cleanedData = {
        ...formData,
        funFacts: formData.funFacts.filter(fact => fact.trim() !== ''),
        safetyTips: formData.safetyTips.filter(tip => tip.trim() !== ''),
        learningObjectives: formData.learningObjectives.filter(obj => obj.trim() !== ''),
        equipment: formData.equipment.filter(eq => eq.trim() !== '')
      };
      const response = await apiClient.put(`/api/stations/${selectedStation._id}`, cleanedData); // Use apiClient
      setStations(prevStations => prevStations.map(station => 
        station._id === selectedStation._id ? response.data.data : station
      )); // Use functional update
      resetForm();
    } catch (err) {
      setError('Failed to update station');
      console.error('Error, Failed to update station:', err);
    }
  };

  const handleEditClick = (station) => {
    setSelectedStation(station);
    setFormData({ // This can directly set, or use functional update if based on previous complex state
      name: station.name || '',
      description: station.description || '',
      educationalInfo: station.educationalInfo || '',
      imageUrl: station.imageUrl || '',
      funFacts: station.funFacts && station.funFacts.length > 0 ? station.funFacts : [''],
      safetyTips: station.safetyTips && station.safetyTips.length > 0 ? station.safetyTips : [''],
      ageGroup: station.ageGroup || 'All Ages',
      difficulty: station.difficulty || 'Easy',
      estimatedTime: station.estimatedTime || 15,
      learningObjectives: station.learningObjectives && station.learningObjectives.length > 0 ? station.learningObjectives : [''],
      equipment: station.equipment && station.equipment.length > 0 ? station.equipment : [''],
      activityType: station.activityType || 'Information Display',
      staffRequired: station.staffRequired || 1,
      maxParticipants: station.maxParticipants || 30,
      weatherDependent: station.weatherDependent || false,
      location: station.location || '',
      isActive: station.isActive !== undefined ? station.isActive : true // Ensure isActive has a default
    });
    setShowAddForm(true);
    setQrCodeImage(null);
  };

  const handleGenerateQR = async (stationId) => {
    try {
      const response = await apiClient.get(`/api/stations/${stationId}/qrcode`); // Use apiClient
      setQrCodeImage(response.data.data.qrCodeDataURL);
      const station = stations.find(s => s._id === stationId);
      setSelectedStation(station); // This is fine
    } catch (err) {
      setError('Failed to generate QR code');
      console.error('Error generating QR code:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      educationalInfo: '',
      imageUrl: '',
      funFacts: [''],
      safetyTips: [''],
      ageGroup: 'All Ages',
      difficulty: 'Easy',
      estimatedTime: 15,
      learningObjectives: [''],
      equipment: [''],
      activityType: 'Information Display',
      staffRequired: 1,
      maxParticipants: 30,
      weatherDependent: false,
      location: '',
      isActive: true
    });
    setSelectedStation(null);
    setShowAddForm(false);
    setQrCodeImage(null);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-rrlc-brown">Station Management</h1>
          <button
            onClick={() => {
              resetForm(); // selectedStation will be null
              setShowAddForm(prev => !prev); // Toggle based on previous state
            }}
            className="bg-rrlc-green-medium text-white px-4 py-2 rounded-full hover:bg-rrlc-green-dark transition duration-200"
          >
            {showAddForm ? 'Cancel' : 'Add New Station'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {showAddForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-h-[70vh] overflow-y-auto"> {/* Adjusted max-h */}
            <h2 className="text-xl font-semibold text-rrlc-brown mb-4">
              {selectedStation ? 'Edit Station' : 'Create New Station'}
            </h2>
            <form onSubmit={selectedStation ? handleUpdateStation : handleAddStation}>
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="name">
                    Station Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                    placeholder="e.g., Logging History Station"
                    required
                  />
                </div>

                <div>
                  <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="location">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                    placeholder="e.g., Main Pavilion"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                  placeholder="Brief description of the station"
                  rows="2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="imageUrl">
                  Image URL
                </label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="mb-4">
                <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="educationalInfo">
                  Educational Information
                </label>
                <textarea
                  id="educationalInfo"
                  name="educationalInfo"
                  value={formData.educationalInfo}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                  placeholder="Detailed educational content for children to learn about logging"
                  rows="4"
                />
              </div>

              {/* Station Properties */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="ageGroup">
                    Age Group
                  </label>
                  <select
                    id="ageGroup"
                    name="ageGroup"
                    value={formData.ageGroup}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                  >
                    <option value="Elementary (K-5)">Elementary (K-5)</option>
                    <option value="Middle School (6-8)">Middle School (6-8)</option>
                    <option value="High School (9-12)">High School (9-12)</option>
                    <option value="All Ages">All Ages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="difficulty">
                    Difficulty
                  </label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="activityType">
                    Activity Type
                  </label>
                  <select
                    id="activityType"
                    name="activityType"
                    value={formData.activityType}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                  >
                    <option value="Interactive Demo">Interactive Demo</option>
                    <option value="Hands-on Activity">Hands-on Activity</option>
                    <option value="Information Display">Information Display</option>
                    <option value="Q&A Session">Q&A Session</option>
                    <option value="Competition/Game">Competition/Game</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="estimatedTime">
                    Estimated Time (minutes)
                  </label>
                  <input
                    id="estimatedTime"
                    name="estimatedTime"
                    type="number"
                    min="1"
                    max="60" // Consider if this max is appropriate
                    value={formData.estimatedTime}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                  />
                </div>

                <div>
                  <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="staffRequired">
                    Staff Required
                  </label>
                  <input
                    id="staffRequired"
                    name="staffRequired"
                    type="number"
                    min="0"
                    value={formData.staffRequired}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                  />
                </div>

                <div>
                  <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="maxParticipants">
                    Max Participants
                  </label>
                  <input
                    id="maxParticipants"
                    name="maxParticipants"
                    type="number"
                    min="1"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                  />
                </div>
              </div>

              {/* Use the external ArrayInputComponent */}
              <ArrayInputComponent
                arrayName="funFacts"
                label="Fun Facts"
                placeholder="Enter a fun fact about logging..."
                values={formData.funFacts}
                onInputChange={handleArrayInputChange}
                onAddItem={addArrayItem}
                onRemoveItem={removeArrayItem}
              />

              <ArrayInputComponent
                arrayName="safetyTips"
                label="Safety Tips"
                placeholder="Enter a safety tip..."
                values={formData.safetyTips}
                onInputChange={handleArrayInputChange}
                onAddItem={addArrayItem}
                onRemoveItem={removeArrayItem}
              />

              <ArrayInputComponent
                arrayName="learningObjectives"
                label="Learning Objectives"
                placeholder="What will children learn at this station?"
                values={formData.learningObjectives}
                onInputChange={handleArrayInputChange}
                onAddItem={addArrayItem}
                onRemoveItem={removeArrayItem}
              />

              <ArrayInputComponent
                arrayName="equipment"
                label="Equipment Needed"
                placeholder="Enter equipment or materials needed..."
                values={formData.equipment}
                onInputChange={handleArrayInputChange}
                onAddItem={addArrayItem}
                onRemoveItem={removeArrayItem}
              />

              {/* Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="weatherDependent"
                      checked={formData.weatherDependent}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-rrlc-green-medium focus:ring-rrlc-green-medium border-gray-300 rounded"
                    />
                    <span className="ml-2 text-rrlc-charcoal">Weather Dependent</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-rrlc-green-medium focus:ring-rrlc-green-medium border-gray-300 rounded"
                    />
                    <span className="ml-2 text-rrlc-charcoal">Active (available for scanning)</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end sticky bottom-0 bg-white py-4 border-t border-gray-200"> {/* Sticky buttons */}
                <button
                  type="button"
                  onClick={resetForm}
                  className="mr-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-100 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-rrlc-green-medium text-white px-6 py-2 rounded-full hover:bg-rrlc-green-dark transition duration-200"
                >
                  {selectedStation ? 'Update Station' : 'Create Station'}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rrlc-green-medium"></div>
          </div>
        ) : stations.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold text-rrlc-brown mb-4">No Stations Yet</h2>
            <p className="text-rrlc-charcoal mb-6">
              You haven't created any stations yet. Click the "Add New Station" button to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {qrCodeImage && selectedStation && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold text-rrlc-brown mb-4">QR Code for {selectedStation.name}</h2>
                <div className="flex flex-col md:flex-row items-center">
                  <div className="mb-4 md:mb-0 md:mr-6">
                    <img src={qrCodeImage} alt="QR Code" className="max-w-xs" />
                  </div>
                  <div>
                    <p className="text-rrlc-charcoal mb-2">
                      <span className="font-medium">Station ID:</span> {selectedStation._id}
                    </p>
                    <p className="text-rrlc-charcoal mb-2">
                      <span className="font-medium">QR Code:</span> {selectedStation.qrCode}
                    </p>
                    <p className="text-rrlc-charcoal mb-4">
                      <span className="font-medium">Status:</span> {selectedStation.isActive ? 'Active' : 'Inactive'}
                    </p>
                    <div className="mt-4">
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = qrCodeImage;
                          link.download = `${selectedStation.name.replace(/\s+/g, '_')}_QR.png`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="bg-rrlc-green-medium text-white px-4 py-2 rounded-full hover:bg-rrlc-green-dark transition duration-200"
                      >
                        Download QR Code
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Station Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity Info
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stations.map((station) => (
                    <tr key={station._id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {station.imageUrl && (
                            <img 
                              src={station.imageUrl} 
                              alt={station.name}
                              className="h-12 w-12 rounded-lg object-cover mr-4"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{station.name}</div>
                            {station.description && (
                              <div className="text-sm text-gray-500 max-w-xs truncate" title={station.description}>{station.description}</div>
                            )}
                            {station.location && (
                              <div className="text-xs text-gray-400">📍 {station.location}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div className="mb-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {station.activityType || 'Information Display'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {station.ageGroup || 'All Ages'} • {station.difficulty || 'Easy'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {station.estimatedTime || 15} min • Max {station.maxParticipants || 30} students
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          station.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {station.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {station.weatherDependent && (
                          <div className="text-xs text-yellow-600 mt-1">☔ Weather Dependent</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(station)}
                          className="text-rrlc-green-medium hover:text-rrlc-green-dark mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleGenerateQR(station._id)}
                          className="text-rrlc-brown hover:text-rrlc-green-dark"
                        >
                          Generate QR
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StationManagement;