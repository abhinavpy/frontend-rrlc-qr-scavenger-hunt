import { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient'; // Import apiClient
import Layout from '../../components/common/Layout';

const DrawingSystem = () => {
  const [eligibleClasses, setEligibleClasses] = useState([]);
  const [winners, setWinners] = useState([]);
  const [numberOfWinners, setNumberOfWinners] = useState(1);
  const [loading, setLoading] = useState(true);
  const [drawing, setDrawing] = useState(false);
  const [error, setError] = useState(null);
  //const [drawingHistory, setDrawingHistory] = useState([]); // Optional: to show past drawings

  useEffect(() => {
    const fetchEligibleClasses = async () => {
      try {
        setLoading(true);
        // API endpoint to get classes that completed the hunt and are eligible
        const response = await apiClient.get('/api/drawings/eligible-classes'); 
        setEligibleClasses(response.data.data);
        
        // Optional: Fetch past drawing history
        // const historyResponse = await apiClient.get('/api/drawings/history');
        // setDrawingHistory(historyResponse.data.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching eligible classes:', err);
        setError('Failed to load eligible classes. Ensure API endpoint /api/drawings/eligible-classes is available.');
        setLoading(false);
      }
    };

    fetchEligibleClasses();
  }, []);

  const handleConductDrawing = async () => {
    if (numberOfWinners <= 0 || numberOfWinners > eligibleClasses.length) {
      setError('Number of winners must be between 1 and the number of eligible classes.');
      return;
    }
    setError(null);
    setDrawing(true);
    setWinners([]);

    try {
      // API endpoint to conduct the drawing
      const response = await apiClient.post('/api/drawings/conduct', { numberOfWinners });
      setWinners(response.data.data.winners);
      // Optionally, refresh eligible classes or drawing history
      // const eligibleResponse = await apiClient.get('/api/drawings/eligible-classes');
      // setEligibleClasses(eligibleResponse.data.data);
    } catch (err) {
      console.error('Error conducting drawing:', err);
      setError(err.response?.data?.error || 'Failed to conduct drawing.');
    } finally {
      setDrawing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-rrlc-brown mb-6">Prize Drawing System</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rrlc-green-medium"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Eligible Classes Section */}
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-rrlc-brown mb-4">
                Eligible Classes ({eligibleClasses.length})
              </h2>
              {eligibleClasses.length > 0 ? (
                <ul className="max-h-96 overflow-y-auto divide-y divide-gray-200">
                  {eligibleClasses.map((classItem) => (
                    <li key={classItem._id} className="py-3">
                      <p className="text-rrlc-charcoal font-medium">{classItem.name}</p>
                      <p className="text-sm text-gray-500">{classItem.teacher?.name || 'N/A'} - {classItem.school}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-rrlc-charcoal">No classes are currently eligible for the drawing.</p>
              )}
            </div>

            {/* Conduct Drawing Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-rrlc-brown mb-4">Conduct Drawing</h2>
              <div className="mb-4">
                <label htmlFor="numberOfWinners" className="block text-sm font-medium text-rrlc-charcoal mb-1">
                  Number of Winners:
                </label>
                <input
                  type="number"
                  id="numberOfWinners"
                  value={numberOfWinners}
                  onChange={(e) => setNumberOfWinners(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={eligibleClasses.length || 1}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                  disabled={drawing || eligibleClasses.length === 0}
                />
              </div>
              <button
                onClick={handleConductDrawing}
                disabled={drawing || eligibleClasses.length === 0 || numberOfWinners <= 0}
                className={`w-full bg-rrlc-gold text-rrlc-brown py-3 rounded-full font-medium 
                  ${(drawing || eligibleClasses.length === 0 || numberOfWinners <= 0) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-yellow-500 transition duration-200'}`}
              >
                {drawing ? 'Drawing...' : 'Draw Winner(s)'}
              </button>

              {winners.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-rrlc-green-dark mb-3">🎉 Congratulations to the Winner(s)! 🎉</h3>
                  <ul className="divide-y divide-gray-200">
                    {winners.map((winner, index) => (
                      <li key={winner._id || index} className="py-3 bg-green-50 p-3 rounded my-1">
                        <p className="text-rrlc-green-dark font-bold text-lg">{winner.name}</p>
                        <p className="text-sm text-gray-600">{winner.teacher?.name || 'N/A'} - {winner.school}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Optional: Drawing History Section */}
        {/* 
        {drawingHistory.length > 0 && (
          <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-rrlc-brown mb-4">Past Drawings</h2>
            // Render drawing history here
          </div>
        )}
        */}
      </div>
    </Layout>
  );
};

export default DrawingSystem;