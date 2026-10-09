/**
 * Google Drive API Service for saving exported LKPD worksheets.
 * Uses Google Drive REST API v3 (drive.googleapis.com) with drive.file scope.
 */

export interface GoogleDriveUploadResult {
  id: string;
  name: string;
  webViewLink?: string;
  webContentLink?: string;
}

/**
 * Uploads a file (PDF or Word document) to the user's Google Drive using multipart upload.
 *
 * @param name File name (e.g. "LKPD-PAI-Kelas-4-Asmaul-Husna.pdf")
 * @param mimeType MIME type (e.g. "application/pdf" or "application/msword")
 * @param blob File data blob
 * @param accessToken Valid OAuth access token with drive.file scope
 * @param description Optional description for the file in Google Drive
 */
export async function uploadFileToGoogleDrive(
  name: string,
  mimeType: string,
  blob: Blob,
  accessToken: string,
  description: string = 'Lembar Kerja Peserta Didik (LKPD) PAI SD - Kurikulum Merdeka SK No. 020/H/KR/2026'
): Promise<GoogleDriveUploadResult> {
  const metadata = {
    name,
    mimeType,
    description,
  };

  const boundary = '-------LuminaDriveBoundary' + Math.random().toString(36).substring(2);
  const startDelimiter = `--${boundary}\r\n`;
  const partDelimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadataContentType = 'Content-Type: application/json; charset=UTF-8\r\n\r\n';
  const fileContentType = `Content-Type: ${mimeType}\r\n\r\n`;

  // Construct multipart request body using Blob parts
  const multipartBlob = new Blob(
    [
      startDelimiter,
      metadataContentType,
      JSON.stringify(metadata),
      partDelimiter,
      fileContentType,
      blob,
      closeDelimiter,
    ],
    { type: `multipart/related; boundary=${boundary}` }
  );

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: multipartBlob,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    let parsedMsg = errorText;
    try {
      const parsed = JSON.parse(errorText);
      parsedMsg = parsed.error?.message || errorText;
    } catch (e) {
      // ignore
    }
    throw new Error(`Google Drive API error (${response.status}): ${parsedMsg}`);
  }

  const result: GoogleDriveUploadResult = await response.json();
  return result;
}
