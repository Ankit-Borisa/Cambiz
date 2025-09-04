const { BlobServiceClient } = require("@azure/storage-blob");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME;

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error("Azure Storage Connection string is required in .env");
}

const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
);
const containerClient =
  blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);

/**
 * Uploads a file to Azure Blob Storage.
 * @param {Buffer} fileBuffer - The file buffer.
 * @param {string} originalFileName - The original file name.
 * @param {string} mimeType - The MIME type of the file.
 * @returns {Promise<string>} - The URL of the uploaded file.
 */

async function uploadToAzureBlob(file) {
  try {
    const fileBuffer = file.buffer;
    const originalFileName = file.originalname;
    const mimeType = file.mimetype;
    const fieldname = file.fieldname;

    const fileExtension = path.extname(originalFileName);
    const uniqueFileName = `${uuidv4()}${fieldname}${fileExtension}`;

    const blockBlobClient = containerClient.getBlockBlobClient(uniqueFileName);
    await blockBlobClient.uploadData(fileBuffer, {
      blobHTTPHeaders: { blobContentType: mimeType },
    });

    console.log(`File uploaded successfully: ${uniqueFileName}`);

    return { url: blockBlobClient.url, uniqueFileName };
  } catch (error) {
    console.error("Azure Blob Upload Error:", error);
    throw new Error("Failed to upload file to Azure");
  }
}

// delete a file from azure blob storage

/**
 * Deletes a file from Azure Blob Storage.
 * @param {string} fileName - The name of the file to delete.
 * @returns {Promise<boolean>} - Returns true if deleted successfully, otherwise false.
 */
const deleteFromAzureBlob = async (fileName) => {
  try {
    if (!AZURE_STORAGE_CONNECTION_STRING) {
      throw new Error("Azure Storage connection string is missing.");
    }

    // Create BlobServiceClient
    const blobClient = containerClient.getBlobClient(fileName);

    // Delete blob
    const response = await blobClient.deleteIfExists();

    if (response.succeeded) {
      console.log(`File deleted successfully: ${fileName}`);
      return true;
    } else {
      console.log(`File not found or already deleted: ${fileName}`);
      return false;
    }
  } catch (error) {
    console.error(
      "Error deleting file from Azure Blob Storage:",
      error.message
    );
    return false;
  }
};

module.exports = {
  uploadToAzureBlob,
  deleteFromAzureBlob,
};
