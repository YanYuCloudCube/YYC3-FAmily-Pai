'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button } from './ui/button';
import { GlobeIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';


/**
 * @file 语言切换组件
 * @description 允许用户在支持的五种语言之间切换
 * @author YYC
 * @version 2.0.0
 * @created 2024-10-15
 */

// 支持的语言列表
const LANGUAGES = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' }
];

export function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();
  
  // 获取当前语言的显示名称
  const currentLanguageName = LANGUAGES.find(lang => lang.code === locale)?.name || locale;
  
  // 切换到指定语言
  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) return;
    
    // 替换URL中的语言前缀
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(Boolean);
    
    // 检查路径是否已包含语言前缀
    const hasLocalePrefix = LANGUAGES.some(lang => lang.code === pathSegments[0]);
    
    let newPath;
    if (hasLocalePrefix) {
      // 替换现有语言前缀
      newPath = `/${newLocale}/${pathSegments.slice(1).join('/')}`;
    } else if (pathSegments.length > 0) {
      // 添加新语言前缀
      newPath = `/${newLocale}/${pathSegments.join('/')}`;
    } else {
      // 首页情况
      newPath = `/${newLocale}`;
    }
    
    router.push(newPath);
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label="切换语言"
          className="flex items-center gap-2"
        >
          <GlobeIcon className="h-4 w-4" />
          <span>{currentLanguageName}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <div className="flex flex-col m-0">
          {LANGUAGES.map((language) => (
            <button
              key={language.code}
              onClick={() => switchLanguage(language.code)}
              className={`w-full text-left cursor-pointer py-2 px-4 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${locale === language.code ? 'bg-gray-100 dark:bg-gray-800 font-medium' : ''}`}
              aria-selected={locale === language.code}
            >
              {language.name}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}