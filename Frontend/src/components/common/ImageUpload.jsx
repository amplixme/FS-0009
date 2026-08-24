import { useState, useRef, useEffect } from 'react';
import { uploadImage } from '../../services/upload.service';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const ImageUpload = ({ value, onChange }) => {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Solo se aceptan imágenes JPG, PNG o WebP';
    }
    if (file.size > MAX_SIZE) {
      return 'La imagen no puede superar los 5MB';
    }
    return null;
  };

  const handleFile = async (file) => {
    setError(null);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    const localPreview = URL.createObjectURL(file);
    objectUrlRef.current = localPreview;
    setPreview(localPreview);

    try {
      setUploading(true);
      setProgress(0);
      const url = await uploadImage(file, setProgress);
      onChange(url);
    } catch (err) {
      setError(err.message);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPreview(null);
    setError(null);
    onChange(null);
  };

  const displayImage = preview || value;

  return (
    <div>
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative w-full aspect-[21/9] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-outline-variant bg-surface-container-lowest hover:border-primary/40'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleInputChange}
          className="hidden"
        />

        {displayImage ? (
          <>
            <img src={displayImage} alt="Portada" className="w-full h-full object-cover" />
            {!uploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                <div className="w-2/3 h-2 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-white text-xs font-semibold">{progress}%</span>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl">image</span>
            <p className="text-sm font-medium">Arrastra una imagen o haz clic para subir</p>
            <p className="text-xs text-outline">JPG, PNG o WebP · máx 5MB</p>
          </div>
        )}
      </div>

      {error && <p className="text-error text-xs font-semibold mt-2">{error}</p>}
    </div>
  );
};

export default ImageUpload;
