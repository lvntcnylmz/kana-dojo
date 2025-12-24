'use client';

import themeSets, { applyTheme } from '@/features/Preferences/data/themes';
import usePreferencesStore from '@/features/Preferences/store/usePreferencesStore';
import { useClick } from '@/shared/hooks/useAudio';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/shared/components/ui/dialog';
import { X } from 'lucide-react';
import { createElement, useState } from 'react';

interface ThemesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ThemesModal({ open, onOpenChange }: ThemesModalProps) {
  const { playClick } = useClick();
  const selectedTheme = usePreferencesStore(state => state.theme);
  const setSelectedTheme = usePreferencesStore(state => state.setTheme);

  const [hoveredTheme, setHoveredTheme] = useState('');

  const handleThemeClick = (themeId: string) => {
    playClick();
    setSelectedTheme(themeId);
    applyTheme(themeId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        className='flex max-h-[85vh] w-[95vw] max-w-4xl flex-col gap-0 p-0 sm:max-h-[80vh] sm:w-[90vw]'
      >
        <DialogHeader className='sticky top-0 z-10 flex flex-row items-center justify-between rounded-t-2xl border-b-1 border-(--border-color) bg-(--background-color) px-6 pt-6 pb-4'>
          <DialogTitle className='text-2xl font-semibold text-(--main-color)'>
            Themes
          </DialogTitle>
          <button
            onClick={() => {
              playClick();
              onOpenChange(false);
            }}
            className='flex-shrink-0 rounded-xl p-2 transition-colors hover:cursor-pointer hover:bg-[var(--card-color)]'
          >
            <X size={24} className='text-[var(--secondary-color)]' />
          </button>
        </DialogHeader>
        <div id='modal-scroll' className='flex-1 overflow-y-auto px-6 py-6'>
          <div className='space-y-6'>
            {themeSets.map(group => (
              <div key={group.name} className='space-y-3'>
                <DialogTitle className='flex items-center gap-2 text-lg font-medium text-(--main-color)'>
                  {createElement(group.icon)}
                  {group.name}
                  <span className='text-sm font-normal text-(--secondary-color)'>
                    ({group.themes.length})
                  </span>
                </DialogTitle>
                <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4'>
                  {group.themes.map(theme => {
                    const themeName = theme.id.replaceAll('-', ' ');
                    const isSelected = selectedTheme === theme.id;
                    const isHovered = hoveredTheme === theme.id;

                    return (
                      <div
                        key={theme.id}
                        className='group relative cursor-pointer rounded-lg p-3 transition-all duration-100'
                        style={{
                          backgroundColor: isHovered
                            ? theme.cardColor
                            : theme.backgroundColor,
                          border: isSelected
                            ? `1px solid ${theme.mainColor}`
                            : `1px solid ${theme.borderColor}`
                        }}
                        onMouseEnter={() => setHoveredTheme(theme.id)}
                        onMouseLeave={() => setHoveredTheme('')}
                        onClick={() => handleThemeClick(theme.id)}
                      >
                        <div className='mb-2 flex items-center justify-between'>
                          <span
                            className='text-sm capitalize'
                            style={{ color: theme.mainColor }}
                          >
                            {isSelected && '\u2B24 '}
                            {themeName}
                          </span>
                        </div>
                        <div className='flex gap-1.5'>
                          <div
                            className='h-4 w-4 rounded-full ring-1 transition-all'
                            style={
                              {
                                background: theme.backgroundColor,
                                '--tw-ring-color': theme.borderColor
                              } as React.CSSProperties
                            }
                          />
                          <div
                            className='h-4 w-4 rounded-full ring-1 transition-all'
                            style={
                              {
                                background: theme.mainColor,
                                '--tw-ring-color': theme.borderColor
                              } as React.CSSProperties
                            }
                          />
                          <div
                            className='h-4 w-4 rounded-full ring-1 transition-all'
                            style={
                              {
                                background: theme.secondaryColor,
                                '--tw-ring-color': theme.borderColor
                              } as React.CSSProperties
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
