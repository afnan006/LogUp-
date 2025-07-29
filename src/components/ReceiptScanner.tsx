import React, { useState, useRef } from 'react';
import { Camera, Upload, X, CheckCircle, Edit3, Loader, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface ExtractedData {
  merchantName: string;
  amount: number;
  date: string;
  category: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

const ReceiptScanner: React.FC = () => {
  const { addReceiptTransaction, setReceiptScannerOpen } = useApp();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [editedData, setEditedData] = useState<ExtractedData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageSelect(file);
    }
  };

  const simulateOCR = async () => {
    setIsProcessing(true);
    
    // Simulate OCR processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock extracted data - in real app, this would come from OCR service
    const mockData: ExtractedData = {
      merchantName: 'Starbucks Coffee',
      amount: 485,
      date: new Date().toISOString().split('T')[0],
      category: 'Food & Dining',
      items: [
        { name: 'Cappuccino Grande', quantity: 1, price: 285 },
        { name: 'Blueberry Muffin', quantity: 1, price: 200 }
      ]
    };
    
    setExtractedData(mockData);
    setEditedData(mockData);
    setIsProcessing(false);
  };

  const handleConfirmTransaction = () => {
    if (!editedData || !imagePreview) return;
    
    addReceiptTransaction({
      merchantName: editedData.merchantName,
      amount: editedData.amount,
      date: editedData.date,
      category: editedData.category,
      confidence: 'high',
      imageUrl: imagePreview,
      extractedText: `Receipt from ${editedData.merchantName} - Total: ₹${editedData.amount}`,
      items: editedData.items
    });
    
    // Reset state
    setSelectedImage(null);
    setImagePreview(null);
    setExtractedData(null);
    setEditedData(null);
    setReceiptScannerOpen(false);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setExtractedData(null);
    setEditedData(null);
    setIsProcessing(false);
  };

  return (
    <div className="p-4 glass border-t border-[#26262a] space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#f1f1f1]">Receipt Scanner</h3>
        <button
          onClick={() => setReceiptScannerOpen(false)}
          className="p-2 rounded-lg hover:bg-[#26262a] transition-colors"
        >
          <X size={20} className="text-[#a1a1aa]" />
        </button>
      </div>

      {!selectedImage ? (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-[#3d3d42] rounded-xl p-8 text-center">
            <ImageIcon size={48} className="text-[#a1a1aa] mx-auto mb-4" />
            <p className="text-[#f1f1f1] font-medium mb-2">Upload Receipt Image</p>
            <p className="text-sm text-[#a1a1aa] mb-4">
              Take a photo or upload an image of your receipt
            </p>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 btn-gradient py-3 px-6 rounded-xl font-medium text-white"
              >
                <Upload size={20} />
                Upload Image
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 glass py-3 px-6 rounded-xl font-medium text-[#f1f1f1] hover:glass-card transition-all duration-300"
              >
                <Camera size={20} />
                Take Photo
              </button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          
          <div className="glass p-4 rounded-xl">
            <h4 className="font-semibold text-[#00FFD1] mb-2">Tips for Best Results</h4>
            <ul className="text-sm text-[#a1a1aa] space-y-1">
              <li>• Ensure the receipt is well-lit and clearly visible</li>
              <li>• Keep the receipt flat and avoid shadows</li>
              <li>• Make sure all text is readable in the image</li>
              <li>• Crop out unnecessary background</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Image Preview */}
          <div className="relative">
            <img
              src={imagePreview!}
              alt="Receipt preview"
              className="w-full max-h-64 object-contain rounded-xl glass p-2"
            />
            <button
              onClick={handleReset}
              className="absolute top-2 right-2 p-2 bg-[#ef4444] bg-opacity-20 text-[#ef4444] rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {!extractedData && !isProcessing && (
            <button
              onClick={simulateOCR}
              className="w-full btn-gradient py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2"
            >
              <Camera size={20} />
              Scan Receipt
            </button>
          )}

          {isProcessing && (
            <div className="glass p-6 rounded-xl text-center">
              <Loader size={32} className="text-[#00FFD1] mx-auto mb-4 animate-spin" />
              <p className="text-[#f1f1f1] font-medium">Processing Receipt...</p>
              <p className="text-sm text-[#a1a1aa]">Extracting transaction details</p>
            </div>
          )}

          {extractedData && editedData && (
            <div className="space-y-4">
              <div className="glass p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle size={20} className="text-[#10b981]" />
                  <h4 className="font-semibold text-[#f1f1f1]">Extracted Information</h4>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[#a1a1aa] mb-1">Merchant Name</label>
                    <input
                      type="text"
                      value={editedData.merchantName}
                      onChange={(e) => setEditedData({...editedData, merchantName: e.target.value})}
                      className="w-full p-3 input-field"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-[#a1a1aa] mb-1">Amount (₹)</label>
                      <input
                        type="number"
                        value={editedData.amount}
                        onChange={(e) => setEditedData({...editedData, amount: parseFloat(e.target.value)})}
                        className="w-full p-3 input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#a1a1aa] mb-1">Date</label>
                      <input
                        type="date"
                        value={editedData.date}
                        onChange={(e) => setEditedData({...editedData, date: e.target.value})}
                        className="w-full p-3 input-field"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#a1a1aa] mb-1">Category</label>
                    <select
                      value={editedData.category}
                      onChange={(e) => setEditedData({...editedData, category: e.target.value})}
                      className="w-full p-3 input-field"
                    >
                      <option value="Food & Dining">Food & Dining</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Bills & Utilities">Bills & Utilities</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Items List */}
              {editedData.items.length > 0 && (
                <div className="glass p-4 rounded-xl">
                  <h4 className="font-semibold text-[#f1f1f1] mb-3">Items</h4>
                  <div className="space-y-2">
                    {editedData.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-[#26262a] rounded-lg">
                        <div>
                          <p className="text-[#f1f1f1] font-medium">{item.name}</p>
                          <p className="text-sm text-[#a1a1aa]">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-[#f1f1f1] font-semibold">₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleConfirmTransaction}
                  className="flex-1 btn-gradient py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} />
                  Confirm Transaction
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 glass rounded-xl font-medium text-[#f1f1f1] hover:glass-card transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReceiptScanner;