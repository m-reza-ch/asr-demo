import { Paper, Button, TextField, Stack } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";

export function AsrPanel({ title, text, listening, onStart, onStop }) {
  return (
    <Paper elevation={4} sx={{ p: 3, mt: 3, maxWidth: 600 }}>
      <Stack spacing={2}>
        <TextField
          label="Transcription"
          multiline
          rows={6}
          value={text}
          fullWidth
          InputProps={{ readOnly: true }}
        />

        {!listening ? (
          <Button
            startIcon={<MicIcon />}
            variant="contained"
            size="large"
            onClick={onStart}
          >
            Start Recording
          </Button>
        ) : (
          <Button
            startIcon={<StopIcon />}
            color="error"
            variant="contained"
            size="large"
            onClick={onStop}
          >
            Stop Recording
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
