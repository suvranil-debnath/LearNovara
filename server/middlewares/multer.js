import multer from "multer";
import { google } from "googleapis";
import { v4 as uuid } from "uuid";
import { Readable } from "stream";

// Authenticate with Google
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: "service_account",
    project_id: "total-velocity-443113-c4",
    private_key_id: "6f01196d0d03280ba8405bf5821276c6e206225b",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDby/B2R1/7/ls/\nHMaS0+lKQJAq9TplT7JkdIQP84nmlej7dzlIY2Y9B0LuiAfx7iKEw1xsiUpj/Wgt\nZ91JnIzpZ168r9S46c9NpO+KumZackzmq5FjDzCSkbZbML5F3JSNvjlUoONNk/Dh\nWDMfXLLIz7UDdh7t5KuHHGY6WP7fZiF6l60KTfjv9PHmgONkeospYLSiDbYCzdaw\njl510hOfk2gmi+JaHlFy2Z5Fs/UfW2WuDoWCm20hwMaRkI4bjesSgAk1s6MVAaqh\nm6COIlXbxpvXEDXMrimWnPR/W5T5FHKBIyZ9ljhPXFs0FQIKIQR0CT+LicpZbu7y\nBou5Ui+bAgMBAAECggEADl2H5n3HvN/k9X0F+swK2qWERqp8bz6u5CM8C7wubnms\nc92uSsLkXby/F86gO6RaxolA3dR4njcOZgP8fIvU0d8bBq4J8y6k3pLsbQlobc+R\nTco3gwftHsc96eaHqRKU9aanIewvWan/plrDYfCxvATcnyX144p8g3ohsafmEJJX\nO5B2HiS0jC9FB4rFUxG4biGFwOsOk+yJt/4kUyBO6nmeDyUSj7JBTXo83tdFEAwX\n8761os3rktFMfI7utrTe4RzR64ATp39oJZIPWdOJHHXlPOgBhei93CSRCFCuzDBp\nlU5fQyMwSkTy6hcNrE94ykDRqI78q/35lg8bhrQugQKBgQD1QLkDuXDPvxHtCXvm\nkIiXDh9wROPsKsyLqqz6EYqx9rnsNiT73MOEX0sdnhfblQSB4d6VRW0ARBzNRypy\nZDC2spt0WtwW8zyIDoAMP4RXivpf94Bqba0NM3Yilfs2Xs/GfoROfs8hU6fc5Ea+\nwONtU9XJTrwablRGbY0dni54ewKBgQDlbaVYKBgCcut5HtqzZ4GK7R41/l1qwaAi\nT2bP2xjC1T5/XCc07+X1Is3+YP9HM/epb24Njbu7CUH/jgJ2EKPpyXVk0sD3YOZY\nvpDJRF0wuA3V8X87vL4G27wqgzuG1Uj9HD46HxCEbaAuhWX25xNKH4HXS7Tey+g9\nkrysHXfLYQKBgF+I48lAnmI+osP8MsiAusRk2vhHzaU8kstBI/qRhL6IRqpt+QAn\nYf4ZhNA3ukFuDgBuNN9e2PQGlFWeiDlhL9yrPIUZs6w4+fZh951NzMaxO5DQf7R1\nnriKuFUGqYHncvZ2aCGPoi3wQW55edlql+0JgDjXs8xz994rZJIKAT4rAoGAJFSq\nnD0tICYml7WFGGfJocBOymoPTPqAay57r2qYjzHJhc2H/+AFYD40tJWTlyjpjREy\nMj9BfSrIIrnQNfYIntriFicxm3rivybeMqD6yN48gqaNaV5IETn2oBzL7lwUBNDW\nIcoNiYr6lKNXNDP/X/uBSiCY8bcEfcugyPiZocECgYEAzbm4xR1Zavj3BN5PSBRM\nggTNOYav1G/7bTdqP/3YPTGkg3wNnVTifFIu69MhEeLRiD12dS3yBRLIqIYkfmpr\nu4cFgovUa3HDJrWiZwRfbpWvscKZIAqTHA0wpS/wlEMDUTulCW8JqZYwIZPmFZaq\nPkulKXwRnM14JGS1VdVkyo8=\n-----END PRIVATE KEY-----\n",
    client_email: "learnovara@total-velocity-443113-c4.iam.gserviceaccount.com",
    client_id: "107608827948461132380",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/learnovara%40total-velocity-443113-c4.iam.gserviceaccount.com",
  },
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});


const drive = google.drive({ version: "v3", auth });

// Multer memory storage
const storage = multer.memoryStorage();

// Upload file to Google Drive
// Upload file to Google Drive
async function uploadToDrive(file) {
  const id = uuid();
  const extName = file.originalname.split(".").pop();
  const fileName = `${id}.${extName}`;

  const fileMetadata = {
    name: fileName,
    parents: ["18bbjg5ETFOSD7jnfSz86f8zvG9sTdFZK"], // Replace with your Google Drive folder ID
  };

  // Convert Buffer to Readable stream
  const bufferStream = new Readable();
  bufferStream.push(file.buffer);
  bufferStream.push(null); // Signal the end of the stream

  const media = {
    mimeType: file.mimetype,
    body: bufferStream,
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: "id",
  });

  // Share the file publicly
  await drive.permissions.create({
    fileId: response.data.id,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  // Return the thumbnail URL
  return {
    id: response.data.id,
    path: `https://drive.google.com/thumbnail?id=${response.data.id}&sz=w1000`, // Thumbnail URL
    name: fileName,
  };
}

// Multer middleware with Google Drive upload
export const uploadFiles = multer({ storage }).single("file");

// Middleware to handle file upload and attach Google Drive metadata
export const handleFileUpload = async (req, res, next) => {
  uploadFiles(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "File upload failed", error: err.message });
    }

    if (req.file) {
      try {
        const uploadedFile = await uploadToDrive(req.file);

        // Attach Google Drive file info to req.file to maintain compatibility
        req.file.path = uploadedFile.path; // Thumbnail URL
        req.file.id = uploadedFile.id;

        next();
      } catch (error) {
        return res.status(500).json({ message: "Google Drive upload failed", error: error.message });
      }
    } else {
      next();
    }
  });
};
