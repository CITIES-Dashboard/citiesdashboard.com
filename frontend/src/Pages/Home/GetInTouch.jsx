import { Typography, Paper, Box, Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import parse from 'html-react-parser';
import SendIcon from '@mui/icons-material/Send';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import DataObjectIcon from '@mui/icons-material/DataObject';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import UppercaseTitle from '../../Components/UppercaseTitle';
import jsonData from '../../section_data.json';
import { replacePlainHTMLWithMuiComponents, capitalizePhrase } from '../../Utils/Utils';

const googleFormLink = 'https://docs.google.com/forms/d/e/1FAIpQLSenxtTIizWED0PT3hBOn3IU6fwmj4sr1yhjU70mjmK4R-ipsw/';

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiInputLabel-root:not(.MuiInputLabel-shrink), textarea': { fontSize: '0.8rem' }
}));

function FeedbackForm() {
  return (
    <Box
      component="form"
      action={`${googleFormLink}/formResponse`}
      method="get"
      target="_blank"
      // On form submission, wait for 1 second before resetting the form
      onSubmit={() => setTimeout(() => document.getElementById('feedback-form').reset(), 1000)}
      id="feedback-form"
      sx={{
        mt: 3,
        '& svg': {
          verticalAlign: 'middle',
          mr: 0.5
        }
      }}
    >
      <StyledTextField
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
      <StyledTextField
        label={(
          <>
            <DataObjectIcon />
            Do you have a dataset to contribute?
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
      <StyledTextField
        label={(
          <>
            <TipsAndUpdatesIcon />
            How can we improve the user experience?
          </>
        )}
        helperText="For example: the navigation between pages, the data visualizations, the datasets, or any other user interface elements"
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
        fullWidth
        startIcon={<SendIcon />}
        sx={{
          '& .MuiButton-startIcon': {
            mr: 0,
            '& svg': {
              verticalAlign: 'middle',
              fontSize: '0.8rem !important'
            }
          }
        }}
      >
        Submit
      </Button>
      <Typography
        variant="caption"
        component="p"
        color="text.secondary"
        sx={{ mt: 0.5, fontStyle: 'italic' }}
      >
        By clicking the
        <b> Submit </b>
        button, you will be re-directed to Google Form&apos;s post-submission page.
      </Typography>
    </Box>
  );
}

function GetInTouch() {
  return (
    <>
      <UppercaseTitle text={capitalizePhrase(jsonData.getInTouch.id)} />

      <Box maxWidth="lg" margin="auto">
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {parse(jsonData.getInTouch.content, {
              replace: replacePlainHTMLWithMuiComponents,
            })}
          </Typography>
          <FeedbackForm />
        </Paper>
      </Box>
    </>
  );
}

export default GetInTouch;
