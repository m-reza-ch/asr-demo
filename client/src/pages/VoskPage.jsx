import { useState, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useVoskSTT } from "../hooks/useVoskSTT";
import { AsrPanel } from "../components/AsrPanel";

const lightTheme = createTheme({ palette: { mode: "light" } });

export default function VoskPage() {
  const [display, setDisplay] = useState("");
  const vosk = useVoskSTT(setDisplay);
  const navigate = useNavigate();

  useEffect(() => {
    setDisplay(
      vosk.finalText + (vosk.partialText ? " " + vosk.partialText : "")
    );
  }, [vosk.finalText, vosk.partialText]);

  return (
    <ThemeProvider theme={lightTheme}>
      <Box
        p={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        position="relative"
      >
        {/* Top-right navigation button */}
        <Box position="absolute" top={16} right={16}>
          <Button
            variant="outlined"
            color="info"
            onClick={() => navigate("/whisper")}
          >
            Whisper ASR
          </Button>
        </Box>

        {/* Centered title */}
        <Typography variant="h4" align="center" gutterBottom>
          Vosk (Realtime Persian ASR)
        </Typography>

        {/* Centered ASR Panel */}
        <Box width={{ xs: "90%", sm: "600px" }}>
          <AsrPanel
            text={display}
            listening={vosk.listening}
            onStart={vosk.start}
            onStop={vosk.stop}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
