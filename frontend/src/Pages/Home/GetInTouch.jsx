import { Typography, Container, Paper, Box, Button, TextField } from '@mui/material';
import parse from 'html-react-parser';
import SendIcon from '@mui/icons-material/Send';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import DataObjectIcon from '@mui/icons-material/DataObject';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import UppercaseTitle from '../../Components/UppercaseTitle';
import jsonData from '../../section_data.json';
import { replacePlainHTMLWithMuiComponents, capitalizePhrase } from '../../Utils/Utils';

const googleFormLink = 'https://docs.google.com/forms/d/e/1FAIpQLSenxtTIizWED0PT3hBOn3IU6fwmj4sr1yhjU70mjmK4R-ipsw/';

function FeedbackForm() {
  return (
    <Box
      component="form"
      action={`${googleFormLink}/formResponse`}
      method="get"
      sx={{
        '& svg': {
          verticalAlign: 'middle',
          mr: 0.5
        }
      }}
    >
      <TextField
        sx={{ mb: 2 }}
        label={(
          <>
            <AlternateEmailIcon />
            Your Email
          </>
        )}
        size="small"
        type="email"
        variant="outlined"
        fullWidth
        name="entry.639426313"
        required
      />
      <TextField
        sx={{ mb: 2 }}
        label={(
          <>
            <DataObjectIcon />
            Let us know if you have a dataset to contribute!
          </>
        )}
        helperText="It should be relevant to the NYU Abu Dhabi campus community, especially on sustainability, well-being, or other quantifiable metrics (i.e. campus operations, consumptions, etc)"
        size="small"
        variant="outlined"
        fullWidth
        name="entry.746740204"
        multiline
        rows={4}
      />
      <TextField
        sx={{ mb: 1 }}
        label={(
          <>
            <TipsAndUpdatesIcon />
            What can be improved regarding your experience using the dashboard?
          </>
        )}
        helperText={(
          <div>
            For example:
            <ul style={{ marginTop: 0 }}>
              <li>
                The navigation between pages
              </li>
              <li>
                The data visualizations
              </li>
              <li>
                The datasets
              </li>
              <li>
                Any other user interface elements
              </li>
            </ul>
          </div>
        )}
        size="small"
        variant="outlined"
        fullWidth
        name="entry.1433812927"
        multiline
        rows={4}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        startIcon={<SendIcon />}
      >
        Submit
      </Button>
      <Typography
        variant="caption"
        component="p"
        color="text.secondary"
        sx={{ mt: 0.5, fontStyle: 'italic' }}
      >
        By clicking this, you will be re-directed to Google Form&apos;s post-submission page.
      </Typography>
    </Box>
  );
}

function GetInTouch() {
  return (
    <Container>
      <UppercaseTitle text={capitalizePhrase(jsonData.getInTouch.id)} />

      <Box maxWidth="md" margin="auto">
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {parse(jsonData.getInTouch.content, {
              replace: replacePlainHTMLWithMuiComponents,
            })}
          </Typography>
          <Container sx={{ mt: 3 }}>
            <FeedbackForm />
          </Container>
        </Paper>
      </Box>
    </Container>
  );
}

export default GetInTouch;
