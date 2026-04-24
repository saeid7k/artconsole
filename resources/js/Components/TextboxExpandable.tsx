import { Button } from "antd";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import HtmlRenderer from "./HtmlRenderer";

type Props = {
  content: string;
  lines?: number;
  className?: string;
}

function TextboxExpandable({ content, lines = 1, className }: Props) {

  const isShortContent = content?.length <= 100;

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isShortContent) {
      setIsExpanded(true);
    }
  }, [isShortContent]);

  return (
    <div
      className={twMerge("flex items-end flex-nowrap gap-1",
      isExpanded ? 'flex-col items-start' : '',
      className
    )}>
      <div
        className={twMerge("w-full",
          isExpanded ? '' : `line-clamp-${lines} sm:max-w-[80%]`
        )}
      >
        <HtmlRenderer htmlContent={content} />
      </div>
      <motion.div layout>
        <Button
          size="small"
          type="dashed"
          className={twMerge("text-xs text-muted",
            isShortContent ? 'hidden' : ''
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Less' : 'More'}
        </Button>
      </motion.div>
    </div>
  )
}

export default TextboxExpandable;
