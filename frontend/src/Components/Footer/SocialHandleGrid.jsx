import { Facebook, LinkedIn, Instagram, Twitter } from '@mui/icons-material/';
import { AiFillInstagram } from 'react-icons/ai';
import { Stack } from '@mui/material';
import CustomLink from '../CustomLink';

export default function SocialHandleGrid() {
  return (
    <Stack direction="column">
      <Stack
        direction="row"
        spacing={1}
        sx={{
          '& svg': {
            fontSize: '2rem'
          }
        }}
      >
        <CustomLink href="https://twitter.com/cities_nyuad/" text={<Twitter />} />
        <CustomLink href="https://www.linkedin.com/company/center-for-interacting-urban-networks/" text={<LinkedIn />} />
        <CustomLink href="https://www.facebook.com/nyuad.cities/" text={<Facebook />} />
        <CustomLink href="https://www.instagram.com/cities.nyuad/" text={<AiFillInstagram />} />
      </Stack>

      <CustomLink href="mailto:nyuad.cities@nyu.edu" text="nyuad.cities@nyu.edu" />
    </Stack>
  );
}
