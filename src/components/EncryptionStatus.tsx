
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Shield, CheckCircle, Lock, Key } from 'lucide-react';

interface EncryptionStatusProps {
  processedFile: {
    name: string;
    content: Blob;
    isEncrypted: boolean;
  };
  onDownload: () => void;
  mode: 'encrypt' | 'decrypt';
}

const EncryptionStatus: React.FC<EncryptionStatusProps> = ({ 
  processedFile, 
  onDownload, 
  mode 
}) => {
  const formatFileSize = (blob: Blob): string => {
    const bytes = blob.size;
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-white flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-green-400" />
          {mode === 'encrypt' ? 'Encryption Complete' : 'Decryption Complete'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-600">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
              {mode === 'encrypt' ? (
                <Lock className="h-6 w-6 text-green-400" />
              ) : (
                <Key className="h-6 w-6 text-green-400" />
              )}
            </div>
            
            <div>
              <h4 className="text-white font-medium">{processedFile.name}</h4>
              <p className="text-slate-400 text-sm">
                {formatFileSize(processedFile.content)} • {mode === 'encrypt' ? 'Encrypted' : 'Decrypted'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-xs font-medium">
              {mode === 'encrypt' ? 'SECURED' : 'RESTORED'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-4 w-4 text-cyan-400" />
              <span className="text-sm font-medium text-slate-300">Security</span>
            </div>
            <p className="text-white font-semibold">AES-256</p>
            <p className="text-xs text-slate-400">Military Grade</p>
          </div>

          <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-slate-300">Status</span>
            </div>
            <p className="text-white font-semibold">Success</p>
            <p className="text-xs text-slate-400">100% Complete</p>
          </div>

          <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <Download className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-slate-300">File Size</span>
            </div>
            <p className="text-white font-semibold">{formatFileSize(processedFile.content)}</p>
            <p className="text-xs text-slate-400">Ready to download</p>
          </div>
        </div>

        <Button
          onClick={onDownload}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
          size="lg"
        >
          <Download className="h-5 w-5 mr-2" />
          Download {mode === 'encrypt' ? 'Encrypted' : 'Decrypted'} File
        </Button>

        <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
          <p className="text-yellow-200 text-sm">
            <strong>Security Notice:</strong> {mode === 'encrypt' 
              ? 'Keep your password safe! Without it, the encrypted file cannot be recovered.'
              : 'Your file has been successfully decrypted. Store it securely.'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EncryptionStatus;
