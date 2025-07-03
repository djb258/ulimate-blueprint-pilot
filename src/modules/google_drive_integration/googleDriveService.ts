// Google Drive API service for blueprint persistence
// Handles OAuth authentication, file operations, and commander approval

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  createdTime: string;
  modifiedTime: string;
  webViewLink?: string;
}

interface BlueprintData {
  blueprint_id: string;
  version: string;
  doctrine_reference: string;
  timestamp: string;
  [key: string]: unknown;
}

export class GoogleDriveService {
  private accessToken: string | null = null;
  private readonly CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  private readonly API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';
  private readonly SCOPES = ['https://www.googleapis.com/auth/drive.file'];
  private readonly BLUEPRINT_FOLDER_NAME = 'Blueprints';

  constructor() {
    // Initialize Google API client
    this.loadGoogleAPI();
  }

  private loadGoogleAPI(): void {
    // Load Google API client library
    if (typeof window !== 'undefined' && !window.gapi) {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client:auth2', () => {
          window.gapi.client.init({
            apiKey: this.API_KEY,
            clientId: this.CLIENT_ID,
            scope: this.SCOPES.join(' '),
          });
        });
      };
      document.head.appendChild(script);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    if (typeof window === 'undefined' || !window.gapi) {
      return false;
    }

    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (!authInstance) {
        return false;
      }
      return authInstance.isSignedIn.get();
    } catch {
      return false;
    }
  }

  async authenticate(): Promise<void> {
    if (typeof window === 'undefined' || !window.gapi) {
      throw new Error('Google API not available');
    }

    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (!authInstance) {
        throw new Error('Google Auth not initialized');
      }

      const user = await authInstance.signIn();
      const authResponse = user.getAuthResponse();
      this.accessToken = authResponse.access_token;
    } catch (error) {
      throw new Error('Authentication failed');
    }
  }

  async logout(): Promise<void> {
    if (typeof window === 'undefined' || !window.gapi) {
      return;
    }

    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (authInstance) {
        await authInstance.signOut();
      }
      this.accessToken = null;
    } catch (error) {
      throw new Error('Logout failed');
    }
  }

  private async getBlueprintFolder(): Promise<string | null> {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='${this.BLUEPRINT_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to search for folder');
      }

      const data = await response.json();
      if (data.files && data.files.length > 0) {
        return data.files[0].id;
      }

      // Create folder if it doesn't exist
      return await this.createBlueprintFolder();
    } catch (error) {
      throw new Error('Failed to get blueprint folder');
    }
  }

  private async createBlueprintFolder(): Promise<string> {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.BLUEPRINT_FOLDER_NAME,
          mimeType: 'application/vnd.google-apps.folder',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create folder');
      }

      const data = await response.json();
      return data.id;
    } catch (error) {
      throw new Error('Failed to create blueprint folder');
    }
  }

  async listBlueprintFiles(): Promise<DriveFile[]> {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const folderId = await this.getBlueprintFolder();
      if (!folderId) {
        return [];
      }

      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and trashed=false&orderBy=modifiedTime desc`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to list files');
      }

      const data = await response.json();
      return data.files || [];
    } catch (error) {
      throw new Error('Failed to list blueprint files');
    }
  }

  async saveBlueprint(blueprintData: BlueprintData, fileName: string): Promise<string> {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const folderId = await this.getBlueprintFolder();
      if (!folderId) {
        throw new Error('Blueprint folder not found');
      }

      // Convert blueprint data to YAML
      const yamlContent = this.convertToYAML(blueprintData);

      // Create file metadata
      const fileMetadata = {
        name: fileName,
        parents: [folderId],
        mimeType: 'application/x-yaml',
      };

      // Create file
      const response = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fileMetadata),
      });

      if (!response.ok) {
        throw new Error('Failed to create file');
      }

      const file = await response.json();

      // Upload file content
      const uploadResponse = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${file.id}?uploadType=media`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/x-yaml',
          },
          body: yamlContent,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file content');
      }

      return `${this.BLUEPRINT_FOLDER_NAME}/${fileName}`;
    } catch (error) {
      throw new Error('Failed to save blueprint');
    }
  }

  async loadBlueprint(fileId: string): Promise<BlueprintData> {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load file');
      }

      const yamlContent = await response.text();
      return this.parseYAML(yamlContent);
    } catch (error) {
      throw new Error('Failed to load blueprint');
    }
  }

  async deleteBlueprint(fileId: string): Promise<void> {
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
    } catch (error) {
      throw new Error('Failed to delete blueprint');
    }
  }

  private convertToYAML(data: BlueprintData): string {
    // Simple YAML conversion (in production, use a proper YAML library)
    let yaml = '---\n';
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        yaml += `${key}: "${value}"\n`;
      } else if (typeof value === 'object') {
        yaml += `${key}:\n`;
        yaml += this.objectToYAML(value, 2);
      } else {
        yaml += `${key}: ${value}\n`;
      }
    }
    return yaml;
  }

  private objectToYAML(obj: unknown, indent: number): string {
    let yaml = '';
    const spaces = ' '.repeat(indent);
    
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
          yaml += `${spaces}${key}: "${value}"\n`;
        } else if (typeof value === 'object' && value !== null) {
          yaml += `${spaces}${key}:\n`;
          yaml += this.objectToYAML(value, indent + 2);
        } else {
          yaml += `${spaces}${key}: ${value}\n`;
        }
      }
    } else if (Array.isArray(obj)) {
      for (const item of obj) {
        yaml += `${spaces}- ${item}\n`;
      }
    }
    
    return yaml;
  }

  private parseYAML(yamlContent: string): BlueprintData {
    // Simple YAML parsing (in production, use a proper YAML library)
    const lines = yamlContent.split('\n');
    const data: Record<string, unknown> = {};
    let currentKey = '';
    let currentValue = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('#') || trimmed === '---' || trimmed === '') {
        continue;
      }

      const colonIndex = trimmed.indexOf(':');
      if (colonIndex > 0) {
        if (currentKey && currentValue) {
          data[currentKey] = currentValue.trim();
        }
        currentKey = trimmed.substring(0, colonIndex).trim();
        currentValue = trimmed.substring(colonIndex + 1).trim();
      } else if (currentKey && trimmed) {
        currentValue += ' ' + trimmed;
      }
    }

    if (currentKey && currentValue) {
      data[currentKey] = currentValue.trim();
    }

    return data as BlueprintData;
  }
}

// Extend Window interface for Google API
declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
      client: {
        init: (config: {
          apiKey: string;
          clientId: string;
          scope: string;
        }) => Promise<void>;
      };
      auth2: {
        getAuthInstance: () => {
          isSignedIn: {
            get: () => boolean;
          };
          signIn: () => Promise<{
            getAuthResponse: () => { access_token: string };
          }>;
          signOut: () => Promise<void>;
        };
      };
    };
  }
} 