import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../../services/apiClient'; // Import apiClient
import Layout from '../../components/common/Layout';
import { Html5Qrcode } from 'html5-qrcode';
import Confetti from 'react-confetti'; // Import Confetti

const QrScanner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedClass, setSelectedClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [isCameraPermissionGranted, setCameraPermissionGranted] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false); // State for confetti

  const html5QrCodeRef = useRef(null);
  const qrCodeRegionId = "qr-code-full-region"; 

  const queryParams = new URLSearchParams(location.search);
  const classIdFromUrl = queryParams.get('classId');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get('/api/classes'); // Use apiClient
        setClasses(response.data.data);
        if (classIdFromUrl) {
          const classFromUrl = response.data.data.find(c => c._id === classIdFromUrl);
          if (classFromUrl) setSelectedClass(classFromUrl);
        }
      } catch (err) {
        setError('Failed to load classes');
        console.error('Error fetching classes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [classIdFromUrl]);
  
  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning || (html5QrCodeRef.current.getState && html5QrCodeRef.current.getState() === Html5Qrcode.STATE.SCANNING) ) {
            await html5QrCodeRef.current.stop();
            console.log("QR Scanner stopped.");
        }
        html5QrCodeRef.current.clear(); 
        html5QrCodeRef.current = null; 
      } catch (err) {
        console.error("Failed to stop or clear QR scanner.", err);
      }
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const onScanSuccess = async (decodedText, decodedResult) => {
    if (decodedText && selectedClass) {
      console.log(`Scan successful: ${decodedText}`, decodedResult);
      setScanning(false); 

      try {
        const qrCodeValue = decodedText.split('/').pop();
        const response = await apiClient.post('/api/scans', { // Use apiClient
          classId: selectedClass._id,
          stationQRCode: qrCodeValue
        });
        setScanResult({
          success: true,
          message: response.data.message,
          stationData: response.data.stationData,
          existing: response.data.existing // Capture if it was an existing scan
        });
        // Trigger confetti only if it's a new successful scan (not an existing one)
        if (response.data.success && !response.data.existing) {
          setShowConfetti(true);
        }
      } catch (err) {
        setScanResult({
          success: false,
          message: err.response?.data?.error || 'Failed to record scan'
        });
        setShowConfetti(false); // Ensure confetti is off on error
      }
    }
  };

  const onScanFailure = (errorMessage) => {
    //console.warn(`QR scan failure: ${errorMessage}`);
  };

  // Effect to turn off confetti after a delay
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000); // Confetti will show for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  useEffect(() => {
    if (scanning && isCameraPermissionGranted === true) {
      // Only initialize if the div exists
      const qrRegionElement = document.getElementById(qrCodeRegionId);
      if (!qrRegionElement) {
        console.error("QR Code region element not found in DOM yet.");
        // Optionally, set an error or retry, but usually, React's render cycle should make it available soon.
        return;
      }

      if (!html5QrCodeRef.current) { // Initialize only if not already initialized
        const newScanner = new Html5Qrcode(qrCodeRegionId, { verbose: false }); // verbose: false can reduce console noise
        html5QrCodeRef.current = newScanner;
      }

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        rememberLastUsedCamera: true,
      };

      html5QrCodeRef.current.start(
        { facingMode: "environment" },
        config,
        onScanSuccess,
        onScanFailure
      ).then(() => {
        console.log("QR Scanner started via useEffect.");
      }).catch(startError => {
        console.error("Error starting QR scanner via useEffect:", startError);
        setError(`Failed to start QR scanner: ${startError.message || startError}`);
        setScanning(false); // Turn off scanning state if start fails
        setCameraPermissionGranted(false);
      });

    } else if (!scanning && html5QrCodeRef.current) {
      stopScanner();
    }

    // Cleanup for this effect: stop scanner if component unmounts while scanning
    return () => {
        if (html5QrCodeRef.current && (html5QrCodeRef.current.isScanning || (html5QrCodeRef.current.getState && html5QrCodeRef.current.getState() === Html5Qrcode.STATE.SCANNING))) {
            stopScanner();
        }
    };
  }, [scanning, isCameraPermissionGranted]); // Rerun when scanning or permission status changes


  const handleClassSelect = (e) => {
    const classId = e.target.value;
    const selected = classes.find(c => c._id === classId);
    setSelectedClass(selected);
    setScanResult(null);
    setError(null);
    setShowConfetti(false); // Reset confetti on class change
    if (scanning) { // If currently scanning, stop it
        setScanning(false);
    }
  };

  const requestCameraAndStartScanning = async () => {
    if (!selectedClass) {
      setError('Please select a class first');
      return;
    }
    setError(null);
    setScanResult(null);
    setShowConfetti(false); // Reset confetti before starting
    setCameraPermissionGranted(null); // Reset permission status

    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermissionGranted(true);
      setScanning(true); // This will trigger the useEffect to start the scanner
    } catch (permError) {
      console.error("Camera permission denied:", permError);
      setCameraPermissionGranted(false);
      setError('Camera permission denied. Please allow camera access in your browser settings.');
      setScanning(false);
    }
  };

  const handleScanStopButtonClick = () => {
    setScanning(false); // This will trigger the useEffect to stop the scanner
    setShowConfetti(false); // Ensure confetti is off
  };

  return (
    <Layout>
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-rrlc-brown mb-6">QR Code Scanner</h1>
        
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
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <label className="block text-rrlc-charcoal text-sm font-medium mb-2" htmlFor="classSelect">
                Select Class
              </label>
              <select
                id="classSelect"
                value={selectedClass?._id || ''}
                onChange={handleClassSelect}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-rrlc-green-medium"
                disabled={scanning && isCameraPermissionGranted === true} // Disable only if actively scanning
              >
                <option value="">-- Select a class --</option>
                {classes.map((classItem) => (
                  <option key={classItem._id} value={classItem._id}>
                    {classItem.name} ({classItem.grade})
                  </option>
                ))}
              </select>
            </div>
            
            {selectedClass && !scanning && !scanResult && (
              <div className="text-center mb-6">
                <button
                  onClick={requestCameraAndStartScanning}
                  className="bg-rrlc-green-medium text-white px-6 py-3 rounded-full hover:bg-rrlc-green-dark transition duration-200"
                >
                  Start Scanning
                </button>
              </div>
            )}
            
            {scanning && ( 
              <div className="mb-6">
                <div className="text-center mb-4">
                  <p className="text-rrlc-charcoal mb-2">Point your camera at a QR code.</p>
                  <button
                    onClick={handleScanStopButtonClick}
                    className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-200"
                  >
                    Cancel Scan
                  </button>
                </div>
                
                {isCameraPermissionGranted === null && (
                  <div className="text-center text-rrlc-charcoal p-4">
                    Requesting camera permission...
                  </div>
                )}

                {/* The div below is where the scanner will render its UI. 
                    It's always in the DOM when `scanning` is true, 
                    allowing `useEffect` to find it. */}
                <div id={qrCodeRegionId} className="max-w-md mx-auto border-2 border-gray-300 shadow-inner rounded-lg overflow-hidden">
                  {/* html5-qrcode will inject the video element here */}
                </div>

                {isCameraPermissionGranted === false && !error?.toLowerCase().includes('permission denied') && ( 
                  <div className="text-center text-red-600 p-4 border border-red-300 rounded-md bg-red-50 mt-4">
                    Camera access was denied. Please enable camera permissions in your browser settings for this site.
                  </div>
                )}
              </div>
            )}
            
            {scanResult && (
              <div className={`mb-6 p-4 rounded-lg ${scanResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <h3 className={`text-lg font-semibold ${scanResult.success ? 'text-green-700' : 'text-red-700'} mb-2`}>
                  {scanResult.success ? (scanResult.existing ? 'Station Already Scanned!' : 'Station Found!') : 'Scan Error'}
                </h3>
                <p className={scanResult.success ? 'text-green-600' : 'text-red-600'}>
                  {scanResult.message}
                </p>
                
                {scanResult.success && scanResult.stationData && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
                    <h4 className="font-medium text-rrlc-brown mb-2">
                      {scanResult.stationData.name}
                    </h4>
                    {scanResult.stationData.educationalInfo && (
                      <p className="text-rrlc-charcoal text-sm mt-2">
                        {scanResult.stationData.educationalInfo}
                      </p>
                    )}
                  </div>
                )}
                
                <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-2">
                  <button
                    onClick={() => {
                      setScanResult(null);
                      setShowConfetti(false); // Reset confetti
                      if (selectedClass) {
                        requestCameraAndStartScanning(); 
                      } else {
                        setScanning(false);
                      }
                    }}
                    className="bg-rrlc-green-medium text-white px-4 py-2 rounded-full hover:bg-rrlc-green-dark transition duration-200 w-full sm:w-auto"
                  >
                    Scan Another
                  </button>
                  <button
                    onClick={() => navigate(classIdFromUrl ? `/teacher/dashboard?classId=${classIdFromUrl}` : '/teacher/dashboard')}
                    className="border border-rrlc-green-medium text-rrlc-green-medium px-4 py-2 rounded-full hover:bg-rrlc-green-medium hover:text-white transition duration-200 w-full sm:w-auto"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default QrScanner;