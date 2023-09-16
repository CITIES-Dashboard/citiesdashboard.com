import { Link, List, ListItem, ListItemText, Table, TableBody, TableCell, TableHead, TableRow, styled, TableFooter } from '@mui/material';
import parse, { domToReact } from 'html-react-parser';

// Function to replace characters like "-" with " " from a string and capitalize it
export const capitalizePhrase = (str) => {
  const words = str.split(/[\s-]+/);
  const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  const capitalizedString = capitalizedWords.join(' ');
  return capitalizedString;
};

const htmlOrderedListTypeToMUIListStyle = {
  1: 'decimal',
  '01': 'decimal-leading-zero',
  a: 'lower-alpha',
  A: 'upper-alpha',
  i: 'lower-roman',
  I: 'upper-roman',
  square: 'square',
  circle: 'circle',
  disc: 'disc'
};

const StyleListItem = styled(ListItem)(() => ({
  '::marker': {
    fontSize: '0.9rem'
  },
  display: 'list-item',
  paddingBottom: '0.125rem',
  paddingTop: 0,
  paddingLeft: '0.25rem'
}));

// Function to replace HTML tags with MUI components
export const replacePlainHTMLWithMuiComponents = (node) => {
  if (node.type !== 'tag') return undefined;

  switch (node.name) {
    case 'a': {
      return (
        <Link
          href={node.attribs.href}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
        >
          {node.children && node.children.length > 0 && parse(node.children[0].data)}
        </Link>
      );
    }

    case 'ul': {
      return (
        <List dense sx={{ listStyleType: htmlOrderedListTypeToMUIListStyle.disc, paddingLeft: 4, paddingTop: '6px' }}>
          {node.children.map((child) => (
            <StyleListItem>
              <ListItemText primary={domToReact(child.children)} />
            </StyleListItem>
          ))}
        </List>
      );
    }

    case 'ol': {
      return (
        <List dense sx={{ listStyleType: htmlOrderedListTypeToMUIListStyle[node.attribs.type], paddingLeft: 4, paddingTop: '6px' }}>
          {node.children.map((child) => (
            <StyleListItem>
              <ListItemText primary={domToReact(child.children)} />
            </StyleListItem>
          ))}
        </List>
      );
    }

    case 'table': {
      const thead = node.children.find((child) => child.name === 'thead');
      const tbody = node.children.find((child) => child.name === 'tbody');
      const tfoot = node.children.find((child) => child.name === 'tfoot');

      const headerCells = thead ? thead.children.find((child) => child.name === 'tr').children.filter((child) => child.name === 'th') : [];
      const rows = tbody ? tbody.children.filter((child) => child.name === 'tr') : [];
      const footerCells = tfoot ? tfoot.children.find((child) => child.name === 'tr') : [];

      return (
        <Table size="small" sx={{ mt: 1, width: 'fit-content' }}>
          <TableHead>
            <TableRow>
              {headerCells.map((child) => (
                <TableCell>{domToReact(child.children)}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow>
                {row.children.filter((child) => child.name === 'td').map((cell) => (
                  <TableCell>{domToReact(cell.children)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            {footerCells.map((row) => (
              <TableRow>
                {row.children.filter((child) => child.name === 'td').map((cell) => (
                  <TableCell>{domToReact(cell.children)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableFooter>
        </Table>
      );
    }

    default: {
      return undefined;
    }
  }
};
