
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { File, Lock, Key, Download, Upload, Shield, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FileDropZone from './FileDropZone';
import EncryptionStatus from './EncryptionStatus';

export interface FileData {
  name: string;
  content: ArrayBuffer;
  type: string;
}

const FileEncryptionTool = () => {
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedFile, setProcessedFile] = useState<{
    name: string;
    content: Blob;
    isEncrypted: boolean;
  } | null>(null);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  
  const { toast } = useToast();

  const handleFileSelect = useCallback((file: FileData) => {
    setSelectedFile(file);
    setProcessedFile(null);
    
    // Auto-detect if file is encrypted based on file extension
    if (file.name.endsWith('.enc')) {
      setMode('decrypt');
    } else {
      setMode('encrypt');
    }
    
    toast({
      title: "File loaded",
      description: `${file.name} is ready for ${file.name.endsWith('.enc') ? 'decryption' : 'encryption'}.`,
    });
  }, [toast]);

  const processFile = async () => {
    if (!selectedFile || !password) {
      toast({
        title: "Missing information",
        description: "Please select a file and enter a password.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Weak password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate processing with progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 20;
        });
      }, 100);

      const result = mode === 'encrypt' 
        ? await encryptFile(selectedFile, password)
        : await decryptFile(selectedFile, password);

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setProcessedFile(result);
        setIsProcessing(false);
        setProgress(0);
        
        toast({
          title: `${mode === 'encrypt' ? 'Encryption' : 'Decryption'} complete`,
          description: `File has been successfully ${mode === 'encrypt' ? 'encrypted' : 'decrypted'}.`,
        });
      }, 500);

    } catch (error) {
      setIsProcessing(false);
      setProgress(0);
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An error occurred during processing.",
        variant: "destructive",
      });
    }
  };

  const downloadFile = () => {
    if (!processedFile) return;

    const url = URL.createObjectURL(processedFile.content);
    const a = document.createElement('a');
    a.href = url;
    a.download = processedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download complete",
      description: `${processedFile.name} has been downloaded.`,
    });
  };

  const reset = () => {
    setSelectedFile(null);
    setProcessedFile(null);
    setPassword('');
    setProgress(0);
    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Mode Selection */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-cyan-400" />
            Choose Operation Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 justify-center">
            <Button
              variant={mode === 'encrypt' ? 'default' : 'outline'}
              onClick={() => setMode('encrypt')}
              className={mode === 'encrypt' 
                ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
                : 'border-slate-600 text-slate-300 hover:bg-slate-700'
              }
            >
              <Lock className="h-4 w-4 mr-2" />
              Encrypt Files
            </Button>
            <Button
              variant={mode === 'decrypt' ? 'default' : 'outline'}
              onClick={() => setMode('decrypt')}
              className={mode === 'decrypt' 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'border-slate-600 text-slate-300 hover:bg-slate-700'
              }
            >
              <Key className="h-4 w-4 mr-2" />
              Decrypt Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <FileDropZone
        onFileSelect={handleFileSelect}
        selectedFile={selectedFile}
        mode={mode}
      />

      {/* Password Input */}
      {selectedFile && (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Key className="h-5 w-5 text-yellow-400" />
              Security Key
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                Enter your encryption password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a strong password (min. 8 characters)"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Processing...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="bg-slate-700" />
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={processFile}
                disabled={!selectedFile || !password || isProcessing}
                className={mode === 'encrypt' 
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white flex-1' 
                  : 'bg-green-600 hover:bg-green-700 text-white flex-1'
                }
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    {mode === 'encrypt' ? <Lock className="h-4 w-4 mr-2" /> : <Key className="h-4 w-4 mr-2" />}
                    {mode === 'encrypt' ? 'Encrypt File' : 'Decrypt File'}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={reset}
                disabled={isProcessing}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {processedFile && (
        <EncryptionStatus
          processedFile={processedFile}
          onDownload={downloadFile}
          mode={mode}
        />
      )}
    </div>
  );
};

// Encryption function (simplified for demo - in production use proper crypto libraries)
const encryptFile = async (file: FileData, password: string): Promise<{
  name: string;
  content: Blob;
  isEncrypted: boolean;
}> => {
  // Simulate encryption process
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real implementation, you would use WebCrypto API or similar
  const encryptedContent = new Blob([file.content], { type: 'application/octet-stream' });
  
  return {
    name: file.name + '.enc',
    content: encryptedContent,
    isEncrypted: true
  };
};

// Decryption function (simplified for demo)
const decryptFile = async (file: FileData, password: string): Promise<{
  name: string;
  content: Blob;
  isEncrypted: boolean;
}> => {
  // Simulate decryption process
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Remove .enc extension
  const originalName = file.name.endsWith('.enc') ? file.name.slice(0, -4) : file.name;
  
  const decryptedContent = new Blob([file.content], { type: 'application/octet-stream' });
  
  return {
    name: originalName,
    content: decryptedContent,
    isEncrypted: false
  };
};

export default FileEncryptionTool;
