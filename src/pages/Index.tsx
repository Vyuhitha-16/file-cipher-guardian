
import React from 'react';
import FileEncryptionTool from '../components/FileEncryptionTool';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            SecureVault
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Advanced file encryption and decryption tool. Protect your sensitive data with military-grade AES encryption.
          </p>
        </div>
        <FileEncryptionTool />
      </div>
    </div>
  );
};

export default Index;
