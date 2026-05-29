import { useWindow } from '@/hooks/useWindow';
import { SearchIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { router } from "@inertiajs/react";
import { Button } from 'antd';
import Search from 'antd/es/input/Search';
import { useEffect, useRef, useState } from 'react';
import AnimatedContainer from './AnimatedContainer';
import FlexBox from './Containers/FlexBox';

type Props = {
  routeName: string;
  placeHolder?: string;
};

function PageSearchBox({ routeName, placeHolder }: Props) {

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { isMobile } = useWindow();

  const [showField, setShowField] = useState(false);

  function handleSearch(value: string) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }

    router.get(
      route(routeName),
      Object.fromEntries(params.entries()),
      { preserveScroll: true, preserveState: true }
    );
  }

  function debouncedSearch(value: string, delay: number = 300) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, delay);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <FlexBox>
      {isMobile && (
        <Button
          type="text"
          shape="circle"
          icon={<HugeiconsIcon icon={SearchIcon} size={20} />}
          onClick={() => setShowField(!showField)}
        />
      )}

      {(showField || !isMobile) && (
        <Search
          placeholder={placeHolder || "search..."}
          style={{ width: 200 }}
          size="middle"
          allowClear
          onChange={(e) => debouncedSearch(e.target.value, 1000)}
          styles={{
            button: {
              root: {
                display: isMobile ? 'none' : 'block'
              }
            }
          }}
        />
      )}
    </FlexBox>
  )
}

export default PageSearchBox;
