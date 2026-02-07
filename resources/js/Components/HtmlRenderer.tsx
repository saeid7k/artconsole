import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

const HtmlRenderer = ({ htmlContent }: { htmlContent: string }) => {
  const cleanHtmlString = DOMPurify.sanitize(htmlContent, {
    USE_PROFILES: { html: true },
  });

  return (
    <div className="prose">
      {parse(cleanHtmlString)}
    </div>
  );
};

export default HtmlRenderer;
