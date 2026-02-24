// ---------------------------------------------------------------------------
// PostContent — renders the HTML content returned by the CMS.
//
// Hygraph (and most GraphQL CMSs) returns post bodies as serialised HTML.
// We render it with `dangerouslySetInnerHTML`, which is the standard pattern
// for trusted CMS content (never use it with user-supplied input).
//
// Typography is handled by the `.blog-prose` CSS class defined in globals.css,
// which applies styles to semantic HTML elements without requiring
// @tailwindcss/typography — demonstrating manual CSS3 skill.
// ---------------------------------------------------------------------------

interface PostContentProps {
  html: string;
}

export function PostContent({ html }: PostContentProps) {
  return (
    <div
      className="blog-prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
