import { SOURCE_ZIP_BASE64, SOURCE_ZIP_SIZE } from './sourceBundleBase64';

/**
 * Downloads the complete source code directly in the browser as a valid .ZIP archive.
 *
 * Why this approach is used:
 * In sandboxed and reverse-proxied preview environments (such as cloud containers or iframe runners),
 * standard `<a href="/file.zip">` links often get intercepted by SPA router fallbacks or auth proxies,
 * causing browsers to download `index.html` instead of the actual binary archive.
 *
 * By packaging the archive in-memory and triggering a direct Blob download with MIME type
 * `application/zip`, the browser saves the authentic binary ZIP without making network requests
 * that could be rewritten to HTML.
 */
export function downloadSourceZip(filename = 'khamphi-suadluad-source.zip'): {
  success: boolean;
  sizeKb: number;
  error?: string;
} {
  try {
    // 1. Decode base64 to binary string
    const binaryString = atob(SOURCE_ZIP_BASE64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // 2. Verify ZIP magic bytes (PK\x03\x04 or PK\x05\x06)
    if (bytes[0] !== 0x50 || bytes[1] !== 0x4b) {
      throw new Error('Invalid ZIP signature in memory bundle.');
    }

    // 3. Create genuine application/zip Blob
    const blob = new Blob([bytes], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);

    // 4. Trigger browser download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.setAttribute('style', 'display: none');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up memory
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 2000);

    return {
      success: true,
      sizeKb: Math.round(len / 1024),
    };
  } catch (err: any) {
    console.error('Error generating source zip download:', err);
    // Fallback: try direct public link if base64 decoding fails for any reason
    try {
      const fallbackLink = document.createElement('a');
      fallbackLink.href = `/${filename}`;
      fallbackLink.download = filename;
      fallbackLink.click();
    } catch {
      // ignore
    }
    return {
      success: false,
      sizeKb: Math.round(SOURCE_ZIP_SIZE / 1024),
      error: err?.message || 'Failed to download zip',
    };
  }
}
