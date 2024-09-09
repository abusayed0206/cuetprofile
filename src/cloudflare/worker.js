// এখন কোন ধরনের সিকুরিটি দেয়া নাই ওয়ার্কার এ। এছাড়া, ক্যাশ পার্জ এর জন্য ও কোন ফাংশন যুক্ত করা নাই! প্রত্যেকবার ছবি আপলোড এর পর ক্লাউডফ্লেয়ার এর ক্যাশ পার্জ করতে হবে। নতুবা, নতুন ছবি দেখাবে না! আমি সময় পাচ্ছি না! আপনি পারলে করে দিয়েন! ধন্যবাদ।

// এই ফাইলটা এই ওয়েবসাইট এর সাথে সম্পর্কিত না! এটা আলাদা একটা ফাইল যেটা ক্লাউডফ্লেয়ার ওয়ার্কারটা চালাচ্ছে! 

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
    try {
      console.log('Request received');
      console.log('Request method:', request.method);
  
      const bucket = DPLINK_BUCKET; // Ensure this environment variable is set
  
      if (!bucket) {
        throw new Error('Bucket environment variable is not defined');
      }
  
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
      }
  
      console.log('Parsing form data');
      const formData = await request.formData();
      const file = formData.get('file');
      const id = formData.get('id');
  
      if (!file || !id) {
        return new Response('File or ID missing', { status: 400 });
      }
  
      console.log('File received. Size:', file.size, 'Type:', file.type);
  
      // Increase file size limit to 300KB and allow specified image types
      if (file.size > 300 * 1024) {
        return new Response('File is too large (max 300KB)', { status: 400 });
      }
  
      // Validate that the file is one of the allowed image types
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedMimeTypes.includes(file.type)) {
        return new Response('Invalid file format (must be JPEG, PNG, or WEBP)', { status: 400 });
      }
  
      console.log('File validation passed');
  
      // Determine file extension based on MIME type and preserve original if applicable
      let fileExtension = '';
      const originalFileName = file.name || '';
  
      if (file.type === 'image/jpeg') {
        if (originalFileName.endsWith('.jpg')) {
          fileExtension = 'jpg'; // Use .jpg if it's in the original filename
        } else if (originalFileName.endsWith('.jpeg')) {
          fileExtension = 'jpeg'; // Use .jpeg if that's the original extension
        } else {
          fileExtension = 'jpeg'; // Default to jpeg if the original extension is ambiguous
        }
      } else if (file.type === 'image/png') {
        fileExtension = 'png'; // Use png for image/png MIME type
      } else if (file.type === 'image/webp') {
        fileExtension = 'webp'; // Use webp for image/webp MIME type
      }
  
      const fileName = `${id}.${fileExtension}`;
      const cdnUrl = `https://cdn.abusayed.dev/${fileName}`;
  
      console.log('Attempting to upload file:', fileName);
  
      // Check if a file with this name already exists
      const existingFile = await bucket.get(fileName);
      if (existingFile) {
        console.log('Existing file found. Deleting...');
        await bucket.delete(fileName);
        console.log('Existing file deleted');
      } else {
        console.log('No existing file found with this name');
      }
  
      // Upload new file to R2
      await bucket.put(fileName, file, {
        httpMetadata: { contentType: file.type },
        customMetadata: { filename: fileName }
      });
  
      console.log('New file uploaded successfully');
      return new Response(JSON.stringify({ url: cdnUrl }), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      });
  
    } catch (error) {
      console.error('Error in handleRequest:', error);
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  }
  