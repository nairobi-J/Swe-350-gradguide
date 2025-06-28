// frontend/app/component/events/MyRegistrationsPage.tsx
'use client';
import React from 'react';
import { Registration } from '../types'; // Import Registration interface

interface MyRegistrationsPageProps {
  registrations: Registration[];
  currentUserId: string;
}

const MyRegistrationsPage: React.FC<MyRegistrationsPageProps> = ({ registrations, currentUserId }) => {
  const handleDownloadConfirmation = (registration: Registration) => {
    const formData = JSON.parse(registration.formData);
    const confirmationText = `
Registration Confirmed for: ${registration.eventName}
Registration ID: ${registration.id}
Status: ${registration.status}
Registered At: ${new Date(registration.registeredAt).toLocaleString()}

Submitted Details:
${Object.entries(formData).map(([key, value]) => `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`).join('\n')}

${registration.confirmationData?.joinLink ? 'Join Link: ' + registration.confirmationData.joinLink : ''}

Thank you!
`;

    const element = document.createElement('a');
    const file = new Blob([confirmationText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `registration_${registration.eventName.replace(/\s/g, '_')}_${registration.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const userRegistrations = registrations.filter(reg => reg.userId === currentUserId);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">My Event Registrations</h1>

      {userRegistrations.length === 0 ? (
        <p className="text-center text-lg text-gray-500">You haven't registered for any events yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {userRegistrations.map((reg) => (
            <div key={reg.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-2xl font-bold mb-2">{reg.eventName}</h3>
              <p className="text-sm text-gray-600 mb-2">Registration ID: <span className="font-mono">{reg.id}</span></p>
              <p className="text-sm text-gray-600 mb-2">Status: <span className={`font-semibold ${reg.status === 'confirmed' || reg.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{reg.status.toUpperCase()}</span></p>
              {reg.registeredAt && (
                <p className="text-sm text-gray-600 mb-4">
                  Registered On: {new Date(reg.registeredAt).toLocaleString()}
                </p>
              )}
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Your Details:</h4>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                {reg.formData && Object.entries(JSON.parse(reg.formData)).map(([key, value]) => (
                  <li key={key}><strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {value}</li>
                ))}
              </ul>
              {reg.status === 'confirmed' || reg.status === 'paid' ? (
                <button
                  onClick={() => handleDownloadConfirmation(reg)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                >
                  Download Confirmation
                </button>
              ) : (
                <p className="text-yellow-600 font-medium">Payment pending or awaiting confirmation.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRegistrationsPage;