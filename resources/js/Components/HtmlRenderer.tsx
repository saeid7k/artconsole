import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

const HtmlRenderer = ({ htmlContent }: { htmlContent: string }) => {

  const contentWithNormalSpaces = htmlContent.replace(/&nbsp;/g, ' ');

  const cleanHtmlString = DOMPurify.sanitize(contentWithNormalSpaces, {
    USE_PROFILES: { html: true },
  });

  return (
    <div className="whitespace-pre-wrap break-words">
      {parse(cleanHtmlString)}
    </div>
  );
};

export default HtmlRenderer;
