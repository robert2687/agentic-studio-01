"use client";

import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';

export type FileNode = {
  name: string;
  type: 'folder' | 'file';
  status?: 'generating' | 'done';
  children?: FileNode[];
};

interface FileTreeProps {
  node: FileNode;
  level?: number;
}

export const FileTree: React.FC<FileTreeProps> = ({ node, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(level < 2);
  const isFolder = node.type === 'folder';

  const toggleOpen = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    }
  };

  const Icon = isFolder ? Folder : File;
  const ChevronIcon = isOpen ? ChevronDown : ChevronRight;

  return (
    <div>
      <div
        className={`flex items-center py-1.5 px-2 rounded-md cursor-pointer hover:bg-gray-700/50 ${node.status === 'generating' ? 'text-yellow-400 animate-pulse' : 'text-gray-300'}`}
        style={{ paddingLeft: `${level * 16 + 4}px` }}
        onClick={toggleOpen}
      >
        <div className="w-4 mr-2 flex-shrink-0">
          {isFolder && <ChevronIcon size={16} />}
        </div>
        <Icon size={16} className="mr-2 flex-shrink-0" />
        <span className="truncate text-sm">{node.name}</span>
      </div>
      {isFolder && isOpen && node.children && (
        <div>
          {node.children.map((child, index) => (
            <FileTree key={index} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
