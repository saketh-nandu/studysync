import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Folder, 
  File, 
  Upload, 
  Download, 
  Search, 
  Trash2, 
  Edit, 
  Eye, 
  Copy,
  Move,
  Archive,
  FolderPlus,
  Filter,
  Grid,
  List,
  SortAsc,
  RefreshCw,
  Share2,
  FileText,
  Image,
  Music,
  Video,
  FileArchive
} from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size: number;
  mimeType: string;
  dateModified: Date;
  dateCreated: Date;
  path: string;
  isShared: boolean;
  tags: string[];
}

export function FileManager() {
  const [files, setFiles] = useState<FileItem[]>([]);

  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'folder') return <Folder className="w-5 h-5 text-blue-500" />;
    
    if (item.mimeType.startsWith('image/')) return <Image className="w-5 h-5 text-green-500" />;
    if (item.mimeType.startsWith('video/')) return <Video className="w-5 h-5 text-red-500" />;
    if (item.mimeType.startsWith('audio/')) return <Music className="w-5 h-5 text-purple-500" />;
    if (item.mimeType.includes('pdf')) return <FileText className="w-5 h-5 text-red-600" />;
    if (item.mimeType.includes('zip') || item.mimeType.includes('rar')) return <FileArchive className="w-5 h-5 text-orange-500" />;
    
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return b.dateModified.getTime() - a.dateModified.getTime();
      case 'size':
        return b.size - a.size;
      default:
        return 0;
    }
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    if (uploadedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        
        // Actual file upload
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await apiRequest('POST', '/api/upload', formData);
        
        if (response.success) {
          const newFile: FileItem = {
            id: Date.now() + i.toString(),
            name: file.name,
            type: 'file',
            size: file.size,
            mimeType: file.type,
            dateModified: new Date(),
            dateCreated: new Date(),
            path: `/uploads/${response.filename}`,
            isShared: false,
            tags: []
          };
          
          setFiles(prev => [...prev, newFile]);
          setUploadProgress(((i + 1) / uploadedFiles.length) * 100);
        }
      }
      
      toast({
        title: "Upload complete",
        description: `${uploadedFiles.length} file(s) uploaded successfully.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Some files failed to upload. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileAction = (action: string, fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    switch (action) {
      case 'download':
        // Create a mock download
        const link = document.createElement('a');
        link.href = `data:text/plain;charset=utf-8,Mock file content for ${file.name}`;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Download started",
          description: `${file.name} is being downloaded.`,
        });
        break;
      case 'delete':
        setFiles(prev => prev.filter(f => f.id !== fileId));
        toast({
          title: "File deleted",
          description: `${file.name} has been moved to trash.`,
        });
        break;
      case 'share':
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, isShared: !f.isShared } : f
        ));
        toast({
          title: file.isShared ? "Sharing disabled" : "Sharing enabled",
          description: `${file.name} sharing has been ${file.isShared ? 'disabled' : 'enabled'}.`,
        });
        break;
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to perform bulk actions.",
        variant: "destructive",
      });
      return;
    }

    switch (action) {
      case 'download':
        toast({
          title: "Bulk download started",
          description: `Downloading ${selectedFiles.length} selected files.`,
        });
        break;
      case 'delete':
        setFiles(prev => prev.filter(f => !selectedFiles.includes(f.id)));
        toast({
          title: "Files deleted",
          description: `${selectedFiles.length} files have been moved to trash.`,
        });
        setSelectedFiles([]);
        break;
      case 'archive':
        toast({
          title: "Archive created",
          description: `${selectedFiles.length} files have been archived.`,
        });
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search files and folders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>
          <Button variant="outline" size="sm">
            <SortAsc className="w-4 h-4 mr-2" />
            Sort
          </Button>
          <Button
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uploading files...</span>
                <span className="text-sm text-text-secondary">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions */}
      {selectedFiles.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedFiles.length} files selected
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handleBulkAction('download')}
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={() => handleBulkAction('archive')}
                  variant="outline"
                  size="sm"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </Button>
                <Button
                  onClick={() => handleBulkAction('delete')}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Files Grid/List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Folder className="w-5 h-5" />
            <span>Files & Folders</span>
            <Badge variant="outline">{sortedFiles.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedFiles.length === 0 ? (
            <div className="text-center py-8">
              <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Files Yet</h3>
              <p className="text-text-secondary mb-4">
                Upload your first file to get started
              </p>
              <Button
                onClick={() => document.getElementById('file-upload')?.click()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedFiles.map((file) => (
                <div
                  key={file.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-surface-variant ${
                    selectedFiles.includes(file.id) ? 'bg-primary/10 border-primary' : ''
                  }`}
                  onClick={() => {
                    if (selectedFiles.includes(file.id)) {
                      setSelectedFiles(prev => prev.filter(id => id !== file.id));
                    } else {
                      setSelectedFiles(prev => [...prev, file.id]);
                    }
                  }}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 flex items-center justify-center bg-surface-variant rounded-lg">
                      {getFileIcon(file)}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium truncate w-full">{file.name}</p>
                      <p className="text-xs text-text-secondary">
                        {file.type === 'folder' ? 'Folder' : formatFileSize(file.size)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {file.isShared && (
                        <Badge variant="secondary" className="text-xs">
                          <Share2 className="w-3 h-3 mr-1" />
                          Shared
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-1 mt-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileAction('download', file.id);
                      }}
                      variant="ghost"
                      size="sm"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileAction('share', file.id);
                      }}
                      variant="ghost"
                      size="sm"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileAction('delete', file.id);
                      }}
                      variant="ghost"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {sortedFiles.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors hover:bg-surface-variant ${
                    selectedFiles.includes(file.id) ? 'bg-primary/10 border-primary' : ''
                  }`}
                  onClick={() => {
                    if (selectedFiles.includes(file.id)) {
                      setSelectedFiles(prev => prev.filter(id => id !== file.id));
                    } else {
                      setSelectedFiles(prev => [...prev, file.id]);
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file)}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-text-secondary">
                        {file.type === 'folder' ? 'Folder' : formatFileSize(file.size)} • 
                        {file.dateModified.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {file.isShared && (
                      <Badge variant="secondary" className="text-xs">
                        <Share2 className="w-3 h-3 mr-1" />
                        Shared
                      </Badge>
                    )}
                    <div className="flex items-center space-x-1">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileAction('download', file.id);
                        }}
                        variant="ghost"
                        size="sm"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileAction('share', file.id);
                        }}
                        variant="ghost"
                        size="sm"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileAction('delete', file.id);
                        }}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Storage Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Archive className="w-5 h-5" />
            <span>Storage Usage</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Used Storage</span>
              <span className="text-sm text-text-secondary">2.3 GB of 10 GB</span>
            </div>
            <Progress value={23} className="w-full" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
                <p className="text-text-secondary">Documents</p>
                <p className="font-medium">1.2 GB</p>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                <p className="text-text-secondary">Images</p>
                <p className="font-medium">800 MB</p>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
                <p className="text-text-secondary">Videos</p>
                <p className="font-medium">300 MB</p>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-1"></div>
                <p className="text-text-secondary">Other</p>
                <p className="font-medium">50 MB</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        id="file-upload"
        type="file"
        multiple
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>
  );
}