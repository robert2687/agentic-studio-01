
"use client";

import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown, LoaderCircle } from 'lucide-react';

export type FileNode = {
  name: string;
  type: 'folder' | 'file';
  path: string;
  status?: 'generating' | 'done';
  children?: FileNode[];
};

interface FileTreeProps {
  node: FileNode;
  level?: number;
  onFileSelect: (path: string) => void;
}

export const FileTree: React.FC<FileTreeProps> = ({ node, level = 0, onFileSelect }) => {
  const [isOpen, setIsOpen] = useState(level < 2);
  const isFolder = node.type === 'folder';

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else if (node.path) {
      onFileSelect(node.path);
    }
  };

  const Icon = isFolder ? Folder : File;
  const ChevronIcon = isOpen ? ChevronDown : ChevronRight;

  return (
    <div>
      <div
        className={`flex items-center py-1.5 px-2 rounded-md cursor-pointer hover:bg-muted text-foreground`}
        style={{ paddingLeft: `${level * 16 + 4}px` }}
        onClick={handleClick}
      >
        <div className="w-4 mr-2 flex-shrink-0">
          {isFolder && <ChevronIcon size={16} />}
        </div>
        <Icon size={16} className={`mr-2 flex-shrink-0 ${node.status === 'done' ? 'text-green-500' : 'text-muted-foreground'}`} />
        <span className="truncate text-sm flex-1">{node.name}</span>
        {node.status === 'generating' && <LoaderCircle size={14} className="animate-spin text-yellow-500" />}
      </div>
      {isFolder && isOpen && node.children && (
        <div>
          {node.children.map((child, index) => {
            const childPath = node.path === '/' ? `/${child.name}` : `${node.path}/${child.name}`;
            return <FileTree key={index} node={{...child, path: childPath }} level={level + 1} onFileSelect={onFileSelect} />
          })}
        </div>
      )}
    </div>
  );
};
