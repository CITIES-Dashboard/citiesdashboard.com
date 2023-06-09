// disable eslint for this file
/* eslint-disable */
import { Link, List, ListItem, ListItemText } from '@mui/material';
import parse, { domToReact } from 'html-react-parser';

// Function to replace HTML tags with MUI components
export const replacePlainHTMLWithMuiComponents = (node) => {
    // Replace <a> tags with <Link> tags
    if (node.type === 'tag' && node.name === 'a') {
        return (
            <Link href={node.attribs.href} target="_blank" rel="noopener noreferrer" underline='hover'>
                {node.children && node.children.length > 0 && parse(node.children[0].data)}
            </Link>
        );
    }

    // Replace <ul> tags with <List> tags
    if (node.type === "tag" && node.name === "ul") {
        return (
            <List dense={true} sx={{ listStyleType: 'disc', paddingLeft: 4, paddingTop: '6px' }}>
                {node.children.map((child) => (
                    // Replace <li> tags with <ListItem> tags
                    <ListItem sx={{ display: 'list-item', paddingY: 0, paddingLeft: '4px' }}>
                        <ListItemText primary={domToReact(child.children)} />
                    </ListItem>
                ))}
            </List>
        );
    }

    return undefined;
};