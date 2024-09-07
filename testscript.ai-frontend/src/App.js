import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [context, setContext] = useState('');
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setPdfUrl(null);
    const formData = new FormData();
    formData.append('context', context);
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }
  
    try {
      const response = await axios.post('http://localhost:8000/generate-test-cases', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error generating test cases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold mb-6 text-center">TestScript.ai</h1>
            <textarea
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none mb-4"
              rows="4"
              placeholder="Enter optional context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
            <input
              type="file"
              multiple
              onChange={(e) => setImages([...e.target.files])}
              className="mb-4 w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
            />
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full px-3 py-4 text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md focus:outline-none hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50"
            >
              {isLoading ? 'Generating...' : 'Generate Test Instructions'}
            </button>
            {pdfUrl && (
              <a
                href={pdfUrl}
                download="test_instructions.pdf"
                className="mt-4 w-full px-3 py-4 text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-md focus:outline-none hover:from-green-600 hover:to-emerald-600 inline-block text-center"
              >
                Download Test Instructions PDF
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;