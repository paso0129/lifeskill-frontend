'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, X, FileImage, FileVideo } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  currentFile?: File | null;
}

export default function FileUploader({
  onFileSelect,
  accept = 'image/*,video/*',
  currentFile,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    onFileSelect(file);
    setFileName(file.name);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearFile = () => {
    setPreview(null);
    setFileName(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const displayName = fileName || currentFile?.name;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
        transition-all duration-200
        ${isDragging ? 'border-primary bg-primary-light' : 'border-slate-300 hover:border-primary hover:bg-slate-50'}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="max-h-48 mx-auto rounded-lg object-cover"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearFile();
            }}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : displayName ? (
        <div className="flex items-center justify-center gap-3">
          {displayName.match(/\.(mp4|mov|avi|webm)$/i) ? (
            <FileVideo className="w-10 h-10 text-primary" />
          ) : (
            <FileImage className="w-10 h-10 text-primary" />
          )}
          <div className="text-left">
            <p className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
              {displayName}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="text-xs text-red-500 hover:underline mt-1"
            >
              삭제
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <Upload className="w-10 h-10 text-slate-400" />
          <div>
            <p className="text-sm font-medium text-slate-600">
              파일을 드래그하거나 클릭하여 업로드
            </p>
            <p className="text-xs text-slate-400 mt-1">
              이미지 또는 동영상 파일
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
