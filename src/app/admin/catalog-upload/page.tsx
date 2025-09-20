'use client';

import { useAdminAuth } from '@/hooks/useAdminAuth';
import { bulkCreateProducts } from '@/lib/supabase/admin-api';
import { useState } from 'react';

interface CSVProduct {
  title: string;
  description: string;
  price: number;
  category: string;
  handle: string;
  images: string[];
}

export default function CatalogUploadPage() {
  const { requireAdmin } = useAdminAuth();
  const [file, setFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'csv' | 'json' | 'manual'>('manual');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type === 'text/csv') {
        setUploadMethod('csv');
      } else if (selectedFile.type === 'application/json') {
        setUploadMethod('json');
      }
    }
  };

  const parseCSV = (csvText: string): CSVProduct[] => {
    const lines = csvText.split('\n');
    const products: CSVProduct[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;
      const values = line.split(',').map(v => v.trim());
      if (values.length >= 6) {
        const product: CSVProduct = {
          title: values[0] || '',
          description: values[1] || '',
          price: parseFloat(values[2] || '0') || 0,
          category: values[3] || '',
          handle: values[4] || '',
          images: values[5] ? values[5].split('|').filter(img => img.trim()) : []
        };
        
        if (product.title && product.price > 0 && product.handle) {
          products.push(product);
        }
      }
    }
    return products;
  };

  const handleUpload = async () => {
    try {
      requireAdmin();
      setIsLoading(true);
      setMessage(null);

      let products: CSVProduct[] = [];

      if (uploadMethod === 'csv' && file) {
        const csvText = await file.text();
        products = parseCSV(csvText);
      } else if (uploadMethod === 'json' && file) {
        const jsonText = await file.text();
        products = JSON.parse(jsonText);
      } else if (uploadMethod === 'json' && jsonData) {
        products = JSON.parse(jsonData);
      }

      if (products.length === 0) {
        throw new Error('No valid products found to upload');
      }

      // Validate products
      for (const product of products) {
        if (!product.title || !product.handle || product.price <= 0) {
          throw new Error(`Invalid product data: ${product.title || 'Unknown'}`);
        }
      }

      const result = await bulkCreateProducts(products);
      
      setMessage({
        type: 'success',
        text: `Successfully uploaded ${result.length} products!`
      });
      
      // Reset form
      setFile(null);
      setJsonData('');
      if (document.getElementById('file-upload')) {
        (document.getElementById('file-upload') as HTMLInputElement).value = '';
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to upload catalog'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadSampleCSV = () => {
    const sampleCSV = `title,description,price,category,handle,images
"Premium White T-Shirt","High quality cotton t-shirt in white",999,"Topwear","premium-white-tshirt","https://example.com/image1.jpg|https://example.com/image2.jpg"
"Blue Denim Jeans","Classic blue denim jeans",1999,"Bottomwear","blue-denim-jeans","https://example.com/image3.jpg"
"Cotton Shirt","Comfortable cotton shirt",1499,"Topwear","cotton-shirt","https://example.com/image4.jpg"`;

    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'sample-catalog.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const downloadSampleJSON = () => {
    const sampleJSON = [
      {
        title: "Premium White T-Shirt",
        description: "High quality cotton t-shirt in white",
        price: 999,
        category: "Topwear",
        handle: "premium-white-tshirt",
        images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
      },
      {
        title: "Blue Denim Jeans",
        description: "Classic blue denim jeans",
        price: 1999,
        category: "Bottomwear",
        handle: "blue-denim-jeans",
        images: ["https://example.com/image3.jpg"]
      }
    ];

    const blob = new Blob([JSON.stringify(sampleJSON, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'sample-catalog.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-white mb-2">Catalog Upload</h1>
        <p className="text-gray-400">
          Upload products in bulk using CSV, JSON, or manual entry
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Upload Method Selection */}
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Upload Method</h2>
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setUploadMethod('manual')}
            className={`px-4 py-2 rounded-lg ${
              uploadMethod === 'manual' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Manual Entry
          </button>
          <button
            onClick={() => setUploadMethod('csv')}
            className={`px-4 py-2 rounded-lg ${
              uploadMethod === 'csv' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            CSV Upload
          </button>
          <button
            onClick={() => setUploadMethod('json')}
            className={`px-4 py-2 rounded-lg ${
              uploadMethod === 'json' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            JSON Upload
          </button>
        </div>

        {/* CSV Upload */}
        {uploadMethod === 'csv' && (
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Upload CSV File
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={downloadSampleCSV}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Download Sample CSV
              </button>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-2">CSV Format:</h3>
              <p className="text-gray-300 text-sm mb-2">
                CSV should have columns: title, description, price, category, handle, images
              </p>
              <p className="text-gray-400 text-xs">
                Images column should contain URLs separated by | (pipe) character
              </p>
            </div>
          </div>
        )}

        {/* JSON Upload */}
        {uploadMethod === 'json' && (
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Upload JSON File or Paste JSON Data
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 mb-4"
              />
              
              <textarea
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                placeholder="Or paste JSON data here..."
                rows={10}
                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              onClick={downloadSampleJSON}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Download Sample JSON
            </button>
          </div>
        )}

        {/* Manual Entry */}
        {uploadMethod === 'manual' && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-300 mb-4">
              For manual entry, use the <a href="/admin/products/new" className="text-blue-400 hover:text-blue-300">Add New Product</a> page.
            </p>
            <a
              href="/admin/products/new"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add New Product
            </a>
          </div>
        )}

        {/* Upload Button */}
        {(uploadMethod === 'csv' && file) || (uploadMethod === 'json' && (file || jsonData)) ? (
          <button
            onClick={handleUpload}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Uploading...' : 'Upload Catalog'}
          </button>
        ) : null}
      </div>

      {/* Instructions */}
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Instructions</h2>
        <div className="text-gray-300 space-y-2">
          <p>• <strong>CSV Format:</strong> Use comma-separated values with headers</p>
          <p>• <strong>JSON Format:</strong> Array of product objects</p>
          <p>• <strong>Required fields:</strong> title, price, handle, category</p>
          <p>• <strong>Images:</strong> Provide valid URLs (for CSV, separate multiple URLs with |)</p>
          <p>• <strong>Handle:</strong> Must be unique URL-friendly identifier (e.g., &quot;premium-white-tshirt&quot;)</p>
          <p>• <strong>Price:</strong> In rupees (e.g., 999 for ₹999)</p>
        </div>
      </div>
    </div>
  );
}
