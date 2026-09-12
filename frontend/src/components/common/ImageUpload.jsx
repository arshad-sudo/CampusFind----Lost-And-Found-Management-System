import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, IconButton } from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';

const ImageUpload = ({ files: propFiles, setFiles: propSetFiles, onUpload, maxFiles = 3 }) => {
  const [localFiles, setLocalFiles] = useState([]);
  
  const files = propFiles || localFiles;
  const setFiles = propSetFiles || setLocalFiles;

  const onDrop = useCallback((acceptedFiles) => {
    if ((files?.length || 0) + acceptedFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images.`);
      return;
    }
    const updated = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    if (propSetFiles) {
      propSetFiles(prev => [...(prev || []), ...updated]);
    } else {
      setLocalFiles(prev => [...prev, ...updated]);
    }
    if (onUpload) {
      onUpload(updated[0] || null);
    }
  }, [files, maxFiles, propSetFiles, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
    maxSize: 5242880, // 5MB
  });

  const removeFile = (fileToRemove) => {
    if (propSetFiles) {
      propSetFiles((files || []).filter(file => file !== fileToRemove));
    } else {
      setLocalFiles((files || []).filter(file => file !== fileToRemove));
    }
    if (onUpload) {
      onUpload(null);
    }
  };

  const fileList = files || [];

  return (
    <Box>
      <Box 
        {...getRootProps()} 
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          transition: 'all 0.2s ease'
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="body1" gutterBottom>
          {isDragActive ? "Drop the files here..." : "Drag 'n' drop some images here, or click to select"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          (Max {maxFiles} images, max 5MB each, JPG/PNG only)
        </Typography>
      </Box>

      {fileList.length > 0 && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          {fileList.map((file, idx) => (
            <Box key={idx} sx={{ position: 'relative', width: 100, height: 100 }}>
              <img src={file.preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
              <IconButton 
                size="small" 
                sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}
                onClick={() => removeFile(file)}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;
