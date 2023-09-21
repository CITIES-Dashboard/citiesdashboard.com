import { Typography, Container, Box, Stack } from '@mui/material';
import SocialHandleGrid from './SocialHandleGrid';

function getYear() {
  const d = new Date();
  return d.getFullYear();
}

export default function Footer() {
  return (
    <Box width="100%" backgroundColor="customAlternateBackground" p={3} pt={2}>
      <Container maxWidth="lg">
        <Stack direction="column">
          <Typography variant="body1" fontWeight="bold" color="text.primary" pb={2}>
            Center for Interacting Urban Networks (CITIES)
            <br />
            {getYear()}
          </Typography>

          <SocialHandleGrid />
        </Stack>
      </Container>
    </Box>
  );
}
