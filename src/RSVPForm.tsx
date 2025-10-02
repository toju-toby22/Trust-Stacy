// RSVPForm.tsx
import React, { useEffect, useState } from 'react';
import { FormData, SubmittedData } from './types';
import { CONFIG } from './config';
import { getGuestNameFromURL } from './utils';

interface RSVPFormProps {
  onSubmissionSuccess: (data: SubmittedData) => void;
}

export function RSVPForm({ onSubmissionSuccess }: RSVPFormProps) {
  const [formData, setFormData] = useState<FormData>({
    guestName: '',
    rsvp: 'yes',
    giftOption: 'cashapp',
    notes: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const guestName = getGuestNameFromURL();
    if (guestName) {
      setFormData(prev => ({ ...prev, guestName }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.guestName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const dataToSubmit: SubmittedData = {
        ...formData,
        timestamp: new Date().toISOString()
      };

      await fetch(CONFIG.GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit)
      });

      onSubmissionSuccess(dataToSubmit);
      
    } catch (err) {
      setError('There was an error submitting your RSVP. Please try again.');
      console.error('Error submitting:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{CONFIG.EVENT_NAME}</h1>
        <div className="h-1 w-20 bg-green-500 mx-auto rounded-full mb-4"></div>
        <div className="text-gray-600 space-y-1">
          <p className="text-lg font-semibold">{CONFIG.EVENT_DATE}</p>
          <p>{CONFIG.EVENT_TIME}</p>
          <p>{CONFIG.EVENT_LOCATION}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="guestName">
            Your Name *
          </label>
          <input
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            id="guestName"
            name="guestName"
            type="text"
            value={formData.guestName}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-3">
            Will you attend? *
          </label>
          <div className="flex gap-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="rsvp"
                value="yes"
                checked={formData.rsvp === 'yes'}
                onChange={handleChange}
                className="w-5 h-5 text-green-600 focus:ring-2 focus:ring-green-500"
              />
              <span className="ml-2 text-gray-700 font-medium">Yes, I'll be there</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="rsvp"
                value="no"
                checked={formData.rsvp === 'no'}
                onChange={handleChange}
                className="w-5 h-5 text-red-600 focus:ring-2 focus:ring-red-500"
              />
              <span className="ml-2 text-gray-700 font-medium">Sorry, can't make it</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="giftOption">
            Gift Preference
          </label>
          <select
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            id="giftOption"
            name="giftOption"
            value={formData.giftOption}
            onChange={handleChange}
          >
            <option value="cashapp">CashApp</option>
            <option value="physical">Physical Gift</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="notes">
            Additional Notes (Optional)
          </label>
          <textarea
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Dietary restrictions, plus-ones, special requests..."
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <button
            className={`w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-200 shadow-md hover:shadow-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit RSVP'
            )}
          </button>
          
          <a
            href={CONFIG.GOOGLE_CALENDAR_EVENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-center font-bold text-sm text-blue-500 hover:text-blue-700 underline"
          >
            Add to Calendar →
          </a>
        </div>
      </div>
    </div>
  );
}