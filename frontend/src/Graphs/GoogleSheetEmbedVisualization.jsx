import { memo } from 'react';

function GoogleSheetEmbedVisualization(props) {
  const { publishedSheetId, gid, range } = props;
  const embedLink = `https://docs.google.com/spreadsheets/d/e/${publishedSheetId}/pubhtml?gid=${gid}&single=true&widget=false&headers=false&chrome=false&range=${range}`;
  return (
    <iframe
      title="google-sheet-embed-visualization-iframe"
      className="google-sheet-embed-visualization-iframe"
      style={{ width: '100%', height: '100%', border: 'none' }}
      src={embedLink}
    >
      Loading...
    </iframe>
  );
}

export default memo(GoogleSheetEmbedVisualization);
