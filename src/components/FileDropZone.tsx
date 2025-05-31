
import React, { useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { File, Upload, Lock, Key } from 'lucide-react';
import { FileData } from './FileEncryptionTool';

interface FileDropZoneProps {
  onFileSelect: (file: FileData) => void;
  selectedFile: FileData | null;
  mode: 'encrypt' | 'decrypt';
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ onFileSelect, selectedFile, mode }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          onFileSelect({
            name: file.name,
            content: event.target.result as ArrayBuffer,
            type: file.type
          });
        }
      };
      
      reader.readAsArrayBuffer(file);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          onFileSelect({
            name: file.name,
            content: event.target.result as ArrayBuffer,
            type: file.type
          });
        }
      };
      
      reader.readAsArrayBuffer(file);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardContent className="p-6">
        {!selectedFile ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200
              ${isDragOver 
                ? 'border-cyan-400 bg-cyan-400/10' 
                : 'border-slate-600 hover:border-slate-500'
              }
              cursor-pointer
            `}
          >
            <div className="space-y-4">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                isDragOver ? 'bg-cyan-400/20' : 'bg-slate-700/50'
              }`}>
                <Upload className={`h-8 w-8 ${isDragOver ? 'text-cyan-400' : 'text-slate-400'}`} />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Drop your file here to {mode}
                </h3>
                <p className="text-slate-400 mb-4">
                  {mode === 'encrypt' 
                    ? 'Support for all file types • Maximum security encryption'
                    : 'Drop your .enc file here to decrypt it'
                  }
                </p>
                
                <label className="inline-flex items-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg cursor-pointer transition-colors">
                  <File className="h-4 w-4 mr-2" />
                  Choose File
                  <input
                    type="file"
                    onChange={handleFileInput}
                    className="hidden"
                    accept={mode === 'decrypt' ? '.enc' : '*'}
                  />
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              mode === 'encrypt' ? 'bg-cyan-600/20' : 'bg-green-600/20'
            }`}>
              {mode === 'encrypt' ? (
                <Lock className="h-6 w-6 text-cyan-400" />
              ) : (
                <Key className="h-6 w-6 text-green-400" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium truncate">{selectedFile.name}</h4>
              <p className="text-slate-400 text-sm">
                {formatFileSize(selectedFile.content.byteLength)} • Ready for {mode}ion
              </p>
            </div>
            
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              mode === 'encrypt' 
                ? 'bg-cyan-600/20 text-cyan-400' 
                : 'bg-green-600/20 text-green-400'
            }`}>
              {mode.toUpperCase()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileDropZone;
